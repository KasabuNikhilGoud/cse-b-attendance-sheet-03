
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "./AttendanceSheet";

interface AttendanceStatsProps {
  students: Student[];
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ students }) => {
  const totalStudents = students.length;
  const presentToday = students.filter(s => !s.isAbsent).length;
  const absentToday = students.filter(s => s.isAbsent).length;
  const attendanceRate = Math.round((presentToday / totalStudents) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Attendance Rate
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendanceRate}%</div>
          <p className="text-xs text-muted-foreground">
            {presentToday} of {totalStudents} present today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Present Today
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{presentToday}</div>
          <p className="text-xs text-muted-foreground">
            Students in attendance
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Absent Today
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{absentToday}</div>
          <p className="text-xs text-muted-foreground">
            Students not present
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStats;
