const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const { database } = require('./config/keys');

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

// Initializations
const db = require('./models');
const app = express();

require('./controllers/passport');

// Settings
app.set('title', 'passport-sequelize-mysql');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3000);
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(session({
    secret: 'andylenincp',
    resave: true,
    saveUninitialized: true.valueOf,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user || null;
    next();
});

// Routes
app.use(authRouter);
app.use(indexRouter);
app.use(userRouter);

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Server
db.sequelize.sync().then((req) => {
    console.log('Synchronized models');
    app.listen(app.get('port'), () => {
        console.log(app.get('title'), 'listening at the port', app.get('port'));
    });
}).catch((err) => {
    console.log(err);
});