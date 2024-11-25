import React from "react";
import TaskCard from "./TaskCard";

const Column = ({
  columnName,
  tasks,
  onDragStart,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onEditTask,
}) => {
  return (
    <div
      className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm p-4 h-fit"
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <h2 className="font-bold text-lg mb-4 flex items-center dark:text-white">
        <span
          className={`w-3 h-3 rounded-full mr-2 ${
            columnName === "משימות חדשות"
              ? "bg-yellow-400 dark:bg-yellow-500"
              : columnName === "בהמתנה"
              ? "bg-orange-400 dark:bg-orange-500"
              : columnName === "בעבודה"
              ? "bg-blue-400 dark:bg-blue-500"
              : "bg-green-400 dark:bg-green-500"
          }`}
        />
        {columnName}
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          ({tasks.length})
        </span>
      </h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columnName={columnName}
            onDragStart={onDragStart}
            onTouchStart={onTouchStart}
            onEdit={onEditTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
