const express = require('express');
const { resgisterUser, authUser, searchUsers } = require('../controllers/userController');
const router = express.Router();

router.route('/').post(resgisterUser).get(searchUsers)
router.route('/login').post(authUser)

module.exports = router