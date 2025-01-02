const chatRepository = require('../repositories/chatRepository');


async function getOrCreateChat(managerId, userId, bookingId) {
  console.log(managerId, userId, bookingId,'managerId, userId, bookingId')
  try {
    if (!managerId || !userId || !bookingId) {
      throw new Error("Manager ID, User ID, and Booking ID are required");
    }

    let chat = await chatRepository.getChat(managerId, userId, bookingId);

    
    if (!chat) {
      chat = await chatRepository.createChat(managerId, userId, bookingId);
      console.log(chat,'chat');
      
    }
    return chat;
  } catch (error) {
    throw new Error(`Error in getOrCreateChat: ${error.message}`);
  }
}

async function saveMessage(chatId, message) {
 
  try {
    if (!chatId) {
      throw new Error("Chat ID is required");
    }

    const updatedChat = await chatRepository.saveMessage(chatId, message);
    if (!updatedChat) {
      throw new Error("Failed to save message");
    }
    return updatedChat;
  } catch (error) {
    throw new Error(`Error in saveMessage: ${error.message}`);
  }
}

async function getChatByBookingId(bookingId) {
  try {
    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    return await chatRepository.getChatByBookingId(bookingId);
  } catch (error) {
    throw new Error(`Error in getChatByBookingId: ${error.message}`);
  }
}


async function getChatsByUser(userId) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    return await chatRepository.getChatsByUserId(userId);
  } catch (error) {
    throw new Error(`Error in getChatsByUser: ${error.message}`);
  }
}


async function getChatsByManager(managerId) {
  try {
    if (!managerId) {
      throw new Error("Manager ID is required");
    }

    return await chatRepository.getChatsByManagerId(managerId);
  } catch (error) {
    throw new Error(`Error in getChatsByManager: ${error.message}`);
  }
}

module.exports = {
  getOrCreateChat,
  saveMessage,
  getChatByBookingId,
  getChatsByUser,
  getChatsByManager
};
