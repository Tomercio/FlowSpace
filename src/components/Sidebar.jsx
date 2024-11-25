import React from "react";
import { Home, X, Calendar, Settings, Sun, Moon } from "lucide-react";

const Sidebar = ({ isOpen, onClose, darkMode, toggleDarkMode }) => {
  const navItems = [
    { path: "/", label: "לוח בקרה", icon: Home },
    { path: "/calendar", label: "לוח שנה", icon: Calendar },
    { path: "/settings", label: "הגדרות", icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 right-0 z-30 w-64 bg-white dark:bg-gray-800 
          border-l border-gray-200 dark:border-gray-700 
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0 flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          overflow-hidden
        `}
      >
        <div className="flex justify-between items-center p-4 lg:hidden">
          <h2 className="font-semibold text-gray-800 dark:text-white">תפריט</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.path;

            return (
              <a
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg 
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                <Icon size={18} className="ml-2" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg
              hover:bg-gray-100 dark:hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700
              text-gray-500 dark:text-gray-400"
          >
            {darkMode ? (
              <Sun size={20} className="ml-2" />
            ) : (
              <Moon size={20} className="ml-2" />
            )}
            <span>{darkMode ? "מצב בהיר" : "מצב כהה"}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
