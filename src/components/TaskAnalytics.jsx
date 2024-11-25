import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TaskAnalytics = ({ columns }) => {
  const analyticsData = React.useMemo(() => {
    if (!columns) return [];

    return Object.entries(columns).map(([status, tasks]) => ({
      status,
      total: tasks.length,
      urgent: tasks.filter((t) => t?.priority === "urgent").length,
      high: tasks.filter((t) => t?.priority === "high").length,
      normal: tasks.filter((t) => t?.priority === "normal").length,
      low: tasks.filter((t) => t?.priority === "low").length,
    }));
  }, [columns]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        חלוקת משימות{" "}
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData}>
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="urgent" fill="#ef4444" name="דחוף" />
            <Bar dataKey="high" fill="#f97316" name="עדיפות גבוהה" />
            <Bar dataKey="normal" fill="#3b82f6" name="עדיפות סבירה" />
            <Bar dataKey="low" fill="#22c55e" name="עדיפות נמוכה" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskAnalytics;
