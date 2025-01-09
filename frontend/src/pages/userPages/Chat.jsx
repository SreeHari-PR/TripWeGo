import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import ChatWindow from '../../components/User/ChatWindow';
import { io } from 'socket.io-client';

const UserChat = () => {
  const { bookingId } = useParams();
  const [chat, setChat] = useState(null);
  const [manager, setManager] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const socketRef = useRef(null);

  const fetchChatDetails = useCallback(async () => {
    try {
      if (!token || !bookingId) return;

      const chatResponse = await api.get(`/users/messages/${bookingId}`);
      setChat(chatResponse.data || null);

      const managerResponse = await api.get(`/users/bookings/${bookingId}/manager`);
      setManager(managerResponse.data || null);
    } catch (error) {
      console.error('Error fetching chat details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, token]);


  useEffect(() => {
    if (!socketRef.current && user) {
      socketRef.current = io('http://localhost:5000', {
        transports: ['websocket'],
        query: { Id: user._id },
        withCredentials: true,
      });

      socketRef.current.on('new-message', (message) => {
        console.log(message, "message ----------------")
        setChat((prevChat) => {
          return {
            ...prevChat,
            messages: [...prevChat.messages, message],
          };
        });
      }
      );
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('new-message');
        socketRef.current.disconnect();
      }
    };
  }, [user, socketRef]);

  useEffect(() => {
    fetchChatDetails();
  }, [fetchChatDetails]);

  useEffect(() => {
    if (chat && manager && socketRef.current) {
      socketRef.current.emit('join chat', {
        userId: user?._id || chat.user,
        managerId: manager._id,
        bookingId: chat.bookingId,
      });
    }
  }, [chat, manager, user]);

  const handleSendMessage = async (content) => {
  if (!content.trim() || !user?._id) return;

  const newMessage = { sender: user._id, content };

  try {
    if (chat) {
      setChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, newMessage],
      }));
    }

    if (socketRef.current) {
      socketRef.current.emit('send-message', { chatId: chat?._id, message: newMessage });
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ChatWindow
        chat={chat}
        currentUserId={user?._id || ''}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default UserChat;








