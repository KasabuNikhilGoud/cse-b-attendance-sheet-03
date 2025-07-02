import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ExternalLink, Database, Settings, Info, AlertTriangle, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { googleSheetsService } from '@/services/googleSheetsService';

interface GoogleSheetsConfigProps {
  onConfigured?: () => void;
}

const GoogleSheetsConfig: React.FC<GoogleSheetsConfigProps> = ({ onConfigured }) => {
  const [apiKey, setApiKey] = useState('AIzaSyBBxGH47shdGgxEO6Xv3wpvU-BehTp2oU0');
  const [spreadsheetId, setSpreadsheetId] = useState('1hMAdzuK-BJqSL6uewjrk_fPZ6sygCZqm5slT7Dw4a2o');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [backupData, setBackupData] = useState<any[]>([]);

  useEffect(() => {
    const credentials = googleSheetsService.getCredentials();
    // Only override if no credentials are saved and we have default values
    if (!credentials.apiKey && !credentials.spreadsheetId) {
      // Use the pre-filled values
      setApiKey('AIzaSyBBxGH47shdGgxEO6Xv3wpvU-BehTp2oU0');
      setSpreadsheetId('1hMAdzuK-BJqSL6uewjrk_fPZ6sygCZqm5slT7Dw4a2o');
    } else {
      setApiKey(credentials.apiKey);
      setSpreadsheetId(credentials.spreadsheetId);
    }
    setIsConfigured(googleSheetsService.hasCredentials());
    
    // Load backup data
    const data = googleSheetsService.getBackupData();
    setBackupData(data);
  }, []);

  const handleSaveCredentials = async () => {
    if (!apiKey || !spreadsheetId) {
      toast({
        title: "Error",
        description: "Please provide both API key and Spreadsheet ID",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);
    try {
      googleSheetsService.setCredentials(apiKey, spreadsheetId);
      
      // Check if we can access the spreadsheet (read-only)
      const canAccess = await googleSheetsService.checkSheetsAccess();
      
      if (canAccess) {
        setIsConfigured(true);
        toast({
          title: "Configuration Saved",
          description: "Google Sheets credentials saved successfully! Data will be prepared for manual entry.",
        });
        onConfigured?.();
      } else {
        toast({
          title: "Access Issue",
          description: "Credentials saved but cannot access the spreadsheet. Please check your API key and spreadsheet ID.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error configuring Google Sheets:', error);
      toast({
        title: "Error",
        description: `Failed to configure Google Sheets: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const openSpreadsheet = () => {
    const url = googleSheetsService.getSpreadsheetUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type} data copied to clipboard`,
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Google Sheets Integration
        </CardTitle>
        <CardDescription>
          Configure Google Sheets to prepare attendance data for manual entry.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">Google Sheets API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Enter your Google Sheets API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
          <Input
            id="spreadsheetId"
            placeholder="Enter Google Spreadsheet ID"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Found in the spreadsheet URL: docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSaveCredentials}
            disabled={isChecking}
            className="flex-1"
          >
            <Settings className="mr-2 h-4 w-4" />
            {isChecking ? 'Checking...' : isConfigured ? 'Update Configuration' : 'Save Configuration'}
          </Button>
          
          {isConfigured && (
            <Button variant="outline" onClick={openSpreadsheet}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Sheet
            </Button>
          )}
        </div>

        {isConfigured && (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                ✓ Google Sheets credentials configured successfully
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-yellow-800">Manual Setup Required:</p>
                  <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside ml-2">
                    <li>Open your spreadsheet using the "Open Sheet" button above</li>
                    <li>Create a sheet named "Attendance" with columns: Date, Roll Number, Student Name, Status, Timestamp</li>
                    <li>Create a sheet named "Reports" with columns: Date, Total Students, Present, Absent, Attendance Rate (%), Timestamp</li>
                    <li>When you send attendance, formatted data will be prepared for copy-paste</li>
                  </ol>
                  <p className="text-xs text-yellow-600 mt-2">
                    Note: API keys cannot write to Google Sheets directly. Data will be formatted for manual entry.
                  </p>
                </div>
              </div>
            </div>

            {backupData.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Recent Attendance Data for Manual Entry:</h4>
                {backupData.slice(0, 3).map((backup) => {
                  // Safely access reportData properties with fallbacks
                  const reportData = backup.data?.reportData;
                  const formattedForSheets = backup.data?.formattedForSheets;
                  
                  return (
                    <div key={backup.key} className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-blue-800">Date: {backup.date}</p>
                        <div className="flex gap-1">
                          {formattedForSheets?.attendanceRows && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(
                                formattedForSheets.attendanceRows.map(row => row.join('\t')).join('\n'),
                                'Attendance'
                              )}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Attendance
                            </Button>
                          )}
                          {formattedForSheets?.reportRow && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(
                                formattedForSheets.reportRow.join('\t'),
                                'Report'
                              )}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Report
                            </Button>
                          )}
                        </div>
                      </div>
                      {reportData && (
                        <p className="text-xs text-blue-600">
                          Present: {reportData.presentCount || 0}, Absent: {reportData.absentCount || 0}, Rate: {reportData.attendanceRate || 0}%
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!isConfigured && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Setup Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Create a new Google Spreadsheet</li>
              <li>Get your API key from Google Cloud Console</li>
              <li>Copy the Spreadsheet ID from the URL</li>
              <li>Enter both credentials above and click Save</li>
              <li>Manually create the required sheets and copy-paste attendance data</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsConfig;
