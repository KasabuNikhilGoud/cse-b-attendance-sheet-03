import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceControls from "./AttendanceControls";
import SearchAndFilter from "./SearchAndFilter";
import AttendanceStats from "./AttendanceStats";
import StudentGrid from "./StudentGrid";
import ExportOptions from "./ExportOptions";
import EmailNotifications from "./EmailNotifications";
import { getStorageKey, loadAttendanceData, saveAttendanceData } from "@/utils/attendanceUtils";
import { sendWhatsAppAttendance } from "@/utils/whatsappUtils";
import { motion } from "framer-motion";

export interface Student {
  rollNumber: string;
  name: string;
  isAbsent: boolean;
  email?: string;
}

const AttendanceSheet = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [allAttendanceData, setAllAttendanceData] = useState<Record<string, Student[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "present" | "absent">("all");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showEmailConfig, setShowEmailConfig] = useState(false);

  // Student names mapping with emails
  const studentNames: Record<string, { name: string; email: string }> = {
    "237Z1A0572": { name: "KANNARAPU KEERTHANA", email: "keerthana@example.com" },
    "237Z1A0573": { name: "KARNATI PAVAN REDDY", email: "pavan@example.com" },
    "237Z1A0574": { name: "KARUTURI SURYA NARAYANA", email: "surya@example.com" },
    "237Z1A0575": { name: "KASABU NIKHIL GOUD", email: "nikhil@example.com" },
    "237Z1A0576": { name: "KALVA SRIDHAR", email: "sridhar@example.com" },
    "237Z1A0577": { name: "KATHI REVANTH", email: "revanth@example.com" },
    "237Z1A0578": { name: "KATRAVTH PRIYANKA", email: "priyanka@example.com" },
    "237Z1A0579": { name: "KAVATI THARUN TEJA", email: "tharun@example.com" },
    "237Z1A0581": { name: "KHANDAVILLI HARSHITH GHANA SHYAM", email: "harshith@example.com" },
    "237Z1A0582": { name: "KOLLI SHANMUKH SRINIVAS", email: "shanmukh@example.com" },
    "237Z1A0583": { name: "KOMMULA GOPI CHARAN", email: "gopi@example.com" },
    "237Z1A0584": { name: "KONATHAM GNANESHWAR REDDY", email: "gnaneshwar@example.com" },
    "237Z1A0585": { name: "KONYALA SHANMUKHA SAI", email: "shanmukhasai@example.com" },
    "237Z1A0586": { name: "KOPPULA YAMINI", email: "yamini@example.com" },
    "237Z1A0587": { name: "KORRA GOVIND", email: "govind@example.com" },
    "237Z1A0589": { name: "KOVURI VEDHA SRI", email: "vedha@example.com" },
    "237Z1A0590": { name: "KUMKUMA PRAVALIKA", email: "pravalika@example.com" },
    "237Z1A0591": { name: "KUNTA SRUJANI", email: "srujani@example.com" },
    "237Z1A0592": { name: "KONTHAM RUCHITHA", email: "ruchitha@example.com" },
    "237Z1A0593": { name: "M MEENU VAISHNAVE", email: "meenu@example.com" },
    "237Z1A0594": { name: "MACHA SHIVANI", email: "shivani@example.com" },
    "237Z1A0595": { name: "MADERA SRAVAN", email: "sravan@example.com" },
    "237Z1A0596": { name: "MALA YADAGIRI", email: "yadagiri@example.com" },
    "237Z1A0597": { name: "MALLALA SRI LEKHA", email: "srilekha@example.com" },
    "237Z1A0598": { name: "MANCHALA ARAVIND", email: "aravind@example.com" },
    "237Z1A0599": { name: "MANCHI SHIVA SAI", email: "shivasai@example.com" },
    "237Z1A05A1": { name: "MANGALAPALLI SRAVANTHI", email: "sravanthi@example.com" },
    "237Z1A05A2": { name: "MANKA ROHINI", email: "rohini@example.com" },
    "237Z1A05A3": { name: "MARADUGU VENKATA SAI", email: "venkatasai@example.com" },
    "237Z1A05A4": { name: "MARATI PRANITHA", email: "pranitha@example.com" },
    "237Z1A05A5": { name: "MARKA SUDHINDRA GOUD", email: "sudhindra@example.com" },
    "237Z1A05A6": { name: "MARKA VIVEK", email: "vivek@example.com" },
    "237Z1A05A7": { name: "MATTEPU RENUKA LAKSHMI", email: "renuka@example.com" },
    "237Z1A05A8": { name: "MD ASAD AHMED", email: "asad@example.com" },
    "237Z1A05A9": { name: "MEESALA RAMYA", email: "ramya@example.com" },
    "237Z1A05B0": { name: "MOHAMMED ROUNAQ ALI", email: "rounaq@example.com" },
    "237Z1A05B1": { name: "MORA DEEPIKA", email: "deepika@example.com" },
    "237Z1A05B2": { name: "MULAGIRI SASAANK ANIRUDH", email: "sasaank@example.com" },
    "237Z1A05B3": { name: "MULJE VITTHAL DEVIDAS", email: "vitthal@example.com" },
    "237Z1A05B4": { name: "MUNIGANTI SHARANYA", email: "sharanya@example.com" },
    "237Z1A05B5": { name: "NAGULAPALLY RAVALI", email: "ravali@example.com" },
    "237Z1A05B6": { name: "NARAGONI SRI SIRI", email: "srisiri@example.com" },
    "237Z1A05B7": { name: "NAYKOTI PRASAD", email: "prasad@example.com" },
    "237Z1A05B8": { name: "ND LOKESH", email: "lokesh@example.com" },
    "237Z1A05B9": { name: "NEELAKANTAM SAKETH RAJU", email: "saketh@example.com" },
    "237Z1A05C0": { name: "NELLUTLA UMESH CHANDRA", email: "umesh@example.com" },
    "237Z1A05C1": { name: "NISU KUMARI", email: "nisu@example.com" },
    "237Z1A05C2": { name: "NOMULA KARNAKAR", email: "karnakar@example.com" },
    "237Z1A05C3": { name: "NOORANI", email: "noorani@example.com" },
    "237Z1A05C4": { name: "NUKALA VINOD KUMAR", email: "vinod@example.com" },
    "237Z1A05C5": { name: "O CHANDRAKIRAN", email: "chandrakiran@example.com" },
    "237Z1A05C6": { name: "PACHIPALA SARIKA", email: "sarika@example.com" },
    "237Z1A05C7": { name: "PADALA SAI SHASHANK", email: "shashank@example.com" },
    "237Z1A05C8": { name: "PEDDI SAI VENKAT SUMANTH", email: "sumanth@example.com" },
    "237Z1A05C9": { name: "PEDDI SHIVA", email: "shiva@example.com" },
    "237Z1A05D0": { name: "PINJALA BHARGAV", email: "bhargav@example.com" },
    "237Z1A05D1": { name: "PITTALA HARI BABU", email: "haribabu@example.com" },
    "237Z1A05D2": { name: "PODUPUGANTI GOVARDHAN", email: "govardhan@example.com" },
    "237Z1A05D3": { name: "POGU SAI SARATH", email: "sarath@example.com" },
    "237Z1A05D4": { name: "POLANA RAHUL", email: "rahul@example.com" },
    "237Z1A05D5": { name: "POLEPAKA MANICHARAN", email: "manicharan@example.com" },
    "237Z1A05D6": { name: "POOJARI MAHESH GOUD", email: "mahesh@example.com" },
    "237Z1A05D7": { name: "PUTTA CHARAN NAIDU", email: "charan@example.com" },
    "237Z1A05D8": { name: "RACHAKONDA MANASA", email: "manasa@example.com" },
    "237Z1A05D9": { name: "RAGI MANOHAR REDDY", email: "manohar@example.com" }
  };

  // Generate roll numbers excluding 571, 80, 88, A0 but including B0, C0, D0
  const generateRollNumbers = (): string[] => {
    const rollNumbers: string[] = [];
    const base = "237Z1A05";
    
    for (let i = 72; i <= 99; i++) {
      if (i !== 80 && i !== 88) {
        rollNumbers.push(`${base}${i}`);
      }
    }
    
    const hexDigits = ['A', 'B', 'C', 'D'];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    for (const letter of hexDigits) {
      for (const number of numbers) {
        if (letter === 'A' && number === '0') {
          continue;
        }
        rollNumbers.push(`${base}${letter}${number}`);
        if (rollNumbers.length >= 65) break;
      }
      if (rollNumbers.length >= 65) break;
    }
    
    return rollNumbers;
  };

  // Initialize students data
  useEffect(() => {
    const rollNumbers = generateRollNumbers();
    const initialStudents: Student[] = rollNumbers.map((rollNumber) => ({
      rollNumber,
      name: studentNames[rollNumber]?.name || `Student ${rollNumber.slice(-2)}`,
      email: studentNames[rollNumber]?.email || `${rollNumber.toLowerCase()}@example.com`,
      isAbsent: false,
    }));
    
    const savedData = loadAttendanceData();
    setAllAttendanceData(savedData);
    setStudents(initialStudents);
  }, []);

  // Load attendance for selected date
  useEffect(() => {
    const dateKey = getStorageKey(selectedDate);
    const dayData = allAttendanceData[dateKey];
    
    if (dayData) {
      setStudents(prev => prev.map(student => {
        const savedStudent = dayData.find(s => s.rollNumber === student.rollNumber);
        return savedStudent ? { ...student, isAbsent: savedStudent.isAbsent } : { ...student, isAbsent: false };
      }));
    } else {
      setStudents(prev => prev.map(student => ({ ...student, isAbsent: false })));
    }
  }, [selectedDate, allAttendanceData]);

  // Filter students based on search and filter type
  useEffect(() => {
    let filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType === "present") {
      filtered = filtered.filter(student => !student.isAbsent);
    } else if (filterType === "absent") {
      filtered = filtered.filter(student => student.isAbsent);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, filterType]);

  const toggleAbsent = (rollNumber: string) => {
    setStudents(prev => prev.map(student => 
      student.rollNumber === rollNumber 
        ? { ...student, isAbsent: !student.isAbsent }
        : student
    ));
  };

  const handleWhatsAppSend = async () => {
    const dateKey = getStorageKey(selectedDate);
    const updatedData = { ...allAttendanceData, [dateKey]: students };
    
    setAllAttendanceData(updatedData);
    saveAttendanceData(updatedData);
    
    try {
      const whatsAppSent = await sendWhatsAppAttendance(students, selectedDate);
      
      if (whatsAppSent) {
        toast({
          title: "WhatsApp Opened",
          description: `Attendance report ready. Select contacts or groups to send.`,
        });
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast({
        title: "Error",
        description: "Failed to open WhatsApp. Please try again.",
        variant: "destructive"
      });
    }
  };

  const absentCount = students.filter(s => s.isAbsent).length;
  const presentCount = students.length - absentCount;

  return (
    <div className="max-w-7xl mx-auto space-y-6" data-export-content>
      {/* Export Options Dialog */}
      <Dialog open={showExportOptions} onOpenChange={setShowExportOptions}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Attendance Data</DialogTitle>
          </DialogHeader>
          <ExportOptions students={students} selectedDate={selectedDate} allAttendanceData={allAttendanceData} />
        </DialogContent>
      </Dialog>

      {/* Email Configuration Dialog */}
      <Dialog open={showEmailConfig} onOpenChange={setShowEmailConfig}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Notification Settings</DialogTitle>
          </DialogHeader>
          <EmailNotifications students={students} selectedDate={selectedDate} />
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
          <AttendanceHeader />
          <CardContent>
            <div className="space-y-6">
              {/* Header Controls */}
              <AttendanceControls
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                presentCount={presentCount}
                absentCount={absentCount}
                onWhatsAppSend={handleWhatsAppSend}
                onShowExportOptions={() => setShowExportOptions(true)}
                onShowEmailConfig={() => setShowEmailConfig(true)}
              />

              {/* Search and Filter */}
              <SearchAndFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterType={filterType}
                onFilterChange={setFilterType}
              />

              {/* Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <AttendanceStats students={students} />
              </motion.div>

              {/* Student Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <StudentGrid students={filteredStudents} onToggleAbsent={toggleAbsent} />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AttendanceSheet;
