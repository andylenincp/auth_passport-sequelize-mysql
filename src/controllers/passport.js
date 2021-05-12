const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models').User;
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await User.findAll({ where: { username } });
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password);
    if (validPassword) {
      console.log('Welcome ' + user.name);
      done(null, user, req.flash('success', 'Welcome ' + user.username));
    } else {
      console.log('Incorrect password');
      done(null, false, req.flash('message', 'Incorrect password'));
    }
  } else {
    console.log('The username do not exists');
    return done(null, false, req.flash('message', 'The username does not exists'));
  }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { name } = req.body;
    const newUser = {
        name, username, password
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await User.create(newUser);
    newUser.id = result.dataValues.id;
    console.log(newUser.id);
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
  const rows = await User.findAll({ where: { id } });
  done(null, rows[0]);
});