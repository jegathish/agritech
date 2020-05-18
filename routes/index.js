var express = require('express');
var router = express.Router()
var auth = require("../controllers/AuthController.js");

router.get('/', checkAuthenticated, auth.home);

router.get('/register', checkNotAuthenticated, auth.register);

router.post('/register', checkNotAuthenticated, auth.doRegister);

router.get('/login', checkNotAuthenticated, auth.login);

router.post('/login', checkNotAuthenticated, auth.doLogin);

router.get('/logout', checkAuthenticated, auth.logout);

router.get('/newpost', checkAuthenticated, auth.newpost);

router.post('/newpost', checkAuthenticated, auth.createNewpost);

router.get('/need', checkAuthenticated, auth.need);

router.get('/available', checkAuthenticated, auth.available);

router.get('/mypost', checkAuthenticated, auth.mypost);

router.post('/sendmail', checkAuthenticated, auth.home);

router.get('/sendmail', checkAuthenticated, auth.sendMail);

router.post('/search', checkAuthenticated, auth.search);

router.post('/delete', checkAuthenticated, auth.deletePost);

router.get('/delete', checkAuthenticated, auth.mypost);

//authenticatication for route

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}


module.exports = router;