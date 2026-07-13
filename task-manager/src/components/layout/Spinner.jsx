import React from "react";

const Spinner = ({ text }) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-gray-500">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
};

export default Spinner;
