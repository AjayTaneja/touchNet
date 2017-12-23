var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    multer         = require("multer"),
    User           = require("./models/user"),
    Post           = require("./models/post"),
    Comment        = require("./models/comment"),
    Message        = require("./models/message"),
    http           = require("http"),
    socketIO       = require("socket.io");

// requiring routes
var indexRoutes   = require("./routes/indexRoutes"),
    userRoutes    = require("./routes/userRoutes"),
    postRoutes    = require("./routes/postRoutes"),
    commentRoutes = require("./routes/commentRoutes"),
    messageRoutes = require("./routes/messageRoutes");

var port = process.env.PORT || "4444";
app.set("port", port);
var server = http.createServer(app);
require("./chat")(server);

mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost/touchnet");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "touchNet is a social networking website based on MEN stack!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");

   res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
   res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
   res.setHeader("Expires", "0"); // Proxies.

   next();
});

app.use("/", indexRoutes);
app.use("/user/:id", userRoutes);
app.use("/post", postRoutes);
app.use("/post/:postId/comment", commentRoutes);
app.use("/messages", messageRoutes);

server.listen(app.get("port"), function(){
  console.log("Server started on port " + app.get("port"));
});
