import React from 'react';

const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
    <div className="flex items-center gap-2">
      <span className="text-red-500">❌</span>
      <span className="text-red-700 font-medium">{message}</span>
    </div>
  </div>
);

export default ErrorMessage; 