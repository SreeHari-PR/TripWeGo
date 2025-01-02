import React, { useState } from 'react';
import { Send, Phone, Video, MoreVertical, Search, ArrowLeft, Star, Bell } from 'lucide-react';

const ManagerChatInterface = () => {
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Front Desk', category: 'Staff', lastMessage: 'New guest arriving in 30 minutes', time: '10:30 AM', unread: 2, priority: true },
    { id: 2, name: 'John Doe', category: 'Guest', lastMessage: 'Thank you for the upgrade!', time: '9:45 AM', unread: 0, priority: false },
    { id: 3, name: 'Housekeeping', category: 'Staff', lastMessage: 'Room 302 ready for inspection', time: 'Yesterday', unread: 1, priority: false },
    { id: 4, name: 'Jane Smith', category: 'Guest', lastMessage: 'Issue with room service order', time: 'Yesterday', unread: 3, priority: true },
    { id: 5, name: 'Maintenance', category: 'Staff', lastMessage: 'AC fixed in room 505', time: '2 days ago', unread: 0, priority: false },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('All');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const filteredConversations = conversations.filter(conv => 
    filter === 'All' || conv.category === filter
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversation List */}
      <div className={`w-full md:w-1/3 bg-white border-r ${selectedConversation ? 'hidden md:block' : ''}`}>
        <div className="p-4 border-b">
          <h2 className="text-2xl font-semibold">Manager Chat</h2>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="mt-4 flex space-x-2">
            {['All', 'Staff', 'Guest'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-180px)]">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedConversation(conv)}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                conv.category === 'Staff' ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                {conv.name.charAt(0)}
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{conv.name}</h3>
                  {conv.priority && <Star className="text-yellow-500" size={16} />}
                </div>
                <p className="text-xs text-gray-500">{conv.category}</p>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{conv.time}</p>
                {conv.unread > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 mt-1 inline-block">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`w-full md:w-2/3 flex flex-col ${!selectedConversation ? 'hidden md:flex' : ''}`}>
        {selectedConversation ? (
          <>
            <div className="bg-white p-4 flex items-center border-b">
              <ArrowLeft className="md:hidden mr-2 cursor-pointer" onClick={() => setSelectedConversation(null)} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                selectedConversation.category === 'Staff' ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                {selectedConversation.name.charAt(0)}
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex items-center">
                  <h3 className="font-semibold">{selectedConversation.name}</h3>
                  {selectedConversation.priority && <Star className="text-yellow-500 ml-2" size={16} />}
                </div>
                <p className="text-sm text-gray-600">{selectedConversation.category}</p>
              </div>
              <div className="flex space-x-4">
                <Phone className="text-gray-600 cursor-pointer" size={20} />
                <Video className="text-gray-600 cursor-pointer" size={20} />
                <Bell className="text-gray-600 cursor-pointer" size={20} />
                <MoreVertical className="text-gray-600 cursor-pointer" size={20} />
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
              {/* Chat messages would go here */}
              <div className="bg-white p-3 rounded-lg shadow mb-2 max-w-[70%]">
                <p className="text-sm">{selectedConversation.lastMessage}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedConversation.time}</p>
              </div>
              <div className="bg-blue-500 text-white p-3 rounded-lg shadow mb-2 max-w-[70%] ml-auto">
                <p className="text-sm">Thank you for bringing this to my attention. I'll look into it right away.</p>
                <p className="text-xs text-blue-200 mt-1">Just now</p>
              </div>
            </div>
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="ml-4 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerChatInterface;
