import React, { useState } from "react";
import { Mail, Lock, User, UserPlus, LogIn, X, Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-1">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
            <img
              src="/flowspace.png"
              alt="FlowSpace Logo"
              className="h-20 w-28" // Adjust image size
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              dir="ltr"
              onClick={() => setShowAuthModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <LogIn className="w-4 mr-2 mt-0.5" />
              התחבר{" "}
            </button>
          </div>
        </div>
      </nav>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLogin ? "התחבר" : "הירשם"}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="sr-only">
                    שם מלא{" "}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleChange}
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700"
                      placeholder="שם מלא..."
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="sr-only">
                  אימייל{" "}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700"
                    placeholder="אימייל..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  סיסמה
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700"
                    placeholder="סיסמה..."
                  />
                </div>
              </div>

              {isLogin ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer"
                    >
                      זכור אותי{" "}
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="/"
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      שכחת סיסמה?{" "}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer"
                  >
                    אני מסכים ל{" "}
                    <a
                      href="/"
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      תנאים והגבלות{" "}
                    </a>
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLogin ? (
                    <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                  ) : (
                    <UserPlus className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                  )}
                </span>
                {isLogin ? "התחבר" : "צור משתמש"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {isLogin
                    ? "אין לך חשבון? הירשם עכשיו"
                    : "כבר יש לך חשבון? התחבר עכשיו"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
