const express = require('express');
const { resgisterUser, authUser, searchUsers } = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware')
const router = express.Router();

router.route('/').post(resgisterUser).get(protect, searchUsers)
router.route('/login').post(authUser)

module.exports = router