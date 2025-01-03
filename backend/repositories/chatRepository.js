const chatModel = require('../models/chatModel');

// Function to get chat by managerId, userId, and bookingId
async function getChat(managerId, userId, bookingId) {
  try {
    return await chatModel
      .findOne({ manager: managerId, user: userId, bookingId })
      .populate("manager", "name email profilePicture") // Select specific fields to populate
      .populate("user", "name email profilePicture");
  } catch (error) {
    throw new Error(`Error in getChat: ${error.message}`);
  }
}


// Function to create a new chat
async function createChat(managerId, userId, bookingId) {
  try {
    if (!managerId || !userId || !bookingId) {
      console.error("Missing required fields in createChat", { managerId, userId, bookingId });
      throw new Error("All fields are required");
    }
    const newChat = new chatModel({
      manager: managerId,
      user: userId,
      bookingId,
      messages: []
    });
    return await newChat.save();
  } catch (error) {
    throw new Error(`Error in createChat: ${error.message}`);
  }
}

// Function to save a message to the chat
async function saveMessage(chatId, message) {
  try {
    console.log("Saving message to chatId:", chatId);

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      console.error("Invalid chatId:", chatId);
      throw new Error("Invalid chat ID");
    }
    if (!message) {
      console.error("Message content missing:", message);
      throw new Error("Message content is required");
    }

    const updatedChat = await chatModel.findByIdAndUpdate(
      chatId,
      { $push: { messages: message } },
      { new: true }
    );

    if (!updatedChat) {
      console.error("Chat not found");
      throw new Error("Chat not found");
    }
    if (message.sender == updatedChat.manager) {
      return { message, reciever: updatedChat.user };
    } else {
      return { message, reciever: updatedChat.manager };
    }
  } catch (error) {
    throw new Error(`Error in saveMessage: ${error.message}`);
  }
}

// Function to get chat by bookingId
async function getChatByBookingId(bookingId) {
  try {
    return await chatModel.findOne({ bookingId });
  } catch (error) {
    throw new Error(`Error in getChatByBookingId: ${error.message}`);
  }
}

// Function to get chats by userId
async function getChatsByUserId(userId) {
  try {
    return await chatModel
      .find({ user: userId })
      .populate("manager", "name email profilePicture")
      .populate("user", "name email profilePicture");
  } catch (error) {
    throw new Error(`Error in getChatsByUserId: ${error.message}`);
  }
}


// Function to get chats by managerId
async function getChatsByManagerId(managerId) {
  try {
    return await chatModel
      .find({ manager: managerId })
      .populate("manager", "name email profilePicture")
      .populate("user", "name email profilePicture");
  } catch (error) {
    throw new Error(`Error in getChatsByManagerId: ${error.message}`);
  }
}


module.exports = {
  getChat,
  createChat,
  saveMessage,
  getChatByBookingId,
  getChatsByUserId,
  getChatsByManagerId
};
