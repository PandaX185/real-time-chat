import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Message from './Message';
import axios from 'axios';

const socket = io('http://localhost:4000');

class User {
  constructor(
    public id: string,
    public username: string,
  ){}
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]); 
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('') ;

  useEffect(()=>{
    const getCurrentUser = async () => {
      const token = 'Bearer '+ localStorage.getItem('token');
      try{
        const response = await axios.get('http://localhost:4000/api/users/current',{
          headers: {
            Authorization: token,
          }
        });
        
        setCurrentUser(response.data);
        console.log(currentUser);
      }catch(err){
        console.log('Failed to get user info '+ err);
      }
    }

    getCurrentUser();
  },);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users');
        const users: User[] = response.data;
        users.filter((user)=>user.id != currentUser);

        setUsers(users);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();

    socket.on('receiveMessage', (msg: { senderId: string; content: string; receiverId: string }) => {
      if (msg.senderId === selectedUser && msg.receiverId == currentUser) {
        setMessages((prevMessages) => [...prevMessages, msg.content]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedUser,currentUser]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedUser) {
      socket.emit('sendMessage', { to: selectedUser, content: message });
      setMessages((prevMessages) => [...prevMessages, message]); 
      setMessage('');
    }
  };

  const handleUserSelect = async (userId: string) => {
    setSelectedUser(userId);
    try {
      const response = await axios.get(`http://localhost:4000/api/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Chat Application</h1>
      <div className="mb-4">
        <h2 className="text-xl">Select User:</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} onClick={() => handleUserSelect(user.id)} className="cursor-pointer">
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <div>
          <h2 className="text-xl mb-2">Chat with {selectedUser}</h2>
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
      )}
    </div>
  );
};

export default Chat;
