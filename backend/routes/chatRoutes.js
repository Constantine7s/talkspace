const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require('../controllers/chatController');

const router = express.Router();

router.route('/').get(protect, fetchChats);
router.route('/').post(protect, accessChat);
router.route('/group').post(protect, createGroupChat);
router.route('/renamegroup').put(protect, renameGroup);
router.route('/addtogroup').put(protect, addToGroup);
router.route('/romvefromgroup').put(protect, removeFromGroup);

module.exports =  router;
