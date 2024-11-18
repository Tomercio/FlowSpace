import React, { useState, useEffect } from "react";
import { Plus, Search, BarChart2 } from "lucide-react";
import Column from "./Column";
import EmergencyContacts from "./EmergencyContacts";
import TaskAnalytics from "./TaskAnalytics";

const Board = () => {
  const [columns, setColumns] = useState({
    Todo: [],
    Pending: [],
    Working: [],
    Finished: [],
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState("normal");
  const [editTask, setEditTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    assignee: "",
    dueDate: "",
  });

  useEffect(() => {
    const savedColumns = localStorage.getItem("taskColumns");
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("taskColumns", JSON.stringify(columns));
  }, [columns]);

  // Filter functions
  const getFilteredTasks = (tasks) => {
    return tasks.filter((task) => {
      const matchesSearch =
        !filters.search ||
        task.task.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.assignee.toLowerCase().includes(filters.search.toLowerCase());
      const matchesPriority =
        !filters.priority || task.priority === filters.priority;
      const matchesAssignee =
        !filters.assignee || task.assignee === filters.assignee;
      const matchesDueDate =
        !filters.dueDate || task.dueDate === filters.dueDate;

      return (
        matchesSearch && matchesPriority && matchesAssignee && matchesDueDate
      );
    });
  };

  // Task Management Functions
  const resetNewTaskForm = () => {
    setNewTask("");
    setNewAssignee("");
    setNewDueDate("");
    setNewPriority("normal");
    setShowAddModal(false);
  };

  const addTaskToTodo = () => {
    if (newTask.trim() === "" || newAssignee.trim() === "") {
      alert("Please fill in both task name and assignee!");
      return;
    }

    const newTaskObj = {
      id: Date.now().toString(),
      task: newTask,
      assignee: newAssignee,
      dueDate: newDueDate,
      priority: newPriority,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    setColumns((prev) => ({
      ...prev,
      Todo: [...prev.Todo, newTaskObj],
    }));

    resetNewTaskForm();
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault(); // Ensure drag-over behavior works correctly
  };

  const handleDragStart = (e, task, columnName) => {
    if (e && e.dataTransfer) {
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({ task, columnName })
      );
    } else {
      console.error("DragStart event or dataTransfer is not defined");
    }
  };

  const handleDrop = (e, columnName) => {
    e.preventDefault();
    try {
      const { task, columnName: draggedColumnName } = JSON.parse(
        e.dataTransfer.getData("application/json")
      );

      if (draggedColumnName && draggedColumnName !== columnName) {
        setColumns((prev) => {
          const updatedColumns = { ...prev };
          updatedColumns[draggedColumnName] = updatedColumns[
            draggedColumnName
          ].filter((t) => t.id !== task.id);
          updatedColumns[columnName] = [
            ...updatedColumns[columnName],
            { ...task, lastMoved: new Date().toISOString() },
          ];
          return updatedColumns;
        });
      }
    } catch (err) {
      console.error("Error parsing dataTransfer data:", err);
    }
  };

  // Edit Task Functions
  const handleEditTask = (columnName, taskId) => {
    const taskToEdit = columns[columnName].find((task) => task.id === taskId);
    setEditTask({ ...taskToEdit, columnName });
  };

  const saveEditedTask = () => {
    if (editTask) {
      const { columnName, ...updatedTask } = editTask;
      setColumns((prev) => {
        const updatedColumns = { ...prev };
        updatedColumns[columnName] = updatedColumns[columnName].map((task) =>
          task.id === updatedTask.id
            ? { ...updatedTask, lastEdited: new Date().toISOString() }
            : task
        );
        return updatedColumns;
      });
      setEditTask(null);
    }
  };

  const [showAnalytics, setShowAnalytics] = useState(false);

  const deleteTask = () => {
    if (editTask) {
      const { columnName, id } = editTask;
      setColumns((prev) => {
        const updatedColumns = { ...prev };
        updatedColumns[columnName] = updatedColumns[columnName].filter(
          (task) => task.id !== id
        );
        return updatedColumns;
      });
      setEditTask(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <EmergencyContacts />

      <div className="mb-6 max-w-[98%] mx-auto">
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="flex items-center px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md 
              hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          <BarChart2 className="mr-2" size={20} />
          {showAnalytics ? "Hide Analytics" : "Show Analytics"}
        </button>
        {showAnalytics && <TaskAnalytics columns={columns} />}
      </div>
      {/* Search and Filters */}
      <div className="mb-6 max-w-[98%] mx-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                       dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priority: e.target.value }))
            }
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                   dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Board Header */}
      <div className="flex justify-between items-center mb-8 max-w-[98%] mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Work Board
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md 
                   hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2" size={20} />
          Add New Task
        </button>
      </div>

      {/* Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[98%] mx-auto">
        {Object.entries(columns).map(([columnName, tasks]) => (
          <Column
            key={columnName}
            columnName={columnName}
            tasks={getFilteredTasks(tasks)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onEditTask={handleEditTask}
          />
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                Add New Task
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Name
                </label>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="What needs to be done?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assign To
                </label>
                <input
                  type="text"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Who will do this?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={addTaskToTodo}
                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 
                       dark:hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Edit Task
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Name
                </label>
                <input
                  type="text"
                  value={editTask.task}
                  onChange={(e) =>
                    setEditTask({ ...editTask, task: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assign To
                </label>
                <input
                  type="text"
                  value={editTask.assignee}
                  onChange={(e) =>
                    setEditTask({ ...editTask, assignee: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editTask.dueDate || ""}
                  onChange={(e) =>
                    setEditTask({ ...editTask, dueDate: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white 
                         hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={editTask.priority || "normal"}
                  onChange={(e) =>
                    setEditTask({ ...editTask, priority: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white 
hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditTask(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedTask}
                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 
                       dark:hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={deleteTask}
                className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 
                       dark:hover:bg-red-700"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
