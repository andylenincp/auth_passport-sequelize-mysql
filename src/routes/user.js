const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/users', isLoggedIn, userController.getUsers);
router.get('/users/add', isLoggedIn, (req, res) => {
    res.render('users/add');
});
router.post('/users/add', userController.createUser);
router.get('/users/delete/:id', isNotLoggedIn, userController.deleteUser);

module.exports = router;