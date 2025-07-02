
interface AttendanceRecord {
  date: string;
  rollNumber: string;
  studentName: string;
  status: 'Present' | 'Absent';
  timestamp: string;
}

interface DailyReport {
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
  timestamp: string;
}

export class GoogleSheetsService {
  private apiKey: string = '';
  private spreadsheetId: string = '';

  constructor() {
    this.loadCredentials();
  }

  private loadCredentials() {
    this.apiKey = localStorage.getItem('google_sheets_api_key') || '';
    this.spreadsheetId = localStorage.getItem('google_sheets_spreadsheet_id') || '';
  }

  public setCredentials(apiKey: string, spreadsheetId: string) {
    this.apiKey = apiKey;
    this.spreadsheetId = spreadsheetId;
    localStorage.setItem('google_sheets_api_key', apiKey);
    localStorage.setItem('google_sheets_spreadsheet_id', spreadsheetId);
  }

  public getCredentials() {
    return {
      apiKey: this.apiKey,
      spreadsheetId: this.spreadsheetId
    };
  }

  public hasCredentials(): boolean {
    return !!(this.apiKey && this.spreadsheetId);
  }

  // Check if sheets are accessible (read-only check)
  public async checkSheetsAccess(): Promise<boolean> {
    if (!this.hasCredentials()) {
      throw new Error('Google Sheets credentials not set');
    }

    try {
      // Try to read the spreadsheet metadata to verify access
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}?key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        return true;
      } else {
        console.error('Failed to access spreadsheet:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('Error checking sheets access:', error);
      return false;
    }
  }

  // Generate formatted data for manual entry
  public generateAttendanceData(students: any[], selectedDate: Date) {
    const timestamp = new Date().toISOString();
    const dateString = selectedDate.toISOString().split('T')[0];

    // Prepare attendance records
    const attendanceData = students.map(student => ({
      date: dateString,
      rollNumber: student.rollNumber,
      studentName: student.name,
      status: student.isAbsent ? 'Absent' : 'Present',
      timestamp: timestamp
    }));

    // Prepare daily report
    const totalStudents = students.length;
    const presentCount = students.filter(s => !s.isAbsent).length;
    const absentCount = students.filter(s => s.isAbsent).length;
    const attendanceRate = Math.round((presentCount / totalStudents) * 100);

    const reportData = {
      date: dateString,
      totalStudents: totalStudents,
      presentCount: presentCount,
      absentCount: absentCount,
      attendanceRate: attendanceRate,
      timestamp: timestamp
    };

    return { attendanceData, reportData };
  }

  // Save attendance data locally with proper formatting for Google Sheets
  public async saveAttendanceData(students: any[], selectedDate: Date): Promise<boolean> {
    if (!this.hasCredentials()) {
      throw new Error('Google Sheets credentials not set');
    }

    try {
      const { attendanceData, reportData } = this.generateAttendanceData(students, selectedDate);

      // Save to localStorage as backup with formatted data
      const backupKey = `attendance_backup_${selectedDate.toISOString().split('T')[0]}`;
      const backupData = {
        attendanceData,
        reportData,
        formattedForSheets: {
          attendanceRows: attendanceData.map(record => [
            record.date,
            record.rollNumber,
            record.studentName,
            record.status,
            record.timestamp
          ]),
          reportRow: [
            reportData.date,
            reportData.totalStudents,
            reportData.presentCount,
            reportData.absentCount,
            reportData.attendanceRate,
            reportData.timestamp
          ]
        },
        instructions: {
          attendance: "Copy the attendanceRows data to your 'Attendance' sheet",
          reports: "Copy the reportRow data to your 'Reports' sheet"
        }
      };
      
      localStorage.setItem(backupKey, JSON.stringify(backupData));

      console.log('Attendance data prepared and saved locally:', backupData);
      return true;
    } catch (error) {
      console.error('Error preparing attendance data:', error);
      throw error;
    }
  }

  // Get all backed up data for manual entry
  public getBackupData(): any[] {
    const backupData = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('attendance_backup_')) {
        const data = localStorage.getItem(key);
        if (data) {
          backupData.push({
            key,
            date: key.replace('attendance_backup_', ''),
            data: JSON.parse(data)
          });
        }
      }
    }
    return backupData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Get spreadsheet URL for easy access
  public getSpreadsheetUrl(): string {
    return this.spreadsheetId ? `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/edit` : '';
  }

  public getSetupInstructions(): string {
    return `
Google Sheets Integration Setup:

⚠️ IMPORTANT: API keys cannot write to Google Sheets. This system will:
1. Verify your spreadsheet access (read-only)
2. Save formatted data locally for manual entry
3. Provide easy copy-paste format for your sheets

Required Setup:
1. Create two sheets in your spreadsheet:
   - "Attendance" with columns: Date | Roll Number | Student Name | Status | Timestamp
   - "Reports" with columns: Date | Total Students | Present | Absent | Attendance Rate (%) | Timestamp

2. After sending attendance, check the browser console or backup data for formatted rows to copy-paste into your sheets.

Current spreadsheet: ${this.getSpreadsheetUrl()}
    `;
  }
}

export const googleSheetsService = new GoogleSheetsService();
