function showLikers(){
  $.get("/post/" + postId + "/likes", function(responseData){
    if(responseData.status === "success"){
      if(responseData.likersArray.length === 0){
        $("#likedBy").html('Be the first to like this!');
      }else {
        $("#likedBy").html('Liked by <a href="/user/' + responseData.likersArray[0].id + '/view">' + responseData.likersArray[0].name + '</a>');
        for (var i = 1; i < responseData.likersArray.length; i++) {
          $("#likedBy").html($("#likedBy").html() + ', <a href="/user/' + responseData.likersArray[i].id + '/view">' + responseData.likersArray[i].name + '</a>');
        }
      }
      $("#likesNumber").html('<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> ' + responseData.likersArray.length + ' likes');
    }
  });
}
showLikers();

function likePost(postId){
  $.get("/post/" + postId + "/like", function(responseData){
    if(responseData.status === "liked"){
      $("#" + postId).addClass("btn-primary").html('<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> Liked');
    }else if(responseData.status === "unliked"){
      $("#" + postId).removeClass("btn-primary").html('<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> Like');
    }
    showLikers();
  });
}
