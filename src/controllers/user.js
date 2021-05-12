const passport = require('passport');
const User = require('../models').User;
const helpers = require('../lib/helpers');

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('users/list', { users });
    } catch (e) {
        res.send('Ha ocurrido un error', e);
    }
};

const createUser = async (req, res) => {
    try {
        const user = req.body;
        user.password = await helpers.encryptPassword(req.body.password);
        await User.create(user);
        res.redirect('/users');
    } catch (error) {
        req.flash('message', 'Ha ocurrido un error' + error);
    }
};

module.exports = { getUsers, createUser };