
import React from "react";
import { format } from "date-fns";
import { UserX, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "./AttendanceSheet";

interface AbsentStudentsScreenProps {
  students: Student[];
  selectedDate: Date;
}

const AbsentStudentsScreen: React.FC<AbsentStudentsScreenProps> = ({ 
  students, 
  selectedDate 
}) => {
  const absentStudents = students.filter(s => s.isAbsent);
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">CSE-B</h1>
        <div className="flex items-center justify-center gap-2 text-lg text-gray-600 mb-2">
          <Calendar className="h-5 w-5" />
          <span>{format(selectedDate, "EEEE")}</span>
        </div>
        <div className="text-md text-gray-600 mb-4">
          {format(selectedDate, "MMMM do, yyyy")}
        </div>
      </div>

      {/* Absent Students Card */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-red-700">
            <UserX className="h-6 w-6" />
            Number of Absentees: {absentStudents.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {absentStudents.length > 0 ? (
            <div className="space-y-3">
              {/* Roll numbers list */}
              <div className="p-3 bg-white border border-red-200 rounded-lg">
                <div className="text-sm text-gray-600 mb-2 font-medium">Absent Roll Numbers:</div>
                <div className="text-red-700 font-medium">
                  {absentStudents.map(student => student.rollNumber).join(", ")}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserX className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg">No absent students today!</p>
              <p className="text-sm">All students are present.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AbsentStudentsScreen;
