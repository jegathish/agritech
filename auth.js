if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
var indexRoute = require('./routes/index.js')


const initializePassport = require('./passport-config')
initializePassport(passport)

mongoose.connect("mongodb://localhost:27017/agriTech", {useNewUrlParser: true,  useUnifiedTopology: true })
  .then(() =>  console.log('db connection succesful'))
  .catch((err) => console.error(err));
mongoose.set("useCreateIndex", true);


app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use('/',indexRoute);
app.use(express.static('public'))


app.listen(3000,(err) => {
  console.log("server listening at port 3000:")
})
