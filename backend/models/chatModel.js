import mongoose from 'mongoose';

const chatModel = mongoose.Schema(
  {
    chatName: {
      type: 'string',
      required: true,
      trim: true,
    },
    isGroupChat: {
      type: 'boolean',
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatModel);

module.exports = Chat;
