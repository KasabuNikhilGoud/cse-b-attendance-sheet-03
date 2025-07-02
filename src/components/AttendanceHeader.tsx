
import React from 'react';
import { Calendar } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AttendanceHeader: React.FC = () => {
  return (
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
        <Calendar className="h-6 w-6 text-blue-500" />
        III-I CSE-B CLASS ATTENDANCE NNRG COLLEGE 2023-2027
      </CardTitle>
      <CardDescription className="text-gray-600">
        Manage attendance, view analytics, and track historical data with modern tools.
      </CardDescription>
    </CardHeader>
  );
};

export default AttendanceHeader;
