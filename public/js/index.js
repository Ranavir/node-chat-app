var socket = io();
socket.on('connect', function(){
  console.log('Connected to server');


});



socket.on('newMessage',function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template,{
    from : message.from,
    text : message.text,
    createdAt : formattedTime
  });

  $('#messages').append(html);
});


socket.on('newLocationMessage',function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template,{
    from : message.from,
    url : message.url,
    createdAt : formattedTime
  });
  $('#messages').append(html);
});

socket.on('disconnect', function(){
  console.log('Disconnected from server');
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
