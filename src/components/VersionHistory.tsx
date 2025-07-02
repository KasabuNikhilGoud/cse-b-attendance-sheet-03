
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Users, UserCheck, UserX, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Student } from './AttendanceSheet';
import { loadAttendanceData } from '@/utils/attendanceUtils';
import DateComparison from './DateComparison';
import HistoricalDataExport from './HistoricalDataExport';

interface VersionHistoryProps {
  currentStudents: Student[];
  selectedDate: Date;
}

interface AttendanceRecord {
  date: string;
  students: Student[];
  timestamp: string;
  present: number;
  absent: number;
  attendanceRate: number;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ currentStudents, selectedDate }) => {
  const [historicalData, setHistoricalData] = useState<Record<string, Student[]>>({});
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    const data = loadAttendanceData();
    setHistoricalData(data);
    
    // Convert historical data to records with timestamps
    const records: AttendanceRecord[] = Object.entries(data).map(([dateKey, students]) => {
      const present = students.filter(s => !s.isAbsent).length;
      const absent = students.filter(s => s.isAbsent).length;
      const attendanceRate = students.length > 0 ? Math.round((present / students.length) * 100) : 0;
      
      // Get timestamp from localStorage or use current time as fallback
      const timestamp = localStorage.getItem(`timestamp_${dateKey}`) || new Date().toISOString();
      
      return {
        date: dateKey,
        students,
        timestamp,
        present,
        absent,
        attendanceRate
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setAttendanceRecords(records);
  }, []);

  // Save timestamp when data is updated
  useEffect(() => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const timestamp = new Date().toISOString();
    localStorage.setItem(`timestamp_${dateKey}`, timestamp);
  }, [selectedDate, currentStudents]);

  const isToday = (dateString: string) => {
    return dateString === format(new Date(), 'yyyy-MM-dd');
  };

  const getStatusColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (rate >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Attendance History Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{attendanceRecords.length}</div>
              <div className="text-sm text-blue-600">Total Records</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {attendanceRecords.length > 0 
                  ? Math.round(attendanceRecords.reduce((sum, record) => sum + record.attendanceRate, 0) / attendanceRecords.length)
                  : 0}%
              </div>
              <div className="text-sm text-green-600">Average Attendance</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {attendanceRecords.reduce((sum, record) => sum + record.present, 0)}
              </div>
              <div className="text-sm text-orange-600">Total Present</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {attendanceRecords.reduce((sum, record) => sum + record.absent, 0)}
              </div>
              <div className="text-sm text-red-600">Total Absent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {attendanceRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No attendance records found.</p>
                <p className="text-sm">Start taking attendance to see historical data here.</p>
              </div>
            ) : (
              attendanceRecords.map((record) => (
                <div
                  key={record.date}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedRecord?.date === record.date ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  } ${isToday(record.date) ? 'ring-2 ring-blue-200' : ''}`}
                  onClick={() => setSelectedRecord(selectedRecord?.date === record.date ? null : record)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {format(parseISO(record.date), 'EEEE, MMMM do, yyyy')}
                        </h3>
                        {isToday(record.date) && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Today
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Updated: {format(parseISO(record.timestamp), 'hh:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{record.students.length} students</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-green-600">
                          <UserCheck className="h-4 w-4" />
                          <span className="font-medium">{record.present} Present</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-600">
                          <UserX className="h-4 w-4" />
                          <span className="font-medium">{record.absent} Absent</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(record.attendanceRate)}`}>
                        {record.attendanceRate}%
                      </div>
                    </div>
                  </div>
                  
                  {selectedRecord?.date === record.date && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {record.absent > 0 && (
                          <div>
                            <h4 className="font-medium text-red-600 mb-2">Absent Students ({record.absent})</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {record.students.filter(s => s.isAbsent).map(student => (
                                <div key={student.rollNumber} className="text-sm bg-red-50 p-2 rounded">
                                  <span className="font-medium">{student.rollNumber}</span> - {student.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {record.present > 0 && (
                          <div>
                            <h4 className="font-medium text-green-600 mb-2">Present Students ({record.present})</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {record.students.filter(s => !s.isAbsent).slice(0, 5).map(student => (
                                <div key={student.rollNumber} className="text-sm bg-green-50 p-2 rounded">
                                  <span className="font-medium">{student.rollNumber}</span> - {student.name}
                                </div>
                              ))}
                              {record.present > 5 && (
                                <div className="text-sm text-gray-500 p-2">
                                  + {record.present - 5} more students
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Date Comparison */}
      {attendanceRecords.length >= 2 && (
        <DateComparison historicalData={historicalData} />
      )}

      {/* Historical Data Export */}
      {attendanceRecords.length > 0 && (
        <HistoricalDataExport historicalData={historicalData} />
      )}
    </div>
  );
};

export default VersionHistory;
