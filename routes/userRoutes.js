var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    User       = require("../models/user"),
    Post       = require("../models/post"),
    upload     = require("../config/multer"),
    middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
  if(req.params.id.toString() !== req.user._id.toString()){
    return res.redirect("/user/" + req.params.id + "/view");
  }else {
    Post.find({username: req.user.username}, function(err, allPosts){
      if(err){
        console.log(err);
      }else {
        res.render("profile", {profileUser: {id: req.params.id, name: req.user.name, profilePicture: req.user.profilePicture}, allPosts: allPosts});
      }
    });
  }
});

router.get("/view", middleware.isLoggedIn, function(req, res){
  if(req.params.id.toString() === req.user._id.toString()){
    res.redirect("/user/" + req.params.id);
  }else {
    User.findById(req.params.id, function(err, user){
      if(err){
        res.send(err);
      }else {
        Post.find({username: user.username}, function(err, allPosts){
          if(err){
            console.log(err);
          }else {
            res.render("profile", {profileUser: {id: user._id, name: user.name, profilePicture: user.profilePicture}, allPosts: allPosts});
          }
        });
      }
    });
  }
});

router.get("/edit/profile/picture", middleware.isLoggedIn, function(req, res){
  res.render("editProfilePicture");
});

router.put("/edit/profile/picture", middleware.isLoggedIn, function(req, res){
  upload(req,res,function(err) {
    if(err) {
        return res.send("Error uploading file.");
    }
    if(req.file == undefined){
      req.flash("error", "First select image to upload");
      return res.redirect("back");
    }
    var profilePicture;
    if(req.file){
      profilePicture = req.file.path;
    }else {
      profilePicture = req.user.profilePicture;
    }
    User.findByIdAndUpdate(req.params.id, {profilePicture: profilePicture}, function(err, user){
    	if(err){
		    console.log(err);
        req.flash("error", "Error in uploading picture");
		  }else {
        req.flash("success", "Picture updated successfully");
        res.redirect("/user/" + req.params.id);
		  }
    });
  });
});

module.exports = router;
