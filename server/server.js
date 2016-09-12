var app = require("express")();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require("socket.io")(http);
var path = require("path");
var qs = require('querystring');
var async = require('async');
var bcrypt = require('bcryptjs');
var colors = require('colors');
var cors = require('cors');
var express = require('express')();
var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var request = require('request');
var config = require('./config');

//defining mongo schemas
var pairingSchema = new mongoose.Schema({
  displayName: { type: String },
  code: { type: String, select: false },
});

pairingSchema.pre('save', function(next) {
  var pairing = this;
  if (!pairing.isModified('code')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(pairing.code, salt, function(err, hash) {
      pairing.code = hash;
      next();
    });
  });
});

pairingSchema.methods.compareCode = function(code, done) {
  bcrypt.compare(code, this.code, function(err, isMatch) {
    done(err, isMatch);
  });
};

var Pairing = mongoose.model('Pairing', pairingSchema);

mongoose.connect(config.MONGO_URI);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

app.use(require("express").static('data'));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(require("express").static(path.join(__dirname, '../source')));

 // Force HTTPS on Production
if (app.get('env') === 'production') {
    app.use(function (req, res, next) {
        var protocol = req.get('x-forwarded-proto');
        protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
    });
}


/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(code) {
    var payload = {
        sub: code,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

// creating array of users.
var users=[];

// Auto initiated on connect too server
io.on('connection',function(socket){

    //Storing users into array as an object
    socket.on('user name',function(user_name){
        users.push({id:socket.id,user_name:user_name});
        len=users.length;
        len--;
        //Sending th user Id and List of users
        io.emit('user entrance',users,users[len].id);
    });

    //Sending message to specific person
    socket.on('send msg',function(data_server){
        socket.broadcast.to(data_server.id).emit('get msg',{msg:data_server.msg,id:data_server.id,name:data_server.name});
    });

    //Removig user when user left the chatroom
    socket.on('disconnect',function(){
        for(var i=0;i<users.length;i++){
            if(users[i].id==socket.id){
                users.splice(i,1); //Removing single user
            }
        }
        io.emit('exit',users); //sending list of users
    });
});

/*
 |--------------------------------------------------------------------------
 | Join Session with Pairing Code
 |--------------------------------------------------------------------------
 */
app.post('/join_session', function(req, res) {
    Pairing.compareCode(req.body.code, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid session code' });
      }
      res.send({ token: createJWT(req.body.code) });
    });
});

/*
 |--------------------------------------------------------------------------
 | Create secure pairing code
 |--------------------------------------------------------------------------
 */
app.post('/store_code', function(req, res) {
    var pairingCode = new Pairing({
      displayName: req.body.displayName,
      code: req.body.code
    });
    pairingCode.save(function(err) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.send({ token: createJWT(req.body.code) });
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});



