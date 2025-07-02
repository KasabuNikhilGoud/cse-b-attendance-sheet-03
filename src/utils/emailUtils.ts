
import { Student } from "@/components/AttendanceSheet";
import { format } from "date-fns";

export const generateScreenshotHTML = (students: Student[], selectedDate: Date): string => {
  const absentStudents = students.filter(s => s.isAbsent);
  
  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 24px; background: white; font-family: Arial, sans-serif;">
      <div style="text-center; margin-bottom: 24px;">
        <h1 style="font-size: 32px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">CSE-B</h1>
        <div style="font-size: 18px; color: #4b5563; margin-bottom: 4px;">
          ${format(selectedDate, "EEEE")}
        </div>
        <div style="font-size: 16px; color: #4b5563; margin-bottom: 16px;">
          ${format(selectedDate, "MMMM do, yyyy")}
        </div>
      </div>

      <div style="border: 2px solid #fecaca; background: #fef2f2; border-radius: 8px; padding: 16px;">
        <div style="text-align: center; padding-bottom: 16px;">
          <h2 style="color: #b91c1c; font-size: 20px; margin-bottom: 8px;">
            Absent Students (${absentStudents.length})
          </h2>
        </div>
        
        ${absentStudents.length > 0 ? `
          <div style="margin-bottom: 16px;">
            ${absentStudents.map(student => `
              <div style="display: flex; justify-content: space-between; background: #fecaca; border: 1px solid #f87171; border-radius: 6px; padding: 12px; margin-bottom: 8px;">
                <span style="font-weight: 500; color: #991b1b;">${student.rollNumber}</span>
                <span style="font-size: 14px; color: #7f1d1d;">${student.name}</span>
              </div>
            `).join('')}
          </div>
          
          <div style="background: white; border: 1px solid #f87171; border-radius: 6px; padding: 12px;">
            <div style="font-size: 14px; color: #4b5563; font-weight: 500; margin-bottom: 8px;">Roll Numbers:</div>
            <div style="color: #b91c1c;">
              ${absentStudents.map(student => student.rollNumber).join(", ")}
            </div>
          </div>
        ` : `
          <div style="text-align: center; padding: 32px; color: #6b7280;">
            <p style="font-size: 18px; margin-bottom: 8px;">No absent students today!</p>
            <p style="font-size: 14px;">All students are present.</p>
          </div>
        `}
      </div>

      <div style="margin-top: 24px; text-align: center; font-size: 14px; color: #4b5563;">
        <p>Total Students: ${students.length} | Present: ${students.length - absentStudents.length} | Absent: ${absentStudents.length}</p>
      </div>
    </div>
  `;
};

export const sendAttendanceEmail = async (students: Student[], selectedDate: Date): Promise<boolean> => {
  try {
    const screenshotHTML = generateScreenshotHTML(students, selectedDate);
    const subject = `CSE-B Attendance - ${format(selectedDate, "MMMM do, yyyy")}`;
    const absentCount = students.filter(s => s.isAbsent).length;
    
    // Create mailto link with the HTML content as plain text
    const emailBody = `CSE-B Attendance Report
Date: ${format(selectedDate, "EEEE, MMMM do, yyyy")}

Absent Students (${absentCount}):
${students.filter(s => s.isAbsent).map(student => 
  `${student.rollNumber} - ${student.name}`
).join('\n')}

Roll Numbers: ${students.filter(s => s.isAbsent).map(s => s.rollNumber).join(', ')}

Summary:
Total Students: ${students.length}
Present: ${students.length - absentCount}
Absent: ${absentCount}`;

    const mailtoLink = `mailto:kasabunikhilgoud@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open the default email client
    window.open(mailtoLink, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
