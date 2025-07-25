const { ConversationModel } = require("../models/ConversationModel");

const getConversation = async (currentUserID) => {
  if (currentUserID) {
    const currentUserConversation = await ConversationModel.find({
      "$or": [
        { sender: currentUserID },
        { receiver: currentUserID }
      ]
    }).sort({ updatedAt: -1 }).populate('message').populate({ path: 'sender', select: '-password' }).populate({ path: 'receiver', select: '-password' })

    const conversation = currentUserConversation.map((conv) => {
      const countUnseenMeg = conv.message.reduce((preve, curr) => {
        const msgByUserId = curr?.msByUserId?.toString();
        if (msgByUserId !== currentUserID) {
          return preve + (curr.seen ? 0 : 1);
        } else {
          return preve;
        }
      }, 0)
      // console.log("Count unseen msg : ", countUnseenMeg);
      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMeg,
        lastMsg: conv?.message[conv?.message?.length - 1]
      }
    })

    return conversation;
  } else {
    return [];
  }
}

module.exports = getConversation;