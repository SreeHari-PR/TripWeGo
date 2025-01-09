'use client'

import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Calendar, Send, Paperclip, Smile } from 'lucide-react';
import ChatInput from './ChatInput';

const ChatWindow = ({ chat, currentUserId, onSendMessage }) => {
  const messagesEndRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const otherUser = currentUserId === chat.manager ? chat.user : chat.manager;
  console.log(otherUser,'gfgfg');

  // const formatTimestamp = (timestamp) => {
  //   const date = new Date(timestamp);
  //   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // };

  return (
    <div className="flex flex-col h-full bg-gray-50 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center space-x-4">
        <div className="h-12 w-14 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-xl shadow-md">
          {otherUser.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{otherUser}</h2>
          <div className="flex items-center text-sm text-indigo-100">
            <Calendar className="w-4 h-4 mr-2" />
            <p>Booking {chat.bookingId}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-100">
        {chat && chat.messages.length > 0 ? (
          chat.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                  message.sender === currentUserId
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white shadow-md'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === currentUserId ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {/* {formatTimestamp(message.timestamp)} */}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow-inner">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-indigo-500 opacity-50" />
            <p className="text-gray-600 font-medium">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-indigo-600 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button 
            className="text-gray-500 hover:text-indigo-600 transition-colors"
            onClick={() => setShowEmoji(!showEmoji)}
          >
            <Smile className="w-5 h-5" />
          </button>
          <ChatInput onSendMessage={onSendMessage} showEmoji={showEmoji} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

