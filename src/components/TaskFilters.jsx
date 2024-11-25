import React from "react";
import { Search } from "lucide-react";

const TaskFilters = ({ onFilterChange, filters }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                     dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onFilterChange("search", e.target.value)}
            value={filters.search}
          />
        </div>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                     dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onFilterChange("priority", e.target.value)}
            value={filters.priority}
          >
            <option value="">כל האפשרויות</option>
            <option value="urgent">דחוף</option>
            <option value="high">עדיפות גבוהה</option>
            <option value="normal">עדיפות סבירה</option>
            <option value="low">עדיפות נמוכה</option>
          </select>
          <select
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                     dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onFilterChange("assignee", e.target.value)}
            value={filters.assignee}
          >
            <option value="">כל הרשומים</option>
            {/* Populate with unique assignees */}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
