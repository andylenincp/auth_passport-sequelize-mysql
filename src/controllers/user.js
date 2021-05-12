const passport = require('passport');
const User = require('../models').User;

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('users/list', { users });
    } catch (e) {
        res.send('Ha ocurrido un error', e);
    }
};

module.exports = { getUsers };