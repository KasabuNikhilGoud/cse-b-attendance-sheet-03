
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Student } from './AttendanceSheet';
import { format, subDays } from 'date-fns';
import { getStorageKey } from '@/utils/attendanceUtils';

interface AttendanceChartProps {
  students: Student[];
  allAttendanceData: Record<string, Student[]>;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ students, allAttendanceData }) => {
  const presentCount = students.filter(s => !s.isAbsent).length;
  const absentCount = students.filter(s => s.isAbsent).length;

  const pieData = [
    { name: 'Present', value: presentCount, color: '#10b981' },
    { name: 'Absent', value: absentCount, color: '#ef4444' }
  ];

  // Generate trend data for the last 7 days
  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateKey = getStorageKey(date);
    const dayData = allAttendanceData[dateKey] || [];
    const dayPresent = dayData.filter(s => !s.isAbsent).length;
    const dayAbsent = dayData.filter(s => s.isAbsent).length;
    
    trendData.push({
      date: format(date, 'MMM dd'),
      present: dayPresent,
      absent: dayAbsent,
      total: dayPresent + dayAbsent
    });
  }

  // Top absentees data
  const absenteeData: Record<string, number> = {};
  Object.values(allAttendanceData).forEach(dayData => {
    dayData.forEach(student => {
      if (student.isAbsent) {
        absenteeData[student.name] = (absenteeData[student.name] || 0) + 1;
      }
    });
  });

  const topAbsentees = Object.entries(absenteeData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name: name.split(' ').slice(0, 2).join(' '), absences: count }));

  const chartConfig = {
    present: { label: 'Present', color: '#10b981' },
    absent: { label: 'Absent', color: '#ef4444' }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Today's Attendance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Present ({presentCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Absent ({absentCount})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Top Absentees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Frequent Absentees</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topAbsentees} layout="horizontal">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                  <Bar dataKey="absences" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart - 7-Day Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">7-Day Attendance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Line 
                  type="monotone" 
                  dataKey="present" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="absent" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-sm text-gray-600">Present Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <p className="text-sm text-gray-600">Absent Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-600">Attendance Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">{students.length}</div>
            <p className="text-sm text-gray-600">Total Students</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceChart;
