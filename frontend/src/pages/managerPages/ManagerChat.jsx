'use client'

import React, { useEffect, useState, useRef } from 'react';
import ChatWindow from '../../components/User/ChatWindow';
import api from '../../services/api';
import { io } from 'socket.io-client';
import { MessageCircle, Hotel, User } from 'lucide-react';

const ManagerChat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [manager, setManager] = useState(null);
  const [bookings, setBookings] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const storedManager = localStorage.getItem('managerData');
    if (storedManager) {
      const parsedManager = JSON.parse(storedManager);
      setManager(parsedManager);
      fetchBookings(parsedManager._id);
    }
  }, []);

  useEffect(() => {
    if (manager && !socketRef.current) {
      socketRef.current = io('http://localhost:5000', {
        transports: ['websocket'],
        query: {
          Id: manager._id,
        },
        withCredentials: true,
      });

      socketRef.current.on('new-message', (message) => {
        setSelectedChat((prevChat) => {
          if (prevChat) {
            return { ...prevChat, messages: [...prevChat.messages, message] };
          }
          return prevChat;
        });
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [manager]);

  const fetchBookings = async (managerId) => {
    try {
      const response = await api.get(`/manager/bookings/${managerId}`);
      console.log('Bookings response:', response.data);
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleUserSelect = async (booking) => {
    try {
      const response = await api.get(`/manager/chats/${booking._id}`);
      const existingChat = response.data;

      if (existingChat && existingChat.messages.length > 0) {
        setSelectedChat(existingChat);
        socketRef.current?.emit('join chat', {
          managerId: existingChat.manager,
          userId: existingChat.user,
          bookingId: existingChat.bookingId,
        });
      } else {
        const createResponse = await api.post('/manager/send', {
          receiver: booking.userId,
          senderId: manager._id,
          bookingId: booking._id,
          content: `Hello ${booking.userId.name}, welcome to our ${booking.hotelId.name}!`,
        });
        const newChat = createResponse.data;
        setSelectedChat(newChat);
        socketRef.current?.emit('join chat', {
          managerId: newChat.manager,
          userId: newChat.user,
          bookingId: newChat.bookingId,
        });
      }
    } catch (error) {
      console.error('Error handling user select:', error);
    }
  };

  const handleSendMessage = async (content) => {
    if (selectedChat && socketRef.current) {
      const newMessage = {
        sender: manager._id,
        content,
        timestamp: new Date().toISOString(), 

      };
      setSelectedChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, newMessage],
      }));
      socketRef.current.emit('send-message', { chatId: selectedChat._id, message: newMessage });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3  bg-white shadow-lg overflow-hidden">
        <h2 className="text-2xl font-bold p-6 bg-blue-600 text-white flex items-center h-24">
          <MessageCircle className="mr-2" />
          Chat Users
        </h2>
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b transition duration-200 ease-in-out"
              onClick={() => handleUserSelect(booking)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{booking.userId.name}</p>
                  <p className="text-sm text-gray-500 truncate flex items-center">
                    <Hotel className="w-4 h-4 mr-1" />
                    {booking.hotelId.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-white shadow-lg flex flex-col">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            currentUserId={manager?._id}
            otherusername={bookings.find((booking) => booking._id === selectedChat.bookingId)?.userId.name}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <MessageCircle className="w-16 h-16 mb-4 text-blue-500" />
            <p className="text-xl font-semibold">Select a user to start messaging</p>
            <p className="text-sm mt-2">Choose from the list on the left to begin a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerChat;
