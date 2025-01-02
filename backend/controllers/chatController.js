const HTTP_statusCode = require('../utils/httpStatusCodes');
const chatService = require('../services/chatService');

async function sendMessage(req, res) {
  try {
    const { content, receiver, bookingId } = req.body;
    const senderId = req.user.id; 

    if (!senderId || !receiver || !bookingId) {
      return res.status(HTTP_statusCode.BAD_REQUEST).json({
        message: 'Sender ID, Receiver ID, and Booking ID are required.',
      });
    }

    const message = {
      content,
      sender: senderId,
      timestamp: new Date(),
    };
    console.log(senderId,receiver,'sender','reciever')
    const chat = await chatService.getOrCreateChat(senderId, receiver, bookingId);
    const savedChat = await chatService.saveMessage(chat._id.toString(), message);

    return res.status(HTTP_statusCode.OK).json(savedChat);
  } catch (error) {
    console.error('Error sending message:', error);
    return res
      .status(HTTP_statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error sending message' });
  }
}

async function getMessages(req, res) {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    if (!userId) {
      return res.status(HTTP_statusCode.BAD_REQUEST).json({ message: 'User ID is required' });
    }

    const messages = await chatService.getChatByBookingId(bookingId);
    return res.status(HTTP_statusCode.OK).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res
      .status(HTTP_statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error fetching messages' });
  }
}

async function getChatRooms(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(HTTP_statusCode.BAD_REQUEST).json({ message: 'User ID is required' });
    }

    const chatRooms = await chatService.getChatsByUser(userId);
    return res.status(HTTP_statusCode.OK).json(chatRooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return res
      .status(HTTP_statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error fetching chat rooms' });
  }
}

module.exports = {
  sendMessage,
  getMessages,
  getChatRooms
};
