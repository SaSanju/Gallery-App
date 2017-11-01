const router = require('express').Router();
const mongoose = require("mongoose");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');


router.use(session({ secret: "sdfga465regse", resave: false, saveUninitialized: true }));
router.use(cookieParser());

router.get('/', (req, res) => {
  console.log(req.cookies);
  res.send('Gallery API works');

});

router.get('/dashboard', (req, res) => {
  if (!req.session.username) {
    return res.status(401).send();
  }
  return res.status(200).send();
});


router.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ username: username, password: password }, function (err, user) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!user) {
      return res.status(404).send();
    }
    var token = jwt.sign({ data: user.username }, 'creabird', {
      expiresIn: 3600 // expires in 24 hours
    });
    return res.json({ success: true, username: username, token: token });
  })
});

router.post('/register', (req, res) => {

  var newuser = new User({
    username: req.body.username,
    password: req.body.password
  });

  newuser.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.json({ success: true });
  })

});

router.get('/users', (req, res) => {
  console.log(req);
  mongoose.model('users').find(function (err, users) {
    res.send(users);
  });
});


module.exports = router;