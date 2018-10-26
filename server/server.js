const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);//C:\ranvir\Projects\NodeProjects\node-chat-app\public

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));


io.on('connection',(socket) =>{
  console.log('New User connected');

  // socket.emit('newEmail');
  socket.emit('newMessage',{
    from :'Ranavir',
    text : 'This is sample Message',
    createdAt : 124
  });
  socket.on('createMessage', (message)=>{
    console.log('createMessage Event :',message);
  });
  socket.on('disconnect', ()=>{
    console.log('Disconnected from client');
  });
});

server.listen(port,() =>{
  console.log(`Server is up and listening on port ${port}`);
});
