require('dotenv').config()
var express = require('express');
var path = require('path');
const uuid = require('react-uuid')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/agriTech", {useNewUrlParser: true,  useUnifiedTopology: true })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
const usersc = [
  {id: '2f24vvg', email: 'test@test.com', password: 'password'}
]
var User = require('./models/User');
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    console.log(email);
    console.log(password);
    User.findOne({username:email}, (err, user) => {
      console.log(user)
    })
    const user = usersc[0] 
    if(email === 'test@test.com' && password === 'password') {
      console.log('Local strategy returned true')
      return done(null, user)
    }
  }
));
passport.serializeUser((user, done) => {
  console.log('Inside serializeUser callback. User id is save to the session file store here')
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log('Inside deserializeUser callback')
  console.log(`The user id passport saved in the session file store is: ${id}`)
  const user = usersc[0].id === id ? usersc[0] : false; 
  done(null, user);
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  genid: (req) => {
    console.log('Inside session middleware genid function')
    console.log(`Request object sessionID from client: ${req.sessionID}`)
    return uuid() 
  },
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.listen(3000,(err) => {
  console.log("server started at port 3000..");
});

