const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
//const busboyBodyParser = require('busboy-body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const cookieParser = require('cookie-parser');

mongoose.Promise = global.Promise;


let port = 3000;
const Image = require('./models/Image.js');
const app = express();
const userAPI = require('./routing/userRouting.js');
const categoryAPI = require('./routing/categoryRouting.js');
const imageAPI = require('./routing/imageRouting.js');

const dbURI = 'mongodb://127.0.0.1/gallery-app';

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({secret: "sdfga465regse", resave: false, saveUninitialized: false, cookie: { secure: false }}));

//app.use(busboyBodyParser({ limit: '5mb'} ));
app.use(logger('dev'));
app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept, Name');
        res.header('Access-Control-Allow-Credentials', true);        
        next();
});


app.get('/', function(req, res){
     res.send('Hello Express');
});


app.options('/api');
app.use('/api', userAPI);
app.use('/api', categoryAPI);
app.use('/api', imageAPI);

//DB connection
    
mongoose.connect(dbURI);

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

//File upload 

var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            let randomNo = Math.floor((Math.random() * 1000000) + 1);
            cb(null, 'Image' + '-' + req.headers.name + '-' + randomNo + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

var upload = multer({ //multer settings
                storage: storage
            }).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req, res, function(err){

        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        console.log(req.body);

        var filetype = req.file.mimetype.split('/');

        let newimage = new Image();
        newimage.imagename = req.file.filename;
        newimage.imagetitle = req.file.originalname;
        newimage.imagetype = filetype[0];
        newimage.username = req.headers.name;
        newimage.sessionname = req.body.sessionname;

        newimage.save(function(err, savedImage) {
          if(err) {
            console.log(err);
            return res.status(500).send();
          }
          return res.status(200).send(); 
        })
        res.json({error_code:0,err_desc:null});
    });
});


app.listen(port, function(){
	console.log('Server is listening at ' + port);
})

