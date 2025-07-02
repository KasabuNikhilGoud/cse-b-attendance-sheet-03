
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Student } from './AttendanceSheet';
import { motion } from 'framer-motion';
import { User, Check, X } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onToggleAbsent: (rollNumber: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onToggleAbsent }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-300 border hover:shadow-lg",
          student.isAbsent 
            ? "border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300" 
            : "border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300"
        )}
        onClick={() => onToggleAbsent(student.rollNumber)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <User className={cn(
                    "h-5 w-5 transition-colors",
                    student.isAbsent ? "text-red-600" : "text-green-600"
                  )} />
                  <div className="absolute -top-1 -right-1">
                    {student.isAbsent ? (
                      <X className="h-3 w-3 text-red-600" />
                    ) : (
                      <Check className="h-3 w-3 text-green-600" />
                    )}
                  </div>
                </div>
                <div className="font-mono text-lg font-bold text-gray-800 tracking-wide">
                  {student.rollNumber}
                </div>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all duration-200",
                student.isAbsent 
                  ? "bg-red-200 text-red-800 hover:bg-red-300" 
                  : "bg-green-200 text-green-800 hover:bg-green-300"
              )}>
                {student.isAbsent ? "ABSENT" : "PRESENT"}
              </div>
            </div>
            <div className="font-medium text-gray-900 text-sm leading-relaxed tracking-wide">
              {student.name}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentCard;
