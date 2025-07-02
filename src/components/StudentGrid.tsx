
import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import StudentCard from './StudentCard';
import { Student } from './AttendanceSheet';

interface StudentGridProps {
  students: Student[];
  onToggleAbsent: (rollNumber: string) => void;
}

const StudentGrid: React.FC<StudentGridProps> = ({ students, onToggleAbsent }) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <Users className="h-5 w-5 text-blue-500" />
          Student Roster ({students.length} students)
        </CardTitle>
        <CardDescription className="text-gray-600">
          Use the toggle switches to mark students as present or absent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {students.map((student, index) => (
              <motion.div
                key={student.rollNumber}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <StudentCard
                  student={student}
                  onToggleAbsent={onToggleAbsent}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default StudentGrid;
