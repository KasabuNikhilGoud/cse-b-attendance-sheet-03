
import { Student } from "@/components/AttendanceSheet";
import { format } from "date-fns";

const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const sendWhatsAppAttendance = async (
  students: Student[], 
  selectedDate: Date
): Promise<boolean> => {
  try {
    const absentStudents = students.filter(s => s.isAbsent);
    
    let message = `III-I CSE-B Attendance Report\n`;
    message += `Date: ${format(selectedDate, "EEEE, MMMM do, yyyy")}\n`;
    message += `Time: ${format(new Date(), "hh:mm a")}\n\n`;
    
    message += `Absent Students (${absentStudents.length}):\n`;
    if (absentStudents.length > 0) {
      message += absentStudents.map(student => student.rollNumber).join(", ");
      message += `\n\n`;
    } else {
      message += `\n\n`;
    }
    
    message += `Summary:\n`;
    message += `Total Students: ${students.length}\n`;
    message += `Present: ${students.length - absentStudents.length}\n`;
    message += `Absent: ${absentStudents.length}`;

    // Create WhatsApp URL - always use whatsapp:// for direct app opening
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;
    
    // Try to open WhatsApp app directly
    if (isMobileDevice()) {
      window.location.href = whatsappUrl;
    } else {
      // For desktop, try app first, fallback to web
      const newWindow = window.open(whatsappUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        // Fallback to WhatsApp Web
        window.open(`https://web.whatsapp.com/send?text=${encodedMessage}`, '_blank');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    return false;
  }
};

export const getLastSentTimestamp = (): string | null => {
  return localStorage.getItem('last_attendance_sent');
};

export const setLastSentTimestamp = (): void => {
  localStorage.setItem('last_attendance_sent', new Date().toISOString());
};
