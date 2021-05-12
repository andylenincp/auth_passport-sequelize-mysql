const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

router.get('/users', isLoggedIn, userController.getUsers);

module.exports = router;