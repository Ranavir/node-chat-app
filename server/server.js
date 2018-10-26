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

  socket.emit('newMessage',{
    from : 'Admin',
    message: 'Welcome to the chat App',
    createdAt: new Date().getTime()
  });
  socket.broadcast.emit('newMessage',{
    from : 'Admin',
    message: 'New User Joined',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message)=>{
    console.log('createMessage Event :',message);
    // io.emit('newMessage', {
    //   from : message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });

    // socket.broadcast.emit('newMessage', {
    //   from : message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });


  socket.on('disconnect', ()=>{
    console.log('Disconnected from client');
  });
});

server.listen(port,() =>{
  console.log(`Server is up and listening on port ${port}`);
});
