import React from "react";
import TaskCard from "./TaskCard";

const Column = ({
  columnName,
  tasks,
  onDragOver,
  onDrop,
  onDragStart,
  onEditTask,
}) => {
  return (
    <div
      className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm p-4 h-fit touch-none"
      onDragOver={(e) => onDragOver(e)} // Allow drag-over behavior
      onDrop={(e) => onDrop(e, columnName)} // Handle drop event with column name
    >
      <h2 className="font-bold text-lg mb-4 flex items-center dark:text-white">
        <span
          className={`w-3 h-3 rounded-full mr-2 ${
            columnName === "Todo"
              ? "bg-yellow-400 dark:bg-yellow-500"
              : columnName === "Pending"
              ? "bg-orange-400 dark:bg-orange-500"
              : columnName === "Working"
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
            onDragStart={(e) => onDragStart(e, task, columnName)} // Pass task and column name
            onEdit={onEditTask}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
