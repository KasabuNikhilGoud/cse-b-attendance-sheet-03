
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: "all" | "present" | "absent";
  onFilterChange: (value: "all" | "present" | "absent") => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/50 border-blue-200 focus:border-blue-400"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-600" />
        <select
          value={filterType}
          onChange={(e) => onFilterChange(e.target.value as "all" | "present" | "absent")}
          className="px-3 py-2 rounded-md border border-blue-200 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Students</option>
          <option value="present">Present Only</option>
          <option value="absent">Absent Only</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter;
