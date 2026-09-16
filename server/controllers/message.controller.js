import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { errorHandler } from "../utils/errorHandler.utils.js";
import { getSocketId, io } from "../socket/socket.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// Controller for sending messages
export const sendMessage = asyncHandler(async (req, res, next) => {
  console.log("sendMessage controller Runned");
  // Getting senderId, ReceiverId and message
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  const message = req.body.message;

  console.log(
    "senderId: ",
    senderId,
    "\nreceiverId: ",
    receiverId,
    "\nmessage: ",
    message
  );

  // Display error if any one of senderId, ReceiverId or message is missing
  if (!senderId || !receiverId || !message) {
    return next(
      new errorHandler(
        "All fields (senderId, receiverId, message) are required",
        400
      )
    );
  }
  console.log("Conversation kay uper hoon");
  // Check if a conversation already exists between sender and receiver
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });
  // create a new converstion if conversation doesn't already exists
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  console.log("conversation: ", conversation);

  // Create a new message object
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });
  // Push it into converstion
  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }

  // Get the receiver’s socket ID from your map
  const socketId = getSocketId(receiverId);

  console.log("newMessage: ", newMessage)

  // Send realtime message only if the user is connected
  if (socketId) {
    io.to(socketId).emit("newMessage", newMessage);
  }

  console.log("send Message Controller runned till end");
  res.status(200).json({
    success: true,
    responseData: newMessage,
  });
});

export const getMessages = asyncHandler(async (req, res, next) => {
  // Getting senderId, ReceiverId and message
  const myId = req.user._id;
  const otherParticipantId = req.params.otherParticipantId;

  // Display error if any one of senderId, ReceiverId or message is missing
  if (!myId || !otherParticipantId) {
    return next(
      new errorHandler("All fields (myId, otherPersonId) are required", 400)
    );
  }

  // Check if a conversation already exists between sender and receiver
  let conversation = await Conversation.findOne({
    participants: { $all: [myId, otherParticipantId] },
  }).populate("messages");

  if (!conversation) {
  return res.status(200).json({
    success: true,
    responseData: []
  });
}


  res.status(200).json({
    success: true,
    responseData: conversation,
  });
});
