var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
   postContent: String,
   path: String,
   dateCreated: {type: Date, default: Date.now},
   username: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      name: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   likes: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User"
     }
   ]
});

module.exports = mongoose.model("Post", postSchema);
