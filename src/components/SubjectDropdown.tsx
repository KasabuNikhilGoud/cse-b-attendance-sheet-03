
import React from "react";

interface SubjectDropdownProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  selectedWeekDay?: Date;
  onWeekDayChange?: (date: Date) => void;
  selectedIndividualSubject?: string;
  onIndividualSubjectChange?: (subject: string) => void;
}

const SubjectDropdown: React.FC<SubjectDropdownProps> = () => {
  // Component now renders nothing since subject selection is removed
  return null;
};

export default SubjectDropdown;
