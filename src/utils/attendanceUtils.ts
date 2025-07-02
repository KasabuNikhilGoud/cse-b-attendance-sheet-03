
import { Student } from "@/components/AttendanceSheet";

const STORAGE_KEY = 'attendance_data';

export const getStorageKey = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const loadAttendanceData = (): Record<string, Student[]> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Error loading attendance data:', error);
    return {};
  }
};

export const saveAttendanceData = (data: Record<string, Student[]>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Attendance data saved successfully');
  } catch (error) {
    console.error('Error saving attendance data:', error);
  }
};

export const getAttendanceForDate = (date: Date, allData: Record<string, Student[]>): Student[] | null => {
  const dateKey = getStorageKey(date);
  return allData[dateKey] || null;
};

export const exportAttendanceData = (allData: Record<string, Student[]>): string => {
  const csvHeaders = ['Date', 'Roll Number', 'Student Name', 'Status'];
  const csvRows = [csvHeaders.join(',')];
  
  Object.entries(allData).forEach(([date, students]) => {
    students.forEach(student => {
      const row = [
        date,
        student.rollNumber,
        student.name,
        student.isAbsent ? 'Absent' : 'Present'
      ];
      csvRows.push(row.join(','));
    });
  });
  
  return csvRows.join('\n');
};
