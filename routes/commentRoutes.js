var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Post       = require("../models/post"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");

router.post("/", middleware.isLoggedIn, function(req, res){
  var author = {
    id: req.user._id,
    name: req.user.name
  };
  var newComment = {
    text: req.body.text,
    author: author
  };
  Comment.create(newComment, function(err, newlyCreatedComment){
    if(err){
      console.log(err);
      res.redirect("back");
    }else {
      Post.findById(req.params.postId, function(err, post){
        if(err){
          console.log(err);
          res.redirect("back");
        }else {
          post.comments.push(newlyCreatedComment);
          post.save(function(err, data){
            if(err){
              console.log(err);
              res.redirect("back");
            }else {
              res.redirect("back");
            }
          });
        }
      });
    }
  });
});

module.exports = router;
