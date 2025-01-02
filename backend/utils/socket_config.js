// const { Server } = require('socket.io');
// const chatService = require('../services/chatService');

// let io;
// let onlineUsers = new Map(); // Key: userId, Value: Set of socketIds

// const configSocketIO = (server) => {
//     io = new Server(server, {
//         cors: {
//             origin: ["http://localhost:5173"], // Add frontend URL
//             methods: ["GET", "POST"],
//         },
//     });

//     io.on("connection", (socket) => {
//         const userId = socket.handshake.query.Id;

//         // Add the socket ID to the user's set
//         if (!onlineUsers.has(userId)) {
//             onlineUsers.set(userId, new Set());
//         }
//         onlineUsers.get(userId).add(socket.id);

//         console.log(`User Connected: ${socket.id}, userId: ${userId}`);
//         console.log("Online Users:", onlineUsers);

//         // Join Chat
//         socket.on('join chat', async ({ managerId, userId, bookingId }) => {
//             if (!managerId || !userId || !bookingId) {
//                 console.error("Missing required data: managerId, userId, or bookingId");
//                 return;
//             }

//             try {
//                 const chat = await chatService.getOrCreateChat(managerId, userId, bookingId);
//                 if (chat && chat._id) {
//                     const room = String(chat._id);
//                     socket.join(room);
//                     console.log(`User ${userId} joined room ${room}`);
//                 } else {
//                     console.error("Chat creation or retrieval failed");
//                 }
//             } catch (error) {
//                 console.error("Error in join chat:", error);
//             }
//         });

//         // Send Message
//         socket.on('send-message', async ({ chatId, message }) => {
//             if (!chatId || !message) {
//                 console.error("Invalid chatId or message data");
//                 return;
//             }

//             try {
//                 const updatedChat = await chatService.saveMessage(chatId, message);
//                 if (updatedChat) {
//                     console.log("Message saved to chat:", updatedChat);

//                     // Broadcast message to the chat room
//                     io.to(String(chatId)).emit('new-message', updatedChat.message);
//                 }
//             } catch (error) {
//                 console.error("Error sending message:", error);
//             }
//         });

//         // Disconnect
//         socket.on('disconnect', () => {
//             // Remove the socket ID from the user's set
//             if (onlineUsers.has(userId)) {
//                 onlineUsers.get(userId).delete(socket.id);

//                 // If no sockets remain, delete the user from onlineUsers
//                 if (onlineUsers.get(userId).size === 0) {
//                     onlineUsers.delete(userId);
//                 }
//             }
//             console.log(`User Disconnected: ${socket.id}, userId: ${userId}`);
//         });
//     });
// };

// module.exports = { configSocketIO, io };


const { Server } = require('socket.io');
const chatService = require('../services/chatService');

let io;
let onlineUsers = new Map(); 

const configSocketIO = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173"], 
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.Id;
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);

        console.log(`User Connected: ${socket.id}, userId: ${userId}`);
        console.log("Online Users:", onlineUsers);

        // Join Chat
        socket.on('join chat', async ({ managerId, userId, bookingId }) => {
            if (!managerId || !userId || !bookingId) {
                console.error("Missing required data: managerId, userId, or bookingId");
                return;
            }

            console.log(`Attempting to join chat for: managerId: ${managerId}, userId: ${userId}, bookingId: ${bookingId}`);
            try {
                const chat = await chatService.getOrCreateChat(managerId, userId, bookingId);
                if (chat && chat._id) {
                    const room = String(chat._id);
                    socket.join(room);
                    console.log(`User ${userId} joined room ${room}`);
                    io.to(room).emit('user-joined', { userId });
                } else {
                    console.error("Chat creation or retrieval failed");
                }
            } catch (error) {
                console.error("Error in join chat:", error);
            }
        });
        socket.on('send-message', async ({ chatId, message }) => {
            if (!chatId || !message) {
                console.error("Invalid chatId or message data");
                return;
            }

            console.log("Received message to send. chatId:", chatId, "message:", message);
            try {
                console.log("Saving message to chatId:", chatId, "Message Content:", message);

                const updatedChat = await chatService.saveMessage(chatId, message);
                if (updatedChat) {
                    console.log("Message saved to chat:", updatedChat);
                    console.log(`Broadcasting message to room ${chatId}`, updatedChat.message);
                    io.to(String(chatId)).emit('new-message', updatedChat.message);
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            if (onlineUsers.has(userId)) {
                onlineUsers.get(userId).delete(socket.id);

                // If no sockets remain, delete the user from onlineUsers
                if (onlineUsers.get(userId).size === 0) {
                    onlineUsers.delete(userId);
                }
            }
            console.log(`User Disconnected: ${socket.id}, userId: ${userId}`);
        });
    });
};

module.exports = { configSocketIO, io };

