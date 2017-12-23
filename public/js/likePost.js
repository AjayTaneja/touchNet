function likePost(postId){
  $.get("/post/" + postId + "/like", function(responseData){

    if(responseData.status === "liked"){

      $("#" + postId).addClass("btn-primary").html('<i class="fa fa-thumbs-up" aria-hidden="true"></i> Liked');
      $("#likesNumber" + postId).html('<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> ' + responseData.likesCount + " likes");

    }else if(responseData.status === "unliked"){

      $("#" + postId).removeClass("btn-primary").html('<i class="fa fa-thumbs-up" aria-hidden="true"></i> Like');
      $("#likesNumber" + postId).html('<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> ' + responseData.likesCount + " likes");

    }
  });
}
