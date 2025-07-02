
import React from 'react';
import { format } from 'date-fns';
import { Calendar, UserCheck, UserX, MessageCircle, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AttendanceControlsProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  presentCount: number;
  absentCount: number;
  onWhatsAppSend: () => void;
  onShowExportOptions: () => void;
  onShowEmailConfig: () => void;
}

const AttendanceControls: React.FC<AttendanceControlsProps> = ({
  selectedDate,
  onDateChange,
  presentCount,
  absentCount,
  onWhatsAppSend,
  onShowExportOptions,
  onShowEmailConfig
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Attendance for {format(selectedDate, "EEEE, MMMM do, yyyy")}
        </h2>
        <p className="text-gray-600">
          Select a date and mark students as absent using the toggle switches.
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal bg-white/50 border-blue-200 hover:bg-blue-50",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <div className="flex items-center gap-6">
          <motion.div 
            className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <UserCheck className="h-5 w-5" />
            <span className="font-semibold">Present: {presentCount}</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <UserX className="h-5 w-5" />
            <span className="font-semibold">Absent: {absentCount}</span>
          </motion.div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={onShowExportOptions}
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <Download className="mr-2 h-4 w-4" />
            Share Image
          </Button>

          <Button 
            variant="outline" 
            onClick={onShowEmailConfig}
            className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </Button>
          
          <Button 
            onClick={onWhatsAppSend}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Send Attendance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceControls;
