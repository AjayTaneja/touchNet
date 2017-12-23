var middleware = {};

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/");
}

middleware.isLoggedInIndex = function(req, res, next){
    if(req.isAuthenticated()){
      res.redirect("/home");
    }else {
      next();
    }
}

module.exports = middleware;
