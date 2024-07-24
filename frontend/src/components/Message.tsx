import React from 'react';

interface MessageProps {
  message: string;
  sender: string;
}

const Message: React.FC<MessageProps> = ({ message, sender }) => {
  return (
    <div>
      <p className='text-teal text-lg'>
        {sender}
      </p>
      <div className="p-2 bg-gray-200 rounded">
        {message}
      </div>
    </div>
  );
};

export default Message;
