import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Message from './Message';

const socket = io('http://localhost:4000');

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on('receiveMessage', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('sendMessage', message);
    setMessage('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Chat Application</h1>
      <div className="mb-4 space-y-2">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type your message..."
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Send</button>
      </form>
    </div>
  );
};

export default Chat;
