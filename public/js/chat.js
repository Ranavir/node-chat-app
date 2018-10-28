var socket = io();
function scrollToBottom(){
  //selectors
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');
  //Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function(){
  //console.log('Connected to server');
  var params = $.deparam(window.location.search);

  socket.emit('join',params, function(err){
    if(err){
      alert(err);
      window.location.href = '/';
    }else{
      console.log('no error');
    }
  });
});


socket.on('updateUserList',function(users){
  // console.log(users);
  var ol = $('<ol></ol>');

  users.forEach(function(user){
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
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
  scrollToBottom();
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
  scrollToBottom();
});

socket.on('disconnect', function(){
  console.log('Disconnected from server');
});

$('#message-from').on('submit',function(e){
  e.preventDefault();
  var messageTextbox = $('[name=message]');
  socket.emit('createMessage',{
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
