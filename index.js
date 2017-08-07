var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Redis = require('ioredis');
var redis = new Redis();
redis.subscribe('notifications','project');

redis.on('message',function(channel,message){
    message = JSON.parse(message);
    if(channel == 'notifications'){
      io.emit(channel+'-'+message.user_id,message);
    }else if(channel == 'project') {
      // for (var i = 0; i < message.users.length; i++) {
      //   io.emit(channel+'-'+message.event+'-'+message.users[i].id,message.data);
      // }
      io.emit(channel+'-'+message.event,message.data);
    }

    // io.emit(channel+'-'+message.user_id,message);
});


app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  // console.log('a user connected');
  socket.on('disconnect', function(){
    // console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

});

http.listen(3000, function(){
  // console.log('listening on *:3000');
});
