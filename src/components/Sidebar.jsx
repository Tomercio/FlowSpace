import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, X, Calendar, Settings } from "lucide-react";
import { AiFillSun } from "react-icons/ai";
import { FaCloudMoon } from "react-icons/fa";

const Sidebar = ({ isOpen, onClose, darkMode, toggleDarkMode }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/settings", label: "Settings", icon: Settings },
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
          fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          overflow-hidden
        `}
      >
        <div className="flex justify-between items-center p-4 lg:hidden">
          <h2 className="font-semibold text-gray-800 dark:text-white">Menu</h2>
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
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg 
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center p-2 rounded-lg
              hover:bg-gray-100 dark:hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700
              text-gray-500 dark:text-gray-400"
          >
            {darkMode ? <AiFillSun size={20} /> : <FaCloudMoon size={20} />}
            <span className="ml-2">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
