

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const ChatInput = ({ onSendMessage, showEmoji }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-gray-100 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
      />
      <button
        type="submit"
        className="ml-2 bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 transition-colors duration-300"
      >
        <Send className="w-5 h-5" />
      </button>
      {showEmoji && (
        <div className="absolute bottom-20 right-4">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </form>
  );
};

export default ChatInput;

