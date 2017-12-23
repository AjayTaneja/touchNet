var express    = require("express"),
    router     = express.Router(),
    User       = require("../models/user"),
    Post       = require("../models/post"),
    upload     = require("../config/multer"),
    middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("addPost");
});

router.post("/", middleware.isLoggedIn, function(req, res){
  upload(req,res,function(err) {
    if(err) {
        console.log(err);
        return res.send("Error uploading file.");
    }
    if(req.body.postContent.length === 0 && req.file == undefined){
      req.flash("error", "Enter something into the post");
      return res.redirect("back");
    }
    var picturePath;
    if(req.file){
      picturePath = req.file.path;
    }else {
      picturePath = "textPostdonttryit";
    }
    var author = {
      id: req.user._id,
      name: req.user.name
    }
    var newPost = {
      postContent: req.body.postContent,
      path: picturePath,
      username: req.user.username,
      author: author
    }
    Post.create(newPost, function(err, newlyCreatedPost){
    	if(err){
		    console.log(err);
        req.flash("error", "Error in adding post");
		  }else {
        req.flash("success", "Post added successfully");
        res.redirect("/post/" + newlyCreatedPost._id);
		  }
    });
  });
});

router.put("/:postId", middleware.isLoggedIn, function(req, res){
  upload(req,res,function(err) {
    if(err) {
        return res.send("Error uploading file.");
    }
    Post.findById(req.params.postId, function(err, foundPost){
      if(err){
        console.log(err);
        res.redirect("back");
      }else {
        if(req.body.postContent.length === 0 && req.file == undefined && foundPost.path === "textPostdonttryit"){
          req.flash("error", "Enter something into the post to edit");
          return res.redirect("back");
        }
        foundPost.postContent = req.body.postContent;
        if(req.file){
          foundPost.path = req.file.path;
        }
        foundPost.save(function(err, post){
          if(err){
            console.log(err);
          }else {
            req.flash("success", "Post updated successfully");
            res.redirect("/post/" + post._id);
          }
        });
      }
    });
  });
});

router.get("/:postId", middleware.isLoggedIn, function(req, res){
  Post.findById(req.params.postId).populate("comments").exec(function(err, post){
    if(err){
      console.log(err);
    }else {
      res.render("showPost", {post: post});
    }
  });
});

router.get("/:postId/edit", middleware.isLoggedIn, function(req, res){
  Post.findById(req.params.postId, function(err, post){
    if(err){
      console.log(err);
      req.flash("error", "Post not found");
      res.redirect("/home");
    }else {
      if(post.author.id.equals(req.user._id)){
        return res.render("editPost", {post: post});
      }else {
        req.flash("error", "You don't have permission to do that");
        res.redirect("/home");
      }
    }
  });
});

router.get("/:postId/like", middleware.isLoggedIn, function(req, res){
  User.findById(req.user._id, function(err, foundUser){
    if(err){
      console.log(err);
      return res.json({status: "error"});
    }else {
      Post.findById(req.params.postId, function(err, foundPost){
        if(err){
          console.log(err);
          req.flash("error", "Post not found");
          return res.json({status: "error"});
        }else {
          var responseData;
          var likesArray = foundPost.likes;
          if(likesArray.indexOf(foundUser._id) === -1){
            likesArray.push(foundUser);
            responseData = {status: "liked", likesCount: likesArray.length};
          }else {
            var index = likesArray.indexOf(foundUser._id);
            for (var i = index; i < likesArray.length - 1; i++) {
              likesArray[i] = likesArray[i + 1];
            }
            likesArray.pop();
            responseData = {status: "unliked", likesCount: likesArray.length};
          }
          foundPost.likes = likesArray;

          foundPost.save(function(err, data){
            if(err){
              console.log(err);
              return res.json({status: "error"});
            }else {
              return res.json(responseData);
            }
          });
        }
      });
    }
  })
});

router.get("/:postId/likes", middleware.isLoggedIn, function(req, res){
  Post.findById(req.params.postId).populate("likes").exec(function(err, foundPost){
    if(err){
      console.log(err);
      return res.json({status: "error"});
    }else {
      var likersArray = [];
      foundPost.likes.forEach(function(postLiker){
        var liker = {
          id: postLiker._id,
          name: postLiker.name
        };
        likersArray.push(liker);
      });
      return res.json({status: "success", likersArray: likersArray});
    }
  });
});

module.exports = router;
