import React, { useState } from 'react';
import { format } from 'date-fns';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Student } from './AttendanceSheet';
import html2canvas from 'html2canvas';

interface ExportOptionsProps {
  students: Student[];
  selectedDate: Date;
  allAttendanceData: Record<string, Student[]>;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  students, 
  selectedDate, 
  allAttendanceData 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportAsImage = async () => {
    try {
      // Create a temporary div with the attendance report content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      const presentCount = students.filter(s => !s.isAbsent).length;
      const absentCount = students.filter(s => s.isAbsent).length;
      const absentStudents = students.filter(s => s.isAbsent);
      
      tempDiv.innerHTML = `
        <!-- University Header with Gradient -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; margin: -40px -40px 40px -40px; color: white; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>'); opacity: 0.3;"></div>
          <div style="position: relative; z-index: 1;">
            <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 20px; padding: 25px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.2);">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: 1px;">🎓 NNRG COLLEGE OF ENGINEERING</h1>
              <div style="height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); margin: 15px auto; width: 60%;"></div>
              <h2 style="margin: 0; font-size: 24px; font-weight: 600; opacity: 0.95;">DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING</h2>
              <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 500; opacity: 0.9;">III-I CSE-B CLASS ATTENDANCE REPORT</p>
            </div>
            <div style="display: flex; justify-content: center; gap: 30px; margin-top: 20px;">
              <div style="background: rgba(255,255,255,0.1); padding: 15px 25px; border-radius: 15px; backdrop-filter: blur(5px);">
                <div style="font-size: 14px; opacity: 0.9;">📅 ${format(selectedDate, 'EEEE, MMMM do, yyyy')}</div>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 15px 25px; border-radius: 15px; backdrop-filter: blur(5px);">
                <div style="font-size: 14px; opacity: 0.9;">🕐 ${format(new Date(), 'h:mm a')}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Statistics Cards -->
        <div style="display: flex; justify-content: space-between; gap: 20px; margin: 40px 0;">
          <div style="flex: 1; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px 20px; border-radius: 20px; text-align: center; color: white; box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="font-size: 48px; font-weight: 800; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${presentCount}</div>
              <div style="font-size: 16px; font-weight: 600; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px;">Present</div>
              <div style="font-size: 12px; opacity: 0.7; margin-top: 5px;">✅ Students</div>
            </div>
          </div>
          
          <div style="flex: 1; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 30px 20px; border-radius: 20px; text-align: center; color: white; box-shadow: 0 10px 30px rgba(250, 112, 154, 0.3); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="font-size: 48px; font-weight: 800; margin-bottom: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${absentCount}</div>
              <div style="font-size: 16px; font-weight: 600; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px;">Absent</div>
              <div style="font-size: 12px; opacity: 0.7; margin-top: 5px;">❌ Students</div>
            </div>
          </div>
          
          <div style="flex: 1; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 30px 20px; border-radius: 20px; text-align: center; color: #2d3748; box-shadow: 0 10px 30px rgba(168, 237, 234, 0.3); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.2); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="font-size: 48px; font-weight: 800; margin-bottom: 8px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${students.length}</div>
              <div style="font-size: 16px; font-weight: 600; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Total</div>
              <div style="font-size: 12px; opacity: 0.6; margin-top: 5px;">👥 Students</div>
            </div>
          </div>
        </div>
        
        <!-- Attendance Percentage Bar -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 20px; margin: 30px 0; color: white; text-align: center;">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">📊 ATTENDANCE RATE</div>
          <div style="background: rgba(255,255,255,0.2); height: 20px; border-radius: 10px; overflow: hidden; margin-bottom: 15px;">
            <div style="height: 100%; background: linear-gradient(90deg, #4facfe, #00f2fe); width: ${((presentCount / students.length) * 100).toFixed(1)}%; transition: width 0.3s ease; border-radius: 10px;"></div>
          </div>
          <div style="font-size: 32px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${((presentCount / students.length) * 100).toFixed(1)}%</div>
        </div>
        
        ${absentCount > 0 ? `
          <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 30px; border-radius: 20px; margin-top: 30px; box-shadow: 0 10px 30px rgba(255, 154, 158, 0.3);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h3 style="color: #7c3aed; margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">📋 ABSENT STUDENTS</h3>
              <div style="font-size: 16px; color: #8b5cf6; margin-top: 5px; font-weight: 600;">(${absentCount} ${absentCount === 1 ? 'Student' : 'Students'})</div>
            </div>
            <div style="background: rgba(255,255,255,0.9); padding: 25px; border-radius: 15px; border-left: 6px solid #ef4444;">
              <div style="color: #dc2626; font-size: 20px; font-weight: 700; text-align: center; line-height: 1.6; font-family: 'Courier New', monospace;">
                ${absentStudents.map(student => student.rollNumber).join(' • ')}
              </div>
            </div>
          </div>
        ` : `
          <div style="background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); padding: 40px; border-radius: 20px; margin-top: 30px; text-align: center; color: white; box-shadow: 0 10px 30px rgba(132, 250, 176, 0.3);">
            <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
            <h3 style="margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">PERFECT ATTENDANCE!</h3>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9; font-weight: 500;">All students are present today</p>
          </div>
        `}
        
         <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 25px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280;">
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 5px;">Generated on ${format(new Date(), 'MMM dd, yyyy')} at ${format(new Date(), 'h:mm a')}</div>
          <div style="font-size: 12px; opacity: 0.7;">NNRG College of Engineering • Department of CSE • Academic Year 2023-2027</div>
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        width: 800,
        height: tempDiv.scrollHeight
      });
      
      document.body.removeChild(tempDiv);
      
      const link = document.createElement('a');
      link.download = `attendance-report-${format(selectedDate, 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting as image:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export as image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAsImage();
      
      toast({
        title: "Export Successful",
        description: "Attendance data exported as image.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const presentCount = students.filter(s => !s.isAbsent).length;
  const absentCount = students.filter(s => s.isAbsent).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Share Attendance Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Date:</span>
                <br />
                {format(selectedDate, 'EEEE, MMMM do, yyyy')}
              </div>
              <div>
                <span className="font-medium">Summary:</span>
                <br />
                Present: {presentCount} | Absent: {absentCount}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full h-16 flex flex-col gap-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Image className="h-6 w-6" />
            {isExporting ? "Generating Image..." : "Download Attendance Image"}
          </Button>
          
          {isExporting && (
            <div className="text-center text-sm text-gray-600">
              Creating attendance image for sharing...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportOptions;
