
import React from 'react';
import { Calendar } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AttendanceHeader: React.FC = () => {
  return (
    <CardHeader className="pb-6 text-center">
      <CardTitle className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3">
        <Calendar className="h-7 w-7 text-primary" />
        III-I CSE-B CLASS ATTENDANCE
      </CardTitle>
      <div className="text-sm font-medium text-muted-foreground mb-2">
        NNRG COLLEGE • 2023-2027
      </div>
      <CardDescription className="text-muted-foreground max-w-2xl mx-auto">
        Track attendance efficiently with smart analytics, instant notifications, and comprehensive reporting tools designed for students.
      </CardDescription>
    </CardHeader>
  );
};

export default AttendanceHeader;
