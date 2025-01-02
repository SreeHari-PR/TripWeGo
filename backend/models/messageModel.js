const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "Manager", 
      required: true,
    },
    recieverId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "voice", "image"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

module.exports = Message;
