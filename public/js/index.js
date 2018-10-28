var socket = io();
socket.on('connect', function(){
  console.log('Connected to server');


});



socket.on('newMessage',function(message){
  // console.log('newMessage Event: ',message);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = $('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);

  $('#messages').append(li);
});
socket.on('disconnect', function(){
  console.log('Disconnected from server');
});

socket.on('newLocationMessage',function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = $('<li></li>');
  var a = $('<a target="_blank">My current location</a>');
  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);
  $('#messages').append(li);
});


$('#message-from').on('submit',function(e){
  e.preventDefault();
  var messageTextbox = $('[name=message]');
  socket.emit('createMessage',{
    from : 'user',
    text : messageTextbox.val()
  },function(){
    messageTextbox.val('');
  });
});

var locationButton = $('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('Geolocation is not supported by your browser.');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(postion){
    locationButton.removeAttr('disabled').text('Send location');
    // console.log(postion);
    socket.emit('createLocationMessage',{
      latitude : postion.coords.latitude,
      longitude : postion.coords.longitude
    });
  },function(){
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  });

});
