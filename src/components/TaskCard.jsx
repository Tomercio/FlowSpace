import React, { useState } from "react";
import { Calendar, AlertCircle, User, MoreVertical } from "lucide-react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

const TaskCard = ({ task, columnName, onDragStart, onEdit }) => {
  const [touchStartPosition, setTouchStartPosition] = useState(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: "TASK", // Drag type
    item: { task, columnName }, // Data being dragged
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    begin: () => {
      if (onDragStart) {
        onDragStart(task, columnName); // Trigger the onDragStart handler
      }
    },
  });

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true }); // Avoid rendering a default drag preview
  }, [preview]);

  // Handle touch start
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStartPosition({ x: touch.clientX, y: touch.clientY });
    if (onDragStart) {
      onDragStart(task, columnName); // Trigger the onDragStart handler
    }
  };

  // Handle touch end (simulates drop)
  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const touchEndPosition = { x: touch.clientX, y: touch.clientY };

    // Check if the touch moved significantly; otherwise, treat it as a drop
    if (
      touchStartPosition &&
      (Math.abs(touchEndPosition.x - touchStartPosition.x) > 10 ||
        Math.abs(touchEndPosition.y - touchStartPosition.y) > 10)
    ) {
      e.target.dispatchEvent(new Event("drop", { bubbles: true }));
    }

    setTouchStartPosition(null);
  };

  return (
    <div
      ref={drag} // Attach drag functionality for desktop
      className={`bg-blue-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-3 
        shadow-sm hover:shadow-md transition-shadow cursor-move touch-none
        ${isDragging ? "opacity-50" : "opacity-100"}`}
      draggable
      onTouchStart={handleTouchStart} // Add touch support
      onTouchEnd={handleTouchEnd}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {task.task}
        </h3>
        <button
          onClick={() => onEdit(columnName, task.id)} // Trigger task edit on click
          className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Task Details */}
      <div className="mt-2 space-y-2">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
          <User size={14} className="mr-1" />
          {task.assignee}
        </div>
        {task.dueDate && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
            <Calendar size={14} className="mr-1" />
            {task.dueDate}
          </div>
        )}
      </div>

      {/* Priority Badge */}
      {task.priority === "urgent" && (
        <div className="mt-2 flex items-center text-red-500 dark:text-red-400 text-sm">
          <AlertCircle size={14} className="mr-1" />
          Urgent
        </div>
      )}
    </div>
  );
};

export default TaskCard;
