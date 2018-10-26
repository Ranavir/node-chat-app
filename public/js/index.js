var socket = io();
socket.on('connect', function(){
  console.log('Connected to server');

  socket.emit('createMessage',{
    from : 'Ranavir',
    text : 'Sample message text'
  });
});

socket.on('newMessage',function(message){
  console.log('newMessage Event: ',message);
});
socket.on('disconnect', function(){
  console.log('Disconnected from server');
});
