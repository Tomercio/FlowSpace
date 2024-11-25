import React from "react";
import { Calendar, AlertCircle, User, MoreVertical, Clock } from "lucide-react";

const TaskCard = ({ task, columnName, onDragStart, onTouchStart, onEdit }) => {
  const handleTouchStart = (e) => {
    e.preventDefault();
    onTouchStart(e, task, columnName);
  };

  const formatTime = (time) => {
    if (!time) return "";
    try {
      // Format time to local time string
      const [hours, minutes] = time.split(":");
      return new Date().setHours(hours, minutes, 0, 0);
    } catch (e) {
      return time;
    }
  };

  return (
    <div
      draggable="true"
      onDragStart={(e) => onDragStart(e, task, columnName)}
      onTouchStart={handleTouchStart}
      className="bg-blue-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-3 shadow-sm 
                hover:shadow-md transition-shadow active:shadow-lg touch-manipulation cursor-move"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {task.task}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(columnName, task.id);
          }}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="mt-2 space-y-2">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
          <User size={14} className="mr-1" />
          {task.assignee}
        </div>
        {task.dueTime && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
            <Clock size={14} className="mr-1" />
            {task.dueTime}
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
            <Calendar size={14} className="mr-1" />
            {task.dueDate}
          </div>
        )}
      </div>

      {task.priority === "urgent" && (
        <div className="mt-2 flex items-center text-red-500 dark:text-red-400 text-sm">
          <AlertCircle size={14} className="mr-1" />
          דחוף
        </div>
      )}
    </div>
  );
};

export default TaskCard;
