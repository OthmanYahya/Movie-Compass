import React from "react";

function LoadingIndicator() {
  return (
    <div className="flex justify-center ">
      <div
        className="
          w-12 h-12 /* Standard size, adjustable */
          rounded-full
          border-2 border-solid border-gray-300 dark:border-gray-700 /* The subtle, 'invisible' part of the circle */
          border-t-blue-500 dark:border-t-blue-400 /* The visible, active part of the circle */
          animate-spin /* Standard Tailwind spin animation */
        "
      ></div>
    </div>
  );
}

export default LoadingIndicator;
