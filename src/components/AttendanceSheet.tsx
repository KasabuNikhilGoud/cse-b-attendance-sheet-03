import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceControls from "./AttendanceControls";
import SearchAndFilter from "./SearchAndFilter";
import AttendanceStats from "./AttendanceStats";
import StudentGrid from "./StudentGrid";
import { getStorageKey, loadAttendanceData, saveAttendanceData } from "@/utils/attendanceUtils";
import { sendWhatsAppAttendance } from "@/utils/whatsappUtils";
import { motion } from "framer-motion";

export interface Student {
  rollNumber: string;
  name: string;
  isAbsent: boolean;
}

const AttendanceSheet = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [allAttendanceData, setAllAttendanceData] = useState<Record<string, Student[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "present" | "absent">("all");
  // Student names mapping (emails removed)
  const studentNames: Record<string, { name: string }> = {
    "237Z1A0572": { name: "KANNARAPU KEERTHANA" },
    "237Z1A0573": { name: "KARNATI PAVAN REDDY" },
    "237Z1A0574": { name: "KARUTURI SURYANARAYANA" },
    "237Z1A0575": { name: "KASABU NIKHIL GOUD" },
    "237Z1A0576": { name: "KALVA SRIDHAR" },
    "237Z1A0577": { name: "KATHI REVANTH" },
    "237Z1A0578": { name: "KATRAVTH PRIYANKA" },
    "237Z1A0579": { name: "KAVATI THARUN TEJA" },
    "237Z1A0580": { name: "KHAMMAMPATI PAVAN" },
    "237Z1A0581": { name: "KHANDAVILLI HARSHITH GHANA SHYAM" },
    "237Z1A0582": { name: "KOLLI SHANMUKH SRINIVAS" },
    "237Z1A0583": { name: "KOMMULA GOPI CHARAN" },
    "237Z1A0584": { name: "KONATHAM GNANESHWAR REDDY" },
    "237Z1A0585": { name: "KONYALA SHANMUKHA SAI" },
    "237Z1A0586": { name: "KOPPULA YAMINI" },
    "237Z1A0587": { name: "KORRA GOVIND" },
    "237Z1A0588": { name: "KOTHAGOLLA ANJANEYULU" },
    "237Z1A0589": { name: "KOVURI VEDHASRI" },
    "237Z1A0590": { name: "KUMKUMA PRAVALIKA" },
    "237Z1A0591": { name: "KUNTA SRUJANI" },
    "237Z1A0592": { name: "KONTHAM RUCHITHA" },
    "237Z1A0593": { name: "M MEENU VAISHNAVE" },
    "237Z1A0594": { name: "MACHA SHIVANI" },
    "237Z1A0595": { name: "MADERA SRAVAN" },
    "237Z1A0596": { name: "MALA YADAGIRI" },
    "237Z1A0597": { name: "MALLALA SRI LEKHA" },
    "237Z1A0598": { name: "MANCHALA ARAVIND" },
    "237Z1A0599": { name: "MANCHI SHIVA SAI" },
    "237Z1A05A0": { name: "MANDA SHYAM" },
    "237Z1A05A1": { name: "MANGALAPALLI SRAVANTHI" },
    "237Z1A05A2": { name: "MANKA ROHINI" },
    "237Z1A05A3": { name: "MARADUGU VENKATA SAI" },
    "237Z1A05A4": { name: "MARATI PRANITHA" },
    "237Z1A05A5": { name: "MARKA SUDHINDRA GOUD" },
    "237Z1A05A6": { name: "MARKA VIVEK" },
    "237Z1A05A7": { name: "MATTEPU RENUKA LAKSHMI" },
    "237Z1A05A8": { name: "MD ASAD AHMED" },
    "237Z1A05A9": { name: "MEESALA RAMYA" },
    "237Z1A05B0": { name: "MOHAMMED ROUNAQ ALI" },
    "237Z1A05B1": { name: "MORADEEPIKA" },
    "237Z1A05B2": { name: "MULAGIRI SASAANK ANIRUDH" },
    "237Z1A05B3": { name: "MULJE VITTHAL DEVIDAS" },
    "237Z1A05B4": { name: "MUNIGANTI SHARANYA" },
    "237Z1A05B5": { name: "NAGULAPALLY RAVALI" },
    "237Z1A05B6": { name: "NARAGONI SRI SIRI" },
    "237Z1A05B7": { name: "NAYKOTI PRASAD" },
    "237Z1A05B8": { name: "ND LOKESH" },
    "237Z1A05B9": { name: "NEELAKANTAM SAKETH RAJU" },
    "237Z1A05C0": { name: "NELLUTLA UMESH CHANDRA" },
    "237Z1A05C1": { name: "NISU KUMARI" },
    "237Z1A05C2": { name: "NOMULA KARNAKAR" },
    "237Z1A05C3": { name: "NOORANI" },
    "237Z1A05C4": { name: "NUKALA VINOD KUMAR" },
    "237Z1A05C5": { name: "O CHANDRAKIRAN" },
    "237Z1A05C6": { name: "PACHIPALA SARIKA" },
    "237Z1A05C7": { name: "PADALA SAI SHASHANK" },
    "237Z1A05C8": { name: "PEDDI SAI VENKAT SUMANTH" },
    "237Z1A05C9": { name: "PEDDI SHIVA" },
    "237Z1A05D0": { name: "PINJALA BHARGAV" },
    "237Z1A05D1": { name: "PITTALA HARI BABU" },
    "237Z1A05D2": { name: "PODUPUGANTI GOVARDHAN" },
    "237Z1A05D3": { name: "POGU SAI SARATH" },
    "237Z1A05D4": { name: "POLANA RAHUL" },
    "237Z1A05D5": { name: "POLEPAKA MANICHARAN" },
    "237Z1A05D6": { name: "POOJARI MAHESH GOUD" },
    "237Z1A05D7": { name: "PUTTA CHARAN NAIDU" },
    "237Z1A05D8": { name: "RACHAKONDA MANASA" },
    "237Z1A05D9": { name: "RAGI MANOHAR REDDY" }
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


  const handleSendAttendanceEmails = async () => {
    const date = getStorageKey(selectedDate);
    const absentRolls = students.filter(s => s.isAbsent).map(s => s.rollNumber);
    const absentCount = absentRolls.length;
    const presentCount = students.length - absentCount;
    const percentage = students.length > 0 ? parseFloat(((presentCount / students.length) * 100).toFixed(1)) : 0;

    const payload = {
      date,
      absentRolls,
      presentCount,
      absentCount,
      percentage,
    };

    try {
      await fetch('https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors',
      });
      toast({
        title: "Request sent",
        description: "Attendance email request sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to send",
        description: "Network error while sending. Try again.",
        variant: "destructive"
      });
    }
  };

  const absentCount = students.filter(s => s.isAbsent).length;
  const presentCount = students.length - absentCount;

  return (
    <div className="max-w-7xl mx-auto space-y-6" data-export-content>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-card/95 backdrop-blur-sm border-2 border-border shadow-card transition-smooth hover:shadow-elegant">
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
                onSendAttendanceEmails={handleSendAttendanceEmails}
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
