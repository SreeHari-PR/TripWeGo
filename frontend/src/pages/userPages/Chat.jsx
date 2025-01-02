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




// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import api from '../../services/api';
// import ChatWindow from '../../components/User/ChatWindow';
// import { io } from 'socket.io-client';

// const UserChat = () => {
//   const { bookingId } = useParams();
//   const [chat, setChat] = useState(null);
//   const [manager, setManager] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { user } = useSelector((state) => state.auth);
//   const socketRef = useRef(null);

//   const fetchChatDetails = useCallback(async () => {
//     try {
//       console.log(`Fetching chat details for bookingId: ${bookingId}`);
//       if (!bookingId) {
//         console.warn('No bookingId provided!');
//         return;
//       }

//       const chatResponse = await api.get(`/users/messages/${bookingId}`);
//       console.log('Chat response:', chatResponse.data);
//       setChat(chatResponse.data || null);

//       const managerResponse = await api.get(`/users/bookings/${bookingId}/manager`);
//       console.log('Manager response:', managerResponse.data);
//       setManager(managerResponse.data || null);
//     } catch (error) {
//       console.error('Error fetching chat details:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [bookingId]);

//   useEffect(() => {
//     console.log('Initializing socket connection for user:', user?._id);
//     if (!socketRef.current && user) {
//       socketRef.current = io('http://localhost:5000', {
//         transports: ['websocket'],
//         query: { Id: user._id },
//         withCredentials: true,
//       });

//       socketRef.current.on('new-message', (message) => {
//         console.log('Received new message via socket:', message);
//         setChat((prevChat) => {
//           const existingMessages = prevChat?.messages || [];
//           const isDuplicate = existingMessages.some(
//             (msg) =>
//               msg._id === message._id ||
//               (msg.content === message.content && msg.sender === message.sender)
//           );

//           if (isDuplicate) {
//             console.warn('Duplicate message detected:', message);
//             return prevChat;
//           }

//           console.log('Adding new message to chat:', message);
//           return {
//             ...prevChat,
//             messages: [...existingMessages, message],
//           };
//         });
//       });

//       console.log('Socket connection established:', socketRef.current);
//     }

//     return () => {
//       console.log('Disconnecting socket for user:', user?._id);
//       if (socketRef.current) {
//         socketRef.current.off('new-message');
//         socketRef.current.disconnect();
//         console.log('Socket disconnected');
//       }
//     };
//   }, [user]);

//   useEffect(() => {
//     fetchChatDetails();
//   }, [fetchChatDetails]);

//   useEffect(() => {
//     if (chat && manager && socketRef.current) {
//       console.log('Joining chat room:', {
//         userId: user?._id,
//         managerId: manager._id,
//         bookingId: chat.bookingId,
//       });

//       // Ensure the correct userId and managerId are passed
//       if (user && manager) {
//         socketRef.current.emit('join chat', {
//           userId: user._id,
//           managerId: manager._id,
//           bookingId: chat.bookingId,
//         });
//         console.log('Emitted join chat event with data:', {
//           userId: user._id,
//           managerId: manager._id,
//           bookingId: chat.bookingId,
//         });
//       } else {
//         console.warn('User or Manager data missing. Cannot emit join chat.');
//       }
//     }
//   }, [chat, manager, user]);

//   const handleSendMessage = (content) => {
//     if (!content.trim() || !user?._id) {
//       console.warn('Message content is empty or user is not authenticated.');
//       return;
//     }

//     console.log('Sending message:', content);
//     const newMessage = { sender: user._id, content };

//     // Emit the message with the correct chatId
//     if (socketRef.current && chat?._id) {
//       socketRef.current.emit('send-message', { chatId: chat._id, message: newMessage });
//       console.log('Emitted send-message event with message:', newMessage);
//     } else {
//       console.warn('Socket or chat ID is missing.');
//     }
//   };

//   if (isLoading) {
//     console.log('Loading chat details...');
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <ChatWindow
//         chat={chat}
//         currentUserId={user?._id}
//         onSendMessage={handleSendMessage}
//       />
//     </div>
//   );
// };

// export default UserChat;



