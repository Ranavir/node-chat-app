const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);//C:\ranvir\Projects\NodeProjects\node-chat-app\public

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));


io.on('connection',(socket) =>{
  console.log('New User connected');



  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and Room name are required.');
    }

    socket.join(params.room);//user joins a Room
    users.removeUser(socket.id);//remove the user from any other room
    users.addUser(socket.id, params.name, params.room);//add user to the chat Room

    //emit event to clients in this room for updated user list
    io.to(params.room).emit('updateUserList',users.getUserList(params.room));

    socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat App'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });
  socket.on('createMessage', (message, callback)=>{
    console.log('createMessage Event :',message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is message from server.');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage',generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', ()=>{
    // console.log('Disconnected from client');
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
    }
  });
});

server.listen(port,() =>{
  console.log(`Server is up and listening on port ${port}`);
});
