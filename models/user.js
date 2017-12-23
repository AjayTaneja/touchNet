var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var messageSchema = mongoose.Schema({
    messagesTo: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      name: String
    },
    author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      name: String
    },
    messageText: String
});

var userSchema = new mongoose.Schema({
    name: String,
    profilePicture: String,
    username: String,
    password: String,
    usersWithOpenedMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    messages: [messageSchema],
    unreadMessages: Number
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
