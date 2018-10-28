const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);//C:\ranvir\Projects\NodeProjects\node-chat-app\public

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));


io.on('connection',(socket) =>{
  console.log('New User connected');

  socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat App'));

  socket.broadcast.emit('newMessage',generateMessage('Admin', 'New User Joined'));

  socket.on('createMessage', (message, callback)=>{
    console.log('createMessage Event :',message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is message from server.');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage',generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', ()=>{
    console.log('Disconnected from client');
  });
});

server.listen(port,() =>{
  console.log(`Server is up and listening on port ${port}`);
});
