var express    = require("express"),
    router     = express.Router(),
    User       = require("../models/user"),
    Post       = require("../models/post"),
    passport   = require("passport"),
    middleware = require("../middleware");

router.get("/", middleware.isLoggedInIndex, function(req, res){
  res.render("index");
});

router.post("/touchup", function(req, res){
  var newUser = new User({
    name: req.body.name,
    profilePicture: "public/tmp/imageUploads/defaultPic",
    username: req.body.username,
    unreadMessages: 0
  });
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      return res.redirect("/");
    }
    passport.authenticate("local")(req, res, function(){
     req.flash("success", "Welcome to touchNet " + user.name);
     res.redirect("/user/" + user._id);
    });
  });
});

router.post("/touchin", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
  failureFlash: "Invalid username or password"
}), function(req, res){});

router.get("/touchin", middleware.isLoggedInIndex, function(req, res){
  res.redirect("/");
});

router.get("/touchout", middleware.isLoggedIn, function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/");
});

router.get("/home", middleware.isLoggedIn, function(req, res){
  Post.find({}, function(err, allPosts){
    if(err){
      console.log(err);
    }else {
      res.render("home", {allPosts: allPosts});
    }
  });
});

module.exports = router;
