import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Board from "./components/Board";
import Calendar from "./components/Calendar";
import { Toaster } from "react-hot-toast";

import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isTouchDevice = "ontouchstart" in window;
  const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;
  const options = { enableMouseEvents: true, delayTouchStart: 200 };

  useEffect(() => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const savedTheme = localStorage.getItem("darkMode");
    setDarkMode(
      savedTheme !== null ? JSON.parse(savedTheme) : systemPrefersDark
    );
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <DndProvider backend={dndBackend} options={options}>
      <Router>
        <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 flex flex-col">
          <Navbar
            darkMode={darkMode}
            toggleDarkMode={() => setDarkMode((prev) => !prev)}
            toggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode((prev) => !prev)}
            />
            <main className="flex-1 overflow-auto p-4">
              <Routes>
                <Route
                  path="/"
                  element={<Board isTouchDevice={isTouchDevice} />}
                />
                <Route path="/calendar" element={<Calendar />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster position="bottom-right" />
      </Router>
    </DndProvider>
  );
}

export default App;
