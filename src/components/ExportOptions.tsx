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
        <!-- Orange Lightning Background -->
        <div style="background: linear-gradient(135deg, #ff7e00 0%, #ff9500 25%, #ffad00 50%, #ff8c00 75%, #ff7e00 100%); padding: 40px 30px; margin: -40px -40px 40px -40px; color: white; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%); opacity: 0.8;"></div>
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>'); opacity: 0.4;"></div>
          <div style="position: relative; z-index: 1;">
            <div style="background: rgba(255,255,255,0.25); backdrop-filter: blur(15px); border-radius: 25px; padding: 30px; margin-bottom: 25px; border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 8px 32px rgba(255,126,0,0.3);">
              <h1 style="margin: 0; font-size: 34px; font-weight: 800; text-shadow: 0 3px 6px rgba(0,0,0,0.4); letter-spacing: 2px; background: linear-gradient(45deg, #fff, #fff8dc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">🎓 NNRG COLLEGE OF ENGINEERING</h1>
              <div style="height: 3px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent); margin: 18px auto; width: 70%; border-radius: 2px;"></div>
              <h2 style="margin: 0; font-size: 26px; font-weight: 700; opacity: 0.95; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING</h2>
              <p style="margin: 12px 0 0 0; font-size: 20px; font-weight: 600; opacity: 0.9; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">III-I CSE-B CLASS ATTENDANCE REPORT</p>
            </div>
            <div style="display: flex; justify-content: center; gap: 35px; margin-top: 25px;">
              <div style="background: rgba(255,255,255,0.2); padding: 18px 30px; border-radius: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3);">
                <div style="font-size: 16px; opacity: 0.95; font-weight: 600;">📅 ${format(selectedDate, 'EEEE, MMMM do, yyyy')}</div>
              </div>
              <div style="background: rgba(255,255,255,0.2); padding: 18px 30px; border-radius: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3);">
                <div style="font-size: 16px; opacity: 0.95; font-weight: 600;">🕐 ${format(new Date(), 'h:mm a')}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Orange Lightning Statistics Cards -->
        <div style="display: flex; justify-content: space-between; gap: 25px; margin: 45px 0; background: linear-gradient(135deg, rgba(255,126,0,0.1) 0%, rgba(255,173,0,0.1) 100%); padding: 30px; border-radius: 25px;">
          <div style="flex: 1; background: linear-gradient(135deg, #ff8c00 0%, #ffa500 50%, #ffb84d 100%); padding: 35px 25px; border-radius: 25px; text-align: center; color: white; box-shadow: 0 15px 40px rgba(255,140,0,0.4); position: relative; overflow: hidden; border: 2px solid rgba(255,255,255,0.2);">
            <div style="position: absolute; top: -60px; right: -60px; width: 120px; height: 120px; background: rgba(255,255,255,0.15); border-radius: 50%; box-shadow: 0 0 60px rgba(255,255,255,0.3);"></div>
            <div style="position: absolute; bottom: -40px; left: -40px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="font-size: 52px; font-weight: 900; margin-bottom: 10px; text-shadow: 0 3px 6px rgba(0,0,0,0.3); filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));">${presentCount}</div>
              <div style="font-size: 18px; font-weight: 700; opacity: 0.95; text-transform: uppercase; letter-spacing: 2px;">Present</div>
              <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">✅ Students</div>
            </div>
          </div>
          
          <div style="flex: 1; background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffad5a 100%); padding: 35px 25px; border-radius: 25px; text-align: center; color: white; box-shadow: 0 15px 40px rgba(255,107,53,0.4); position: relative; overflow: hidden; border: 2px solid rgba(255,255,255,0.2);">
            <div style="position: absolute; top: -60px; right: -60px; width: 120px; height: 120px; background: rgba(255,255,255,0.15); border-radius: 50%; box-shadow: 0 0 60px rgba(255,255,255,0.3);"></div>
            <div style="position: absolute; bottom: -40px; left: -40px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="font-size: 52px; font-weight: 900; margin-bottom: 10px; text-shadow: 0 3px 6px rgba(0,0,0,0.3); filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));">${absentCount}</div>
              <div style="font-size: 18px; font-weight: 700; opacity: 0.95; text-transform: uppercase; letter-spacing: 2px;">Absent</div>
              <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">❌ Students</div>
            </div>
          </div>
          
          <div style="flex: 1; background: linear-gradient(135deg, #ff9500 0%, #ffad33 50%, #ffc966 100%); padding: 35px 25px; border-radius: 25px; text-align: center; color: white; box-shadow: 0 15px 40px rgba(255,149,0,0.4); position: relative; overflow: hidden; border: 2px solid rgba(255,255,255,0.2);">
            <div style="position: absolute; top: -60px; right: -60px; width: 120px; height: 120px; background: rgba(255,255,255,0.15); border-radius: 50%; box-shadow: 0 0 60px rgba(255,255,255,0.3);"></div>
            <div style="position: absolute; bottom: -40px; left: -40px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="font-size: 52px; font-weight: 900; margin-bottom: 10px; text-shadow: 0 3px 6px rgba(0,0,0,0.3); filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));">${students.length}</div>
              <div style="font-size: 18px; font-weight: 700; opacity: 0.95; text-transform: uppercase; letter-spacing: 2px;">Total</div>
              <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">👥 Students</div>
            </div>
          </div>
        </div>
        
        <!-- Orange Lightning Attendance Percentage Bar -->
        <div style="background: linear-gradient(135deg, #ff7e00 0%, #ff9500 25%, #ffad00 50%, #ff8c00 75%, #ff7e00 100%); padding: 30px; border-radius: 25px; margin: 35px 0; color: white; text-align: center; position: relative; overflow: hidden; border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 15px 40px rgba(255,126,0,0.3);">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.2) 0%, transparent 70%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.15) 0%, transparent 70%);"></div>
          <div style="position: relative; z-index: 1;">
            <div style="font-size: 22px; font-weight: 700; margin-bottom: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">📊 ATTENDANCE RATE</div>
            <div style="background: rgba(255,255,255,0.3); height: 25px; border-radius: 15px; overflow: hidden; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.4);">
              <div style="height: 100%; background: linear-gradient(90deg, #fff, #ffe4b5, #ffcc80); width: ${((presentCount / students.length) * 100).toFixed(1)}%; transition: width 0.5s ease; border-radius: 15px; box-shadow: 0 0 20px rgba(255,255,255,0.6);"></div>
            </div>
            <div style="font-size: 38px; font-weight: 900; text-shadow: 0 3px 6px rgba(0,0,0,0.4); filter: drop-shadow(0 0 15px rgba(255,255,255,0.7));">${((presentCount / students.length) * 100).toFixed(1)}%</div>
          </div>
        </div>
        
        ${absentCount > 0 ? `
          <div style="background: linear-gradient(135deg, rgba(255,126,0,0.9) 0%, rgba(255,149,0,0.85) 50%, rgba(255,173,0,0.9) 100%); padding: 35px; border-radius: 25px; margin-top: 35px; box-shadow: 0 15px 40px rgba(255,126,0,0.4); position: relative; overflow: hidden; border: 2px solid rgba(255,255,255,0.3);">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 0%, transparent 50%);"></div>
            <div style="position: relative; z-index: 1;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h3 style="color: white; margin: 0; font-size: 28px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">📋 ABSENT STUDENTS</h3>
                <div style="font-size: 18px; color: rgba(255,255,255,0.9); margin-top: 8px; font-weight: 600;">(${absentCount} ${absentCount === 1 ? 'Student' : 'Students'})</div>
              </div>
              <div style="background: rgba(255,255,255,0.95); padding: 30px; border-radius: 20px; border-left: 8px solid #ff4500; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <div style="color: #cc3300; font-size: 24px; font-weight: 800; text-align: center; line-height: 1.8; font-family: 'Courier New', monospace; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                  ${absentStudents.map(student => student.rollNumber).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        ` : `
          <div style="background: linear-gradient(135deg, rgba(255,165,0,0.9) 0%, rgba(255,185,0,0.85) 50%, rgba(255,205,0,0.9) 100%); padding: 45px; border-radius: 25px; margin-top: 35px; text-align: center; color: white; box-shadow: 0 15px 40px rgba(255,165,0,0.4); position: relative; overflow: hidden; border: 2px solid rgba(255,255,255,0.3);">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%);"></div>
            <div style="position: relative; z-index: 1;">
              <div style="font-size: 70px; margin-bottom: 25px; filter: drop-shadow(0 5px 15px rgba(255,255,255,0.5));">🎉</div>
              <h3 style="margin: 0; font-size: 32px; font-weight: 800; text-shadow: 0 3px 6px rgba(0,0,0,0.3);">PERFECT ATTENDANCE!</h3>
              <p style="margin: 15px 0 0 0; font-size: 20px; opacity: 0.95; font-weight: 600;">All students are present today</p>
            </div>
          </div>
        `}
        
        <!-- Orange Lightning Footer -->
        <div style="margin-top: 45px; padding: 30px 0; border-top: 3px solid rgba(255,126,0,0.3); text-align: center; background: linear-gradient(135deg, rgba(255,126,0,0.1) 0%, rgba(255,173,0,0.1) 100%); border-radius: 15px;">
          <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px; color: #ff6600;">Generated on ${format(new Date(), 'MMM dd, yyyy')} at ${format(new Date(), 'h:mm a')}</div>
          <div style="font-size: 14px; opacity: 0.8; color: #ff7e00; font-weight: 600;">NNRG College of Engineering • Department of CSE • Academic Year 2023-2027</div>
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
