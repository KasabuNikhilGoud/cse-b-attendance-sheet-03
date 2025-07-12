
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, Cloud, Loader2 } from 'lucide-react';
import { Student } from './AttendanceSheet';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface EmailNotificationsProps {
  students: Student[];
  selectedDate: Date;
}

const EmailNotifications: React.FC<EmailNotificationsProps> = ({ 
  students, 
  selectedDate 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const openMailClient = () => {
    const absentStudents = students.filter(s => s.isAbsent);
    
    if (absentStudents.length === 0) {
      toast({
        title: "No Absent Students",
        description: "All students are present today.",
      });
      return;
    }

    const emails = absentStudents.map(student => student.email).join(',');
    const subject = `Absence Notification – CSE-B Class on ${format(selectedDate, 'MMMM d, yyyy')}`;
    const body = `Dear Student,

You were marked absent for the class held on ${format(selectedDate, 'EEEE, MMMM do, yyyy')} at ${format(new Date(), 'h:mm a')}.

If you believe this is a mistake, kindly reach out to your faculty for clarification.

Class: CSE-B
Date: ${format(selectedDate, 'MMMM d, yyyy')}
Time: ${format(new Date(), 'h:mm a')}`;

    // Create mailto URL
    const mailtoUrl = `mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open mail app directly
    window.location.href = mailtoUrl;
    
    toast({
      title: "Email App Opened",
      description: `Opening mail app with ${absentStudents.length} absent student(s).`,
    });
  };

  const sendToGoogleScript = async () => {
    setIsSubmitting(true);
    
    try {
      const attendanceData = students.map(student => ({
        rollNumber: student.rollNumber,
        name: student.name,
        status: student.isAbsent ? "Absent" : "Present",
        email: student.email || ""
      }));

      const response = await fetch('https://script.google.com/macros/s/AKfycbzgyiCgDoFvgsKO78WxKOpLeDwR6oWEEXrzKYfMGmGlcI0-SMoYJUTJ32qMolwwciET/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          students: attendanceData,
          date: format(selectedDate, 'yyyy-MM-dd'),
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "✅ Success!",
          description: `Attendance saved to Google Sheets and emails sent to ${attendanceData.filter(s => s.status === "Absent").length} absent students.`,
        });
      } else {
        throw new Error('Failed to submit attendance');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast({
        title: "❌ Error",
        description: "Failed to save attendance or send emails. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const absentCount = students.filter(s => s.isAbsent).length;

  return (
    <div className="space-y-6">
      {/* Automated Send Card */}
      <Card className="transition-all duration-300 hover:shadow-lg border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            Send Attendance + Emails (Automated)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Date:</span>
              <span>{format(selectedDate, 'EEEE, MMMM do, yyyy')}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total Students:</span>
              <span className="font-semibold">{students.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Absent Students:</span>
              <span className="text-red-600 font-semibold">{absentCount}</span>
            </div>
          </div>

          <Button 
            onClick={sendToGoogleScript}
            disabled={isSubmitting}
            className="w-full transition-all duration-200 hover:scale-105"
            variant="premium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving & Sending...
              </>
            ) : (
              <>
                <Cloud className="mr-2 h-4 w-4" />
                Save to Sheets + Send Emails ({absentCount} absent)
              </>
            )}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            This will save attendance to Google Sheets and automatically send emails to absent students.
          </p>
        </CardContent>
      </Card>

      {/* Manual Send Email Card */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Manual Email (Backup)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg transition-colors duration-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Date:</span>
              <span>{format(selectedDate, 'EEEE, MMMM do, yyyy')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Absent Students:</span>
              <span className="text-red-600 font-semibold">{absentCount}</span>
            </div>
          </div>

          {absentCount > 0 && (
            <div className="space-y-2 animate-fade-in">
              <div className="font-medium">Students to be notified:</div>
              <div className="max-h-32 overflow-y-auto bg-gray-50 p-3 rounded-md transition-all duration-200">
                {students.filter(s => s.isAbsent).map(student => (
                  <div key={student.rollNumber} className="text-sm py-1 font-mono">
                    {student.rollNumber} - {student.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={openMailClient}
            disabled={absentCount === 0}
            className="w-full transition-all duration-200 hover:scale-105"
          >
            <Send className="mr-2 h-4 w-4" />
            Send Email to Absent ({absentCount})
          </Button>

          {absentCount === 0 && (
            <p className="text-center text-gray-500 text-sm">
              No absent students to notify today.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailNotifications;
