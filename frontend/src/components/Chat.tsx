import React, { useState, useEffect } from 'react';
import { getSocket } from '../socket';
import Message from './Message';
import axios from 'axios';
import { User } from '../models/user';
import { Message as MessageModel } from '../models/message';
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User>();
  const navigate = useNavigate();

  const userStyle = 'cursor-pointer text-sm md:text-md text-gray-200 hover:bg-teal-800 duration-100 ease-linear font-bold my-3 p-5';

  useEffect(() => {
    const getCurrentUser = async () => {
      const token = 'Bearer ' + localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:4000/api/users/current', {
          headers: {
            Authorization: token,
          }
        });

        setCurrentUser(response.data);
      } catch (err) {
        console.log('Failed to get user info ' + err);
      }
    }

    getCurrentUser();
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users');
        const users: User[] = response.data;
        users.filter((user) => user.username != currentUser?.username);

        setUsers(users);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();

    const socket = getSocket();
    socket.on('receiveMessage', (msg: MessageModel) => {
      if (msg.sender === selectedUser && msg.receiver == currentUser?.username ||
        msg.sender === currentUser?.username && msg.receiver == selectedUser
      ) {
        setMessages((prevMessages) => [...new Set([...prevMessages, msg])]);
      }
    });

  }, [selectedUser, currentUser]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedUser) {

      const socket = getSocket();
      socket.emit('sendMessage', { receiver: selectedUser, content: message, sender: currentUser?.username });
      setMessage('');
    }
  };

  const handleUserSelect = async (user: string) => {
    setSelectedUser(user);
    try {
      const response = await axios.get(`http://localhost:4000/api/messages/${user}/${currentUser?.username}`);
      const messages: MessageModel[] = response.data

      setMessages(() => messages);
    } catch (error) {
      console.error('Failed to load messages', error);
    }
  };

  return (
    <div className="mb-4 flex h-screen w-full">
      <div className='h-screen w-[20%] flex flex-col px-6 pt-5 justify-between bg-gray-200'>
        <ul>
          {users.map((user) => (
            <li className={(user.username == selectedUser) ? userStyle + ' bg-teal-800' : userStyle + ' bg-teal-600'}
              key={user.username} onClick={() => handleUserSelect(user.username)}>
              {(user.username == currentUser?.username) ? 'Personal Chat' : user.username}
            </li>
          ))}
        </ul>
        <div className='flex justify-evenly items-center pb-5 cursor-pointer' onClick={() => {
          navigate('/', {
            replace: true,
          })
        }}>
          <h2 className='text-teal-600 text-xl font-semibold'>
            {currentUser?.username}
          </h2>
          <TbLogout2 className='size-4 md:size-6 text-teal-600' />
        </div>
      </div>

      <div className='m-4 w-full h-screen'>
        <div className="mb-4 space-y-2">
          {messages.map((msg, index) => (
            <Message key={index} message={msg.content} sender={msg.sender} />
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
    </div>
  );
};

export default Chat;
