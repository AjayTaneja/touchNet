var mongoose = require("mongoose");

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

module.exports = mongoose.model("Message", messageSchema);
