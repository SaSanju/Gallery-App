const router = require('express').Router();
const mongoose = require("mongoose");
const session = require('express-session');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../models/User.js');
const Image = require('../models/Image.js');
const Session = require('../models/Session');


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

router.post('/gallery', (req, res) => {
  mongoose.model('images').find({ username: req.body.username, sessionname: req.body.sessionname }, function (err, images) {
    res.send(images);
  }).sort({"imageindex": 1});
});

router.post('/imageindex', (req, res) => {
  Image.findOneAndUpdate({ _id: req.body.id }, { imageindex: req.body.index }, function (err, images) {
   if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.json({ success: true, images: images });
  });
});

router.post('/createsession', (req, res) => {
  var newSession = new Session({
    sessionname: req.body.sessionname,
    username: req.body.username
  });

  newSession.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.json({ success: true, session: newSession });
  })
});

router.post('/getsession', (req, res) => {
  Session.find({ username: req.body.username }, function (err, sessions) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!sessions) {
      return res.status(404).send();
    }
    return res.json({ success: true, sessions: sessions });
  })
});

router.post('/deleteimage', (req, res) => {
  Image.findByIdAndRemove({ _id: req.body.id }, function (err, image) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!image) {
      return res.status(404).send();
    }
    console.log(image);
    var fPath = './uploads/' + image.imagename;
    fs.unlinkSync(fPath);
    return res.json({ success: true });
  })
});


module.exports = router;