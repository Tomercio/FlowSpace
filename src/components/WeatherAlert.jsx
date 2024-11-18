import React from "react";
import { Cloud } from "lucide-react";

const WeatherAlert = () => {
  const weatherWarning =
    "Heavy rain expected today - Take necessary precautions";

  return (
    <div className="mb-6 max-w-[98%] mx-auto">
      <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex items-center">
          <Cloud className="text-yellow-500 mr-2" />
          <p className="text-yellow-700 dark:text-yellow-100">
            {weatherWarning}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlert;
