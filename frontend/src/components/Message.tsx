import React from 'react';

interface MessageProps {
  message: string;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className="p-2 bg-gray-200 rounded">
      {message}
    </div>
  );
};

export default Message;
