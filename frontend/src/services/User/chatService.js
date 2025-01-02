// import api from'../api'

// export const createChat = async (participants) => {
//   const response = await api.post(`/chat`, { participants });
//   return response.data;
// };

// export const getUserChats = async () => {
//   const response = await api.get(`/chats`);
//   return response.data;
// };

// export const sendMessage = async (messageData) => {
//   const response = await api.post(`/message`, messageData);
//   return response.data;
// };

// export const getMessages = async (chatId) => {
//   const response = await api.get(`/messages/${chatId}`);
//   return response.data;
// };



import api from "../api";

const chatService = {
  sendMessage: async ( chatData) => {
    return api.post(`/users/chat/message`, chatData);
  },

  getChatRooms: async () => {
    return api.get(`/users/chats`);
  },

  getMessages: async ( bookingId) => {
    return api.get(`/users/chat/messages/${bookingId}`);
  },
};

export default chatService;
