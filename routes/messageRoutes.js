var express    = require("express"),
    router     = express.Router(),
    User       = require("../models/user"),
    middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
  User.findByIdAndUpdate(req.user._id, {unreadMessages: 0}, function(err, user){
    if(err){
      console.log(err);
    }else {
      console.log("unreadMessages count set to 0");
    }
  });

  User.find({}, function(err, allUsers){
    if(err){
      console.log(err);
      res.redirect("back");
    }else {
      User.findById(req.user._id).populate("usersWithOpenedMessages").exec(function(err, populatedUser){
        if(err){
          console.log(err);
        }else {
          var lastMessages = [];
          // find last message from each user from usersWithOpenedMessages and push it into the
          // lastMessages array and provide it to the messages page
          populatedUser.usersWithOpenedMessages.forEach(function(openedUser){
            for (var i = populatedUser.messages.length - 1; i >= 0; i--) {
              if(populatedUser.messages[i].messagesTo.id.toString() === openedUser._id.toString()){
                lastMessages.push({
                  openedUserId: openedUser._id,
                  openedUserName: openedUser.name,
                  openedUserLastMessage: populatedUser.messages[i].messageText
                });
                break;
              }
            }
          });
          res.render("messages", {allUsers: allUsers, lastMessages: lastMessages});
        }
      })
    }
  });
});

router.get("/:id", middleware.isLoggedIn, function(req, res){
  User.findById(req.params.id, function(err, user){
    if(err){
      console.log(err);
      res.redirect("back");
    }else {
      var previousMessages = [];
      req.user.messages.forEach(function(message){
        if(message.messagesTo.id.toString() === req.params.id.toString()){
          previousMessages.push(message);
        }
      });
      res.render("chatMessages", {messageUser: user, previousMessages: previousMessages});
    }
  });
});

module.exports = router;
