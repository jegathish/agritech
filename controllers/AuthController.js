var mongoose = require('mongoose')
var passport = require("passport")
var Post = require("../models/Post.js")
var User = require("../models/User.js")
var Interest = require("../models/Interest.js")
var bcrypt = require('bcrypt')
var nodemailer = require('nodemailer')
var userController = {};

// login and register routes handling

userController.home = (req, res) => {
    res.render('home.ejs', {name : req._passport.session.user });
};

userController.register = (req, res) => {
    res.render('register.ejs');
};

userController.doRegister = async (req, res) => {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
          id: Date.now().toString(),
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          mobile: req.body.mobile,
          date: Date()
        })
        await user.save();
        res.redirect('/login')
      } catch(e) {
        console.log(e)
        res.redirect('/register')
      }    
};
  

userController.login = (req, res) => {
    res.render('login.ejs');
};


userController.doLogin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })


userController.logout = (req, res) => {
    req.logout();
    res.redirect('/login');
};

// posts routes handling

userController.newpost = (req, res) => {
    res.render('newpost.ejs');
};

userController.createNewpost = (req, res) => {

    const post = new Post({
        user: req._passport.session.user,
        postType: req.body.postType,
        product: req.body.product.toLowerCase(),
        quantity: req.body.quantity,
        scale: req.body.scale,
        place: req.body.place,
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        address: req.body.address,
        date: new Date()
    });
    post.save((err) => {
        res.render('response.ejs',{message: (err)?(err): "posted successfully!", route: (err)?("newpost"):("mypost")});
    });
};

// view routes handling

userController.need = (req, res) => {
    Post.find({postType: 'Need'}, (err, foundItems) => {
        if(!err){
            res.render('view.ejs', {items: (foundItems),deleteType: "hidden",mailType:"visible"});
        }
    });
};

userController.available = (req, res) => {
    Post.find({postType: 'Available'}, (err, foundItems) => {
        if(!err){
            res.render('view.ejs', {items: (foundItems), deleteType: "hidden",mailType:"visible"});
        }
    });
};

userController.mypost = (req, res) => {
    Post.find({user: req._passport.session.user}, (err, foundItems) => {
        if(!err){
          res.render('view.ejs', {items: foundItems, deleteType:"", mailType:"hidden"});
        } 
    });
};

//mailing and search handling
userController.sendMail = (req, res) => {
    User.findOne({id:req._passport.session.user}, (err, user) => {
        if(err){
          res.render("response.ejs",{message: "some error occured...please try after sometimes! ",route: "available"});
        }
        else{
          Post.findOne({_id:req.body.productId}, async (err, post) => {
            if(err){
              res.render("response.ejs",{message: "some error occured...please try after sometimes! ",route: "available"});
            } else {
              //interest detail 
              try {
                const interest = new Interest({
                  senderId: user.id,
                  receiverId: post.user,
                  postId: post._id,
                  date: new Date(),
                })
                await interest.save();
                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: "agritechmailer@gmail.com",
                    pass: "jegathish@19"
                  }
                }); 
                var mailOptions = {
                  from: "agritechmailer@gmail.com",
                  to: post.email,
                  subject: "Got Response for your post! ",
                  text: `Your post details:
                  
                  product: ${post.product}
                  post time: ${post.date}
                  quantity: ${post.quantity}${post.scale}
                  place: ${post.place}
      
                  
                  // Interested person contact detail:
                  Name: ${user.name},
                  mobile: ${user.mobile},
                  email: ${user.username},
                  `
                };
      
                transporter.sendMail(mailOptions, (err, info) => {
                  (err)?(console.log(err)): (console.log("Email sent: " + info.response))
                  res.render("response.ejs", {message: (err)? "some error occured...please try after sometimes!": "your interest is sent Successfully!", route:"available"})
                });

              } catch (error) {
                res.render("response.ejs", {message: (err)? "some error occured...please try after sometimes!": "your interest is sent Successfully!", route:"available"})
                console.log(err);
              }
               
            } 
          }); 
        }
      }); 
};

userController.search = (req, res) => {
    Post.find({product: req.body.searchName.toLowerCase()}, (err,foundItems) => {
        if(!err){
          res.render('view.ejs', {items: (foundItems), deleteType: "hidden",mailType:"visible"});
        }
    });
};

// delete route handling
userController.deletePost = (req, res) => {
    Post.find({_id: req.body.itemId}, (err, foundItem) => {
        if((JSON.parse(JSON.stringify(foundItem[0])).user == req._passport.session.user) && !err){
          Post.deleteOne({_id: req.body.itemId}, (err) => {
            
            if(!err){
              // if(isadmin()){
              //   res.render("response.ejs", {message: 'Deleted successfully!',route:'/admin/users'})
              // }
              // else{
                res.render("response.ejs", {message: 'Deleted successfully!',route:'mypost'})
              // }
            } else {
              // if(isadmin()){
              //   res.render("response.ejs", {message: 'Unexpected error! please try again!',route:'/admin/users'})
              // }
              // else{
                res.render("response.ejs", {message: "Unexpected error! please try again!",route: "mypost"});            }
            // }
          })
        } else {
          res.render("response.ejs", {message: "You are not allowed to perform this action!",route:"mypost"})
        }
      })
};


module.exports = userController;