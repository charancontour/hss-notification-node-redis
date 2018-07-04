var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Redis = require('ioredis');
var redis = new Redis();
redis.subscribe('notifications','project','case_project');

redis.on('message',function(channel,message){
    message = JSON.parse(message);
    if(channel == 'notifications'){
      io.emit(message.app_name+'-'+channel+'-'+message.user_id,message);
    } else if(channel == 'project') {
      for (var i = 0; i < message.data.users.length; i++) {
        io.emit(message.app_name+'-'+channel+'-'+message.event+'-'+message.data.users[i].id,message.data.data);
      }
      // io.emit(channel+'-'+message.event,message.data);
    } else if(channel == 'case_project') {
      for (var i = 0; i < message.data.users.length; i++) {
        io.emit(message.app_name+'-'+channel+'-'+message.event+'-'+message.data.users[i].id,message.data.data);
        // console.log(message.app_name+'-'+channel+'-'+message.event+'-'+message.data.users[i].id);
      }
      // console.log(message);
      // io.emit(channel+'-'+message.event,message.data);
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
