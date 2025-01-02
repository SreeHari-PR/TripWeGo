// const mongoose = require("mongoose");

// const { Schema, model, Types } = mongoose;

// const chatSchema = new Schema(
//   {
//     participants: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "User", // Reference to User model, can be 'User' or 'Manager' depending on your design
//       },
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Manager", // Reference to Manager model if you have one
//       }
//     ],
//     messages: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Message", // Reference to Message model
//         default: [],
//       },
//     ],
//     lastMessage: {
//       type: Schema.Types.ObjectId,
//       ref: "Message", // Reference to the last message
//       required: false, // Optional field
//     },
//   },
//   { timestamps: true }
// );

// const Chat = model("Chat", chatSchema);

// module.exports = Chat;


const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingId: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  messages: [
    {
      sender: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Chat', chatSchema);
