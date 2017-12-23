var mongoose = require("mongoose"),
    socketIO = require("socket.io"),
    User     = require("../models/user");

module.exports = function(server){
  var io = socketIO(server);

  io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('subscribe', function(room) {
      console.log('joining room', room);
      socket.join(room);

      var clientsInTheRoom = io.sockets.adapter.rooms[room];
      console.log("Clients in the room : " + clientsInTheRoom.length);
    });

    socket.on('chat message', function(data){

      var chatRoom = data.chatRoom;
      var messageAuthorId = data.currentUser.id;
      var messageAuthorName = data.currentUser.name;
      var messageReceiverId = data.messageUser.id;
      var messageReceiverName = data.messageUser.name;
      var messageText = data.message;

      console.log("**************************************************");
      console.log(messageAuthorId);
      console.log(messageReceiverId);
      console.log('message data: ' + data);
      console.log(data.chatRoom);
      console.log(data.message);
      console.log("**************************************************");

      var saveMessageForAuthorUser = {
        messagesTo: {
          id: messageReceiverId,
          name: messageReceiverName
        },
        author: {
          id: messageAuthorId,
          name: messageAuthorName
        },
        messageText: messageText
      };
      User.findById(messageAuthorId, function(err, authorUser){
        if(err){
          console.log(err);
        }else {
          console.log("authorUser : " + authorUser.name);
          authorUser.messages.push(saveMessageForAuthorUser);

          if(authorUser.usersWithOpenedMessages.indexOf(messageReceiverId) === -1){
            authorUser.usersWithOpenedMessages.unshift(messageReceiverId);
          }else {
            var array = authorUser.usersWithOpenedMessages;
            var index = array.indexOf(messageReceiverId);
            for (var i = index; i > 0; i--) {
              array[i] = array[i-1];
            }
            array[0] = messageReceiverId;
            authorUser.usersWithOpenedMessages = array;
          }
          authorUser.save();
        }
      });

      var saveMessageForReceiverUser = {
        messagesTo: {
          id: messageAuthorId,
          name: messageAuthorName
        },
        author: {
          id: messageAuthorId,
          name: messageAuthorName
        },
        messageText: messageText
      };
      User.findById(messageReceiverId, function(err, receiverUser){
        if(err){
          console.log(err);
        }else {
          console.log("receiverUser : " + receiverUser.name);
          receiverUser.messages.push(saveMessageForReceiverUser);

          if(receiverUser.usersWithOpenedMessages.indexOf(messageAuthorId) === -1){
            receiverUser.usersWithOpenedMessages.unshift(messageAuthorId);
          }else {
            var array = receiverUser.usersWithOpenedMessages;
            var index = array.indexOf(messageAuthorId);
            for (var i = index; i > 0; i--) {
              array[i] = array[i-1];
            }
            array[0] = messageAuthorId;
            receiverUser.usersWithOpenedMessages = array;
          }
          receiverUser.save();
        }
      });

      // var clientsInTheRoom = io.sockets.adapter.rooms[room];
      // console.log("Clients in the room : " + clientsInTheRoom.length);
      if(io.sockets.adapter.rooms[chatRoom].length == 1){
        User.findById(messageReceiverId, function(err, user){
          if(err){
            console.log(err);
          }else {
            user.unreadMessages += 1;
            user.save();
            console.log("unreadMessages count saved");
          }
        });
      }

      var message = {
        messageAuthorId: messageAuthorId,
        messageAuthorName: messageAuthorName,
        messageText: messageText
      };
      console.log("author name is : " + messageAuthorName);
      io.to(data.chatRoom).emit('chat message', message);
    });
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

}
