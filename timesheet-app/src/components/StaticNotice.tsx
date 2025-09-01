import React from 'react';

export const StaticNotice: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md rounded-lg shadow-lg">
      <p className="font-bold">Note:</p>
      <p className="text-sm">
        This is a demo version. For full functionality with Google login, the backend needs to be deployed.
        Currently using local storage for data persistence.
      </p>
    </div>
  );
};