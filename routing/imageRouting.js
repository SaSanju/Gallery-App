const router = require('express').Router();
const mongoose = require("mongoose");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const Image = require('../models/Image.js');
const Session = require('../models/Session');


router.use(session({ secret: "sdfga465regse", resave: false, saveUninitialized: true }));
router.use(cookieParser());


router.post('/gallery', (req, res) => {
  mongoose.model('images').find({ username: req.body.username, sessionname: req.body.sessionname }, function (err, images) {
    res.send(images);
  }).sort({ "imageindex": 1 });
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
    username: req.body.username,
    categoryname: req.body.categoryname
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
  Session.find({ username: req.body.username, categoryname: req.body.categoryname },
     function (err, sessions) {
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