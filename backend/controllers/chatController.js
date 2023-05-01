const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('UserId params not sent with the request');
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  let chatData;

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }

  try {
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id })
      .populate('users', '-password')
      .sort({ updatedAt: -1 })
      .then(
        async (result) =>
          (result = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: 'name pic email',
          }))
      );
    res.status(200).send(fullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    let allChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    allChats = await User.populate(allChats, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });

    res.status(200).send(allChats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(400);
    throw new Error('Please fill all the fields');
  }
  let allUsers = JSON.parse(req.body.users);

  if (allUsers.length < 2) {
    res.status(400);
    throw new Error('More than 2 users are require to create a geroup chat');
  }
  allUsers.push(req.user);
  try {
    const newGroupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: allUsers,
      groupAdmin: req.user,
    });
    const groupChat = await Chat.findOne({ _id: newGroupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).send(groupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate('users', '-passwords')
    .populate('groupAdmin', '-password');
  if (!updatedChat) {
    res.status(400);
    throw new Error('Chat not found');
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const addedToGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!addedToGroup) {
    res.status(400);
    throw new Error('Chat not found');
  } else {
    res.json(addedToGroup);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removedFromGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removedFromGroup) {
    res.status(400);
    throw new Error('Chat not found');
  } else {
    res.json(removedFromGroup);
  }
});
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
