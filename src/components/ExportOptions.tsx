import React, { useState } from 'react';
import { format } from 'date-fns';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Student } from './AttendanceSheet';
import html2canvas from 'html2canvas';

interface ExportOptionsProps {
  students: Student[];
  selectedDate: Date;
  allAttendanceData: Record<string, Student[]>;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  students, 
  selectedDate, 
  allAttendanceData 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportAsImage = async () => {
    try {
      // Create a temporary div with the attendance report content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      const presentCount = students.filter(s => !s.isAbsent).length;
      const absentCount = students.filter(s => s.isAbsent).length;
      const absentStudents = students.filter(s => s.isAbsent);
      
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: bold;">📊 III-I CSE-B CLASS ATTENDANCE</h1>
          <h2 style="color: #1f2937; margin: 5px 0; font-size: 24px; font-weight: bold;">NNRG COLLEGE 2023-2027</h2>
          <p style="color: #6b7280; margin: 10px 0; font-size: 16px;">📅 Date: ${format(selectedDate, 'EEEE, MMMM do, yyyy')}</p>
          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">🕐 Time: ${format(new Date(), 'h:mm a')}</p>
        </div>
        
        <div style="display: flex; justify-content: space-around; margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <div style="text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #10b981;">✅ ${presentCount}</div>
            <div style="color: #6b7280; font-size: 12px;">Present</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #ef4444;">❌ ${absentCount}</div>
            <div style="color: #6b7280; font-size: 12px;">Absent</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 28px; font-weight: bold; color: #3b82f6;">👥 ${students.length}</div>
            <div style="color: #6b7280; font-size: 12px;">Total</div>
          </div>
        </div>
        
        ${absentCount > 0 ? `
          <div style="margin-top: 30px;">
            <h3 style="color: #ef4444; margin-bottom: 15px; font-size: 18px; font-weight: bold;">❌ Absent Students (${absentCount})</h3>
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
              <div style="color: #991b1b; font-size: 24px; font-weight: bold; text-align: center;">
                ${absentStudents.map(student => student.rollNumber).join(', ')}
              </div>
            </div>
          </div>
        ` : `
          <div style="margin-top: 30px; text-align: center; color: #10b981; font-size: 18px; font-weight: bold;">
            🎉 Perfect Attendance - All Students Present!
          </div>
        `}
      `;
      
      document.body.appendChild(tempDiv);
      
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        width: 800,
        height: tempDiv.scrollHeight
      });
      
      document.body.removeChild(tempDiv);
      
      const link = document.createElement('a');
      link.download = `attendance-report-${format(selectedDate, 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting as image:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export as image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAsImage();
      
      toast({
        title: "Export Successful",
        description: "Attendance data exported as image.",
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

  const presentCount = students.filter(s => !s.isAbsent).length;
  const absentCount = students.filter(s => s.isAbsent).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Share Attendance Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Date:</span>
                <br />
                {format(selectedDate, 'EEEE, MMMM do, yyyy')}
              </div>
              <div>
                <span className="font-medium">Summary:</span>
                <br />
                Present: {presentCount} | Absent: {absentCount}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full h-16 flex flex-col gap-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Image className="h-6 w-6" />
            {isExporting ? "Generating Image..." : "Download Attendance Image"}
          </Button>
          
          {isExporting && (
            <div className="text-center text-sm text-gray-600">
              Creating attendance image for sharing...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportOptions;
