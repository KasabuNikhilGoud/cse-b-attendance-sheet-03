
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, ArrowLeftRight, TrendingUp, TrendingDown, Equal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student } from './AttendanceSheet';

interface DateComparisonProps {
  historicalData: Record<string, Student[]>;
}

const DateComparison: React.FC<DateComparisonProps> = ({ historicalData }) => {
  const [date1, setDate1] = useState<string>('');
  const [date2, setDate2] = useState<string>('');

  const dates = Object.keys(historicalData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const getAttendanceStats = (students: Student[]) => {
    const present = students.filter(s => !s.isAbsent).length;
    const absent = students.filter(s => s.isAbsent).length;
    const rate = students.length > 0 ? Math.round((present / students.length) * 100) : 0;
    return { total: students.length, present, absent, rate };
  };

  const getComparison = () => {
    if (!date1 || !date2) return null;
    
    const stats1 = getAttendanceStats(historicalData[date1]);
    const stats2 = getAttendanceStats(historicalData[date2]);
    
    const rateDiff = stats2.rate - stats1.rate;
    const presentDiff = stats2.present - stats1.present;
    const absentDiff = stats2.absent - stats1.absent;
    
    return {
      date1: { date: date1, ...stats1 },
      date2: { date: date2, ...stats2 },
      differences: {
        rate: rateDiff,
        present: presentDiff,
        absent: absentDiff
      }
    };
  };

  const comparison = getComparison();

  const getDifferenceIcon = (diff: number) => {
    if (diff > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (diff < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Equal className="h-4 w-4 text-gray-500" />;
  };

  const getDifferenceColor = (diff: number, type: 'rate' | 'present' | 'absent') => {
    if (type === 'absent') {
      // For absences, negative is good (fewer absences)
      if (diff > 0) return 'text-red-600';
      if (diff < 0) return 'text-green-600';
    } else {
      // For rate and present, positive is good
      if (diff > 0) return 'text-green-600';
      if (diff < 0) return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Date Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Date</label>
          <Select value={date1} onValueChange={setDate1}>
            <SelectTrigger>
              <SelectValue placeholder="Select first date" />
            </SelectTrigger>
            <SelectContent>
              {dates.map(date => (
                <SelectItem key={date} value={date}>
                  {format(parseISO(date), 'EEEE, MMM do, yyyy')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Second Date</label>
          <Select value={date2} onValueChange={setDate2}>
            <SelectTrigger>
              <SelectValue placeholder="Select second date" />
            </SelectTrigger>
            <SelectContent>
              {dates.map(date => (
                <SelectItem key={date} value={date}>
                  {format(parseISO(date), 'EEEE, MMM do, yyyy')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {comparison && (
        <div className="space-y-6">
          {/* Comparison Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5" />
                Comparison Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg font-bold">Attendance Rate</span>
                    {getDifferenceIcon(comparison.differences.rate)}
                  </div>
                  <div className={`text-2xl font-bold ${getDifferenceColor(comparison.differences.rate, 'rate')}`}>
                    {comparison.differences.rate > 0 ? '+' : ''}{comparison.differences.rate}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {comparison.date1.rate}% → {comparison.date2.rate}%
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg font-bold">Present Students</span>
                    {getDifferenceIcon(comparison.differences.present)}
                  </div>
                  <div className={`text-2xl font-bold ${getDifferenceColor(comparison.differences.present, 'present')}`}>
                    {comparison.differences.present > 0 ? '+' : ''}{comparison.differences.present}
                  </div>
                  <div className="text-sm text-gray-600">
                    {comparison.date1.present} → {comparison.date2.present}
                  </div>
                </div>

                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg font-bold">Absent Students</span>
                    {getDifferenceIcon(comparison.differences.absent)}
                  </div>
                  <div className={`text-2xl font-bold ${getDifferenceColor(comparison.differences.absent, 'absent')}`}>
                    {comparison.differences.absent > 0 ? '+' : ''}{comparison.differences.absent}
                  </div>
                  <div className="text-sm text-gray-600">
                    {comparison.date1.absent} → {comparison.date2.absent}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Side by Side Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {format(parseISO(comparison.date1.date), 'MMM do, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{comparison.date1.total}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{comparison.date1.present}</div>
                      <div className="text-sm text-gray-600">Present</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{comparison.date1.absent}</div>
                      <div className="text-sm text-gray-600">Absent</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{comparison.date1.rate}%</div>
                    <div className="text-sm text-gray-600">Attendance Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {format(parseISO(comparison.date2.date), 'MMM do, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{comparison.date2.total}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{comparison.date2.present}</div>
                      <div className="text-sm text-gray-600">Present</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{comparison.date2.absent}</div>
                      <div className="text-sm text-gray-600">Absent</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{comparison.date2.rate}%</div>
                    <div className="text-sm text-gray-600">Attendance Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!comparison && (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg text-gray-600">Select two dates to compare attendance data</p>
        </Card>
      )}
    </div>
  );
};

export default DateComparison;
