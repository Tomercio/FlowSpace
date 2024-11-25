import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Bell, X } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    email: "",
  });

  // Local Storage Effects
  useEffect(() => {
    const savedReminders = localStorage.getItem("calendarReminders");
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarReminders", JSON.stringify(reminders));
  }, [reminders]);

  // Calendar Helper Functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Navigation Functions
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  // Reminder Functions
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAddReminder = () => {
    if (selectedDate) {
      setNewReminder({
        ...newReminder,
        date: selectedDate.toISOString().split("T")[0],
      });
      setShowReminderModal(true);
    }
  };

  const saveReminder = () => {
    if (
      newReminder.title &&
      newReminder.date &&
      newReminder.time &&
      newReminder.email
    ) {
      setReminders([
        ...reminders,
        {
          ...newReminder,
          id: Date.now(),
          notificationSent: false,
        },
      ]);
      setShowReminderModal(false);
      setNewReminder({
        title: "",
        description: "",
        date: "",
        time: "",
        email: "",
      });
    }
  };

  const deleteReminder = (reminderId) => {
    setReminders(reminders.filter((rem) => rem.id !== reminderId));
  };

  // Helper Functions
  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date?.toDateString() === selectedDate?.toDateString();
  };

  const hasReminders = (date) => {
    return reminders.some(
      (rem) => rem.date === date?.toISOString().split("T")[0]
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 w-full max-w-[90%] md:max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex space-x-1 md:space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="p-1 md:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-1 md:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div
              key={day}
              className="text-center text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 py-1 md:py-2"
            >
              {day}
            </div>
          ))}

          {getDaysInMonth(currentDate).map((date, index) => (
            <div
              key={index}
              className={`
                relative aspect-square flex items-center justify-center rounded-lg
                text-xs md:text-base
                ${
                  date
                    ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    : ""
                }
                ${
                  isSelected(date)
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : ""
                }
                ${
                  isToday(date) && !isSelected(date)
                    ? "border border-blue-500 text-blue-500"
                    : ""
                }
              `}
              onClick={() => date && handleDateSelect(date)}
            >
              <span
                className={`
                ${
                  !isSelected(date) && !isToday(date)
                    ? "text-gray-700 dark:text-gray-300"
                    : ""
                }
              `}
              >
                {date?.getDate()}
              </span>
              {hasReminders(date) && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  <Bell className="w-2 h-2 md:w-3 md:h-3 text-blue-500" />
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Selected Date and Reminders */}
        {selectedDate && (
          <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm md:text-lg font-semibold text-gray-800 dark:text-white">
                {selectedDate.toLocaleDateString()}
              </h3>
              <button
                onClick={handleAddReminder}
                className="flex items-center px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                הוסף תזכורת{" "}
              </button>
            </div>

            {/* Reminders List */}
            <div className="space-y-1 md:space-y-2 max-h-32 md:max-h-48 overflow-y-auto">
              {reminders
                .filter(
                  (rem) => rem.date === selectedDate.toISOString().split("T")[0]
                )
                .map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex justify-between items-center p-2 md:p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div>
                      <h4 className="text-xs md:text-sm font-medium text-gray-800 dark:text-white">
                        {reminder.title}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        {reminder.time}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-1 md:p-2 text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 md:p-6 w-full max-w-xs md:max-w-md">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                הוסף תזכורת{" "}
              </h2>
              <button
                onClick={() => setShowReminderModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  כותרת
                </label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, title: e.target.value })
                  }
                  className="w-full p-2 md:p-3 text-sm md:text-base border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="כותרת תזכורת..."
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  זמן
                </label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, time: e.target.value })
                  }
                  className="w-full p-2 md:p-3 text-sm md:text-base border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  אימייל
                </label>
                <input
                  type="email"
                  value={newReminder.email}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, email: e.target.value })
                  }
                  className="w-full p-2 md:p-3 text-sm md:text-base border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="רשום אימייל..."
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  תאור
                </label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) =>
                    setNewReminder({
                      ...newReminder,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 md:p-3 text-sm md:text-base border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="הוסף תאור..."
                  rows={2}
                />
              </div>
            </div>

            <div className="mt-4 md:mt-6 flex justify-end space-x-2 md:space-x-3">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-3 py-1 md:px-4 md:py-2 text-sm md:text-base text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                בטל
              </button>
              <button
                onClick={saveReminder}
                className="px-3 py-1 md:px-4 md:py-2 text-sm md:text-base bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                שמור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
