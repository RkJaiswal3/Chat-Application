const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');
const { ConversationModel, MessageModel } = require('../models/ConversationModel');
const getConversation = require('../helpers/getConversation');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // e.g. 'http://localhost:3000'
    credentials: true
  }
});
const onlineUser = new Set();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
io.on('connection', async (socket) => {
  try {
    console.log('Connect User !', socket.id);
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);
    if (!user || !user._id) {
      console.log('Invalid token');
      socket.disconnect();
      return;
    }
    socket.join(user?._id.toString());
    onlineUser.add(user?._id.toString());

    io.emit('onlineUser', Array.from(onlineUser));
    socket.on('message-page', async (userId) => {

      if (!isValidObjectId(userId)) return;

      console.log("UserId", userId);
      const userDetails = await UserModel.findById(userId).select("-password");

      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUser.has(userId)
      }
      socket.emit('message-user', payload);
      const getConversation = await ConversationModel.findOne({
        "$or": [
          { sender: user?._id, receiver: userId },
          { sender: userId, receiver: user?._id }
        ]
      }).populate('message').sort({ updatedAt: -1 })
      // get previous message
      if (getConversation) {
        socket.emit('message', getConversation.message);
      } else {
        socket.emit('message', []); // or null, depending on frontend handling
      }
    });
    // new message 
    socket.on('new-meassage', async (data) => {
      // console.log("Image url :", data.image, "Text : ", data.text);
      // check the conversation message available or not

      let conversation = await ConversationModel.findOne({
        "$or": [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender }
        ]
      })
      if (!conversation) {
        const createConversation = new ConversationModel({
          sender: data?.sender,
          receiver: data?.receiver
        })
        conversation = await createConversation.save();
      }
      const message = new MessageModel({
        imageUrl: data.image,
        videoUrl: data.video,
        text: data.text,
        msByUserId: data?.msByUserId
      });
      const saveMessage = await message.save();
      const updateConversation = await ConversationModel.updateOne({ _id: conversation?._id },
        {
          "$push": { message: saveMessage?._id }
        })
      const getConversationMessage = await ConversationModel.findOne({
        "$or": [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender }
        ]
      }).populate('message').sort({ updatedAt: -1 })
      io.to(data?.sender).emit('message', getConversationMessage?.message || [])
      io.to(data?.receiver).emit('message', getConversationMessage?.message || [])


      //send conversation
      const conversationSender = await getConversation(data?.sender);
      const conversationReceiver = await getConversation(data?.receiver);

      io.to(data?.sender).emit('conversation', conversationSender)
      io.to(data?.receiver).emit('conversation', conversationReceiver)


    })
    //sidebar 
    socket.on('sidebar', async (currentUserID) => {
      if (!isValidObjectId(currentUserID)) return;

      // console.log("Current User : ", currentUserID);
      const conversation = await getConversation(currentUserID);
      socket.emit('conversation', conversation);

    })


    //seen 

    socket.on('seen', async (msgByUserId) => {
      let conversation = await ConversationModel.findOne({
        "$or": [
          { sender: user?._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user?._id }
        ]
      })

      const conversationMsgId = conversation?.message || [];


      const updateMessage = await ConversationModel.updateMany(
        { id: { "$in": conversationMsgId }, msByUserId: msgByUserId },
        { "$set": { seen: true } }
      )
      //send conversation
      const conversationSender = await getConversation(user?._id?.toString());
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(user?._id?.toString()).emit('conversation', conversationSender)
      io.to(msgByUserId).emit('conversation', conversationReceiver)
    })




    // disconnect
    socket.on('disconnect', () => {
      onlineUser.delete(user?._id?.toString);
      io.emit('onlineUser', Array.from(onlineUser));
    });
  } catch (err) {
    console.error('Socket error:', err);
    socket.disconnect();
  }
});
module.exports = {
  app,
  server
};
