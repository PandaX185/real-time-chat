import React from 'react';
import Chat from './components/Chat';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4 bg-white rounded shadow">
        <Chat />
      </div>
    </div>
  );
};

export default App;
