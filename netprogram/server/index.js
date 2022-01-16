// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').Server(app);
var session=require('express-session')

app.set('trust proxy',1)
app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true,
  cookie:{maxAge:1000*60*10}

}))
var io = require('socket.io')(http,{
  allowEIO3: true,
  cors: {
      origin: '*',
      methods: ["GET", "POST"],
  }
});

const api = require('./api')
api(app)

http.listen(8081, function () {
  console.log('Server listening at port 8081');
});

var chat 


io.on('connection', function(socket){
  console.log('center.vue connection')
 
  socket.on('joinToRoom', function (data) {
    console.log('joinToRoom')
    chat = data
    console.log(chat)
    socket.account = chat.account
    socket.nickName = chat.nickName
    let roomGroupId = chat.chatToGroup
    socket.join(roomGroupId)
    io.sockets.in(roomGroupId).emit('joinToRoom', chat)
  })
  socket.on('disconnect', function () {
    console.log('one disconnect')
  })
  // 接收消息
  socket.on('emitChat', function (data) {
    chat = data
    console.log(data)
    let roomGroupId = chat.chatToGroup
    socket.in(roomGroupId).emit('broadChat', chat)
  })
});


