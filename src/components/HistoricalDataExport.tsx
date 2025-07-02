import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Download, FileText, Table, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Student } from './AttendanceSheet';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface HistoricalDataExportProps {
  historicalData: Record<string, Student[]>;
}

const HistoricalDataExport: React.FC<HistoricalDataExportProps> = ({ historicalData }) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const dates = Object.keys(historicalData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const handleDateToggle = (date: string, checked: boolean) => {
    if (checked) {
      setSelectedDates(prev => [...prev, date]);
    } else {
      setSelectedDates(prev => prev.filter(d => d !== date));
    }
  };

  const selectAllDates = () => {
    setSelectedDates(dates);
  };

  const clearAllDates = () => {
    setSelectedDates([]);
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Historical Attendance Report', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'EEEE, MMMM do, yyyy')}`, 20, 45);
    doc.text(`Class: CSE-B`, 20, 55);
    doc.text(`Records: ${selectedDates.length} dates`, 20, 65);
    
    let yPos = 85;
    
    // Summary Statistics
    const totalRecords = selectedDates.length;
    const totalAttendanceData = selectedDates.map(date => {
      const students = historicalData[date];
      const present = students.filter(s => !s.isAbsent).length;
      const absent = students.filter(s => s.isAbsent).length;
      const rate = students.length > 0 ? (present / students.length) * 100 : 0;
      return { date, present, absent, total: students.length, rate };
    });
    
    const avgAttendance = totalAttendanceData.reduce((sum, data) => sum + data.rate, 0) / totalRecords;
    const totalPresent = totalAttendanceData.reduce((sum, data) => sum + data.present, 0);
    const totalAbsent = totalAttendanceData.reduce((sum, data) => sum + data.absent, 0);
    
    doc.setFontSize(14);
    doc.text('Summary Statistics:', 20, yPos);
    yPos += 20;
    
    doc.setFontSize(10);
    doc.text(`Average Attendance Rate: ${avgAttendance.toFixed(1)}%`, 25, yPos);
    yPos += 10;
    doc.text(`Total Present (across all dates): ${totalPresent}`, 25, yPos);
    yPos += 10;
    doc.text(`Total Absent (across all dates): ${totalAbsent}`, 25, yPos);
    yPos += 20;
    
    // Process each selected date
    selectedDates.forEach((date, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 30;
      }
      
      const students = historicalData[date];
      const present = students.filter(s => !s.isAbsent).length;
      const absent = students.filter(s => s.isAbsent).length;
      const rate = students.length > 0 ? Math.round((present / students.length) * 100) : 0;
      
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${format(parseISO(date), 'EEEE, MMMM do, yyyy')}`, 20, yPos);
      yPos += 15;
      
      doc.setFontSize(10);
      doc.text(`Present: ${present} | Absent: ${absent} | Rate: ${rate}%`, 25, yPos);
      yPos += 15;
      
      if (includeDetails && absent > 0) {
        doc.text('Absent Students:', 25, yPos);
        yPos += 10;
        
        const absentStudents = students.filter(s => s.isAbsent);
        absentStudents.forEach(student => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 30;
          }
          doc.text(`• ${student.rollNumber} - ${student.name}`, 35, yPos);
          yPos += 8;
        });
        yPos += 5;
      }
      
      yPos += 10;
    });
    
    doc.save(`historical-attendance-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const exportToExcel = async () => {
    const wb = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = selectedDates.map(date => {
      const students = historicalData[date];
      const present = students.filter(s => !s.isAbsent).length;
      const absent = students.filter(s => s.isAbsent).length;
      const rate = students.length > 0 ? Math.round((present / students.length) * 100) : 0;
      
      return {
        Date: format(parseISO(date), 'yyyy-MM-dd'),
        'Day of Week': format(parseISO(date), 'EEEE'),
        'Total Students': students.length,
        Present: present,
        Absent: absent,
        'Attendance Rate (%)': rate
      };
    });
    
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
    
    // Detailed sheets for each date (if details are included)
    if (includeDetails) {
      selectedDates.forEach(date => {
        const students = historicalData[date];
        const detailData = students.map(student => ({
          'Roll Number': student.rollNumber,
          Name: student.name,
          Email: student.email,
          Status: student.isAbsent ? 'Absent' : 'Present'
        }));
        
        const detailWs = XLSX.utils.json_to_sheet(detailData);
        const sheetName = format(parseISO(date), 'MMM-dd');
        XLSX.utils.book_append_sheet(wb, detailWs, sheetName);
      });
    }
    
    XLSX.writeFile(wb, `historical-attendance-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const exportToCSV = async () => {
    const csvData = selectedDates.flatMap(date => {
      const students = historicalData[date];
      return students.map(student => ({
        Date: format(parseISO(date), 'yyyy-MM-dd'),
        'Day of Week': format(parseISO(date), 'EEEE'),
        'Roll Number': student.rollNumber,
        Name: student.name,
        Email: student.email,
        Status: student.isAbsent ? 'Absent' : 'Present'
      }));
    });
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(csvData);
    XLSX.utils.book_append_sheet(wb, ws, 'Historical Data');
    XLSX.writeFile(wb, `historical-attendance-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const handleExport = async () => {
    if (selectedDates.length === 0) {
      toast({
        title: "No dates selected",
        description: "Please select at least one date to export.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      switch (exportFormat) {
        case 'pdf':
          await exportToPDF();
          break;
        case 'excel':
          await exportToExcel();
          break;
        case 'csv':
          await exportToCSV();
          break;
      }
      
      toast({
        title: "Export Successful",
        description: `Historical data exported as ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Export Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select value={exportFormat} onValueChange={(value: 'pdf' | 'excel' | 'csv') => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF Report
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      Excel Spreadsheet
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      CSV File
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeDetails" 
                checked={includeDetails}
                onCheckedChange={(checked) => setIncludeDetails(checked === true)}
              />
              <label htmlFor="includeDetails" className="text-sm font-medium">
                Include detailed student information
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Dates ({selectedDates.length} of {dates.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAllDates}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={clearAllDates}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {dates.map(date => {
              const students = historicalData[date];
              const present = students.filter(s => !s.isAbsent).length;
              const absent = students.filter(s => s.isAbsent).length;
              const rate = students.length > 0 ? Math.round((present / students.length) * 100) : 0;
              
              return (
                <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={selectedDates.includes(date)}
                      onCheckedChange={(checked) => handleDateToggle(date, checked === true)}
                    />
                    <div>
                      <div className="font-medium">
                        {format(parseISO(date), 'EEEE, MMMM do, yyyy')}
                      </div>
                      <div className="text-sm text-gray-600">
                        Present: {present} | Absent: {absent} | Rate: {rate}%
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    rate >= 80 ? 'bg-green-100 text-green-700' :
                    rate >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {rate}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handleExport}
            disabled={isExporting || selectedDates.length === 0}
            className="w-full"
            size="lg"
          >
            <Download className="mr-2 h-5 w-5" />
            {isExporting ? 'Exporting...' : `Export ${selectedDates.length} Records as ${exportFormat.toUpperCase()}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricalDataExport;
