import React, { useState, useEffect, useRef } from "react";
import { Plus, Search, BarChart2 } from "lucide-react";
import Column from "./Column";
import TaskAnalytics from "./TaskAnalytics";

const Board = () => {
  const [columns, setColumns] = useState({
    "משימות חדשות": [],
    בהמתנה: [],
    בעבודה: [],
    הושלם: [],
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newDueTime, setNewDueTime] = useState("");
  const [newPriority, setNewPriority] = useState("רגילה");
  const [editTask, setEditTask] = useState(null);
  const [editTaskTime, setEditTaskTime] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    assignee: "",
    dueDate: "",
    dueTime: "",
  });
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Hybrid drag handling state
  const [draggedTask, setDraggedTask] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const columnRefs = useRef({});

  useEffect(() => {
    const savedColumns = localStorage.getItem("taskColumns");
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("taskColumns", JSON.stringify(columns));
  }, [columns]);

  const handleTimeUpdate = (taskId, columnName, newTime) => {
    setColumns((prev) => {
      const updatedColumns = { ...prev };
      updatedColumns[columnName] = updatedColumns[columnName].map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            dueTime: newTime,
            lastEdited: new Date().toISOString(),
          };
        }
        return task;
      });
      return updatedColumns;
    });
  };

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
      const matchesDueTime =
        !filters.dueTime || task.dueTime === filters.dueTime;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesAssignee &&
        matchesDueDate &&
        matchesDueTime
      );
    });
  };

  const handleTouchStart = (e, task, sourceColumn) => {
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    setDraggedTask({ task, sourceColumn });
  };

  const handleTouchMove = (e) => {
    if (!draggedTask) return;
    e.preventDefault();
  };

  const handleTouchEnd = (targetColumn) => {
    if (!draggedTask || !targetColumn) return;

    if (targetColumn !== draggedTask.sourceColumn) {
      moveTask(draggedTask.task, draggedTask.sourceColumn, targetColumn);
    }

    setDraggedTask(null);
    setTouchStartX(0);
    setTouchStartY(0);
  };

  const handleDragStart = (e, task, columnName) => {
    if (e && e.dataTransfer) {
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({ task, columnName })
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    try {
      const { task, columnName: sourceColumn } = JSON.parse(
        e.dataTransfer.getData("application/json")
      );

      if (sourceColumn !== targetColumn) {
        moveTask(task, sourceColumn, targetColumn);
      }
    } catch (err) {
      console.error("Error parsing drag data:", err);
    }
  };

  const moveTask = (task, sourceColumn, targetColumn) => {
    setColumns((prev) => {
      const updatedColumns = { ...prev };
      updatedColumns[sourceColumn] = updatedColumns[sourceColumn].filter(
        (t) => t.id !== task.id
      );
      updatedColumns[targetColumn] = [
        ...updatedColumns[targetColumn],
        { ...task, lastMoved: new Date().toISOString() },
      ];

      return updatedColumns;
    });
  };

  const resetNewTaskForm = () => {
    setNewTask("");
    setNewAssignee("");
    setNewDueDate("");
    setNewDueTime("");
    setNewPriority("רגילה");
    setShowAddModal(false);
  };

  const addTaskToTodo = () => {
    if (newTask.trim() === "" || newAssignee.trim() === "") {
      alert("נא למלא את שם המשימה והאחראי!");
      return;
    }

    const newTaskObj = {
      id: Date.now().toString(),
      task: newTask,
      assignee: newAssignee,
      dueDate: newDueDate,
      dueTime: newDueTime,
      priority: newPriority,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    setColumns((prev) => ({
      ...prev,
      "משימות חדשות": [...prev["משימות חדשות"], newTaskObj],
    }));

    resetNewTaskForm();
  };

  const handleEditTask = (columnName, taskId) => {
    const taskToEdit = columns[columnName].find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditTaskTime(taskToEdit.dueTime || ""); // Set initial time
      setEditTask({ ...taskToEdit, columnName }); // Set other task data
    }
  };

  const saveEditedTask = () => {
    if (editTask) {
      const { columnName, ...updatedTask } = editTask;
      setColumns((prev) => {
        const updatedColumns = { ...prev };
        updatedColumns[columnName] = updatedColumns[columnName].map((task) =>
          task.id === updatedTask.id
            ? {
                ...updatedTask,
                dueTime: editTaskTime,
                lastEdited: new Date().toISOString(),
              }
            : task
        );
        return updatedColumns;
      });
      setEditTask(null);
      setEditTaskTime("");
    }
  };

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
      setEditTaskTime("");
    }
  };
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen" dir="rtl">
      <div className="mb-6 max-w-[98%] mx-auto">
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="flex items-center px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md 
              hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          <BarChart2 className="ml-2" size={20} />
          {showAnalytics ? "הסתר אנליטיקות" : "הצג אנליטיקות"}
        </button>
        {showAnalytics && <TaskAnalytics columns={columns} />}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 max-w-[98%] mx-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="חיפוש משימות..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
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
            <option value="">כל העדיפויות</option>
            <option value="urgent">דחוף</option>
            <option value="high">גבוהה</option>
            <option value="normal">רגילה</option>
            <option value="low">נמוכה</option>
          </select>
        </div>
      </div>

      {/* Board Header */}
      <div className="flex justify-between items-center mb-8 max-w-[98%] mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          לוח עבודה
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md 
                   hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          <Plus className="ml-2" size={20} />
          משימה חדשה
        </button>
      </div>

      {/* Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[98%] mx-auto">
        {Object.entries(columns).map(([columnName, tasks]) => (
          <div
            key={columnName}
            ref={(el) => (columnRefs.current[columnName] = el)}
            className="h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnName)}
          >
            <Column
              columnName={columnName}
              tasks={getFilteredTasks(tasks)}
              onDragStart={handleDragStart}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(columnName)}
              onEditTask={handleEditTask}
            />
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                הוספת משימה חדשה
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
                  שם המשימה
                </label>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="מה צריך לעשות?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  שייך ל
                </label>
                <input
                  type="text"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="מי יבצע את המשימה?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  תאריך יעד
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  שעה{" "}
                </label>
                <input
                  type="time"
                  value={newDueTime}
                  onChange={(e) => setNewDueTime(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  עדיפות
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="low">עדיפות נמוכה</option>
                  <option value="normal">עדיפות רגילה</option>
                  <option value="high">עדיפות גבוהה</option>
                  <option value="urgent">דחוף</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800"
              >
                ביטול
              </button>
              <button
                onClick={addTaskToTodo}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                הוסף משימה
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
              עריכת משימה
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  שם המשימה
                </label>
                <input
                  type="text"
                  value={editTask.task}
                  onChange={(e) =>
                    setEditTask({ ...editTask, task: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  שייך ל
                </label>
                <input
                  type="text"
                  value={editTask.assignee}
                  onChange={(e) =>
                    setEditTask({ ...editTask, assignee: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  תאריך יעד
                </label>
                <input
                  type="date"
                  value={editTask.dueDate || ""}
                  onChange={(e) =>
                    setEditTask({ ...editTask, dueDate: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  שעה{" "}
                </label>
                <input
                  type="time"
                  value={editTaskTime || ""}
                  onChange={(e) => setEditTaskTime(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  עדיפות
                </label>
                <select
                  value={editTask.priority || "normal"}
                  onChange={(e) =>
                    setEditTask({ ...editTask, priority: e.target.value })
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="low">עדיפות נמוכה</option>
                  <option value="normal">עדיפות רגילה</option>
                  <option value="high">עדיפות גבוהה</option>
                  <option value="urgent">דחוף</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditTask(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800"
              >
                ביטול
              </button>
              <button
                onClick={saveEditedTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                שמור שינויים
              </button>
              <button
                onClick={deleteTask}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                מחק משימה
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
