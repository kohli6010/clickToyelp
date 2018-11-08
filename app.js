var express = require("express");
var app = express();
var parser = require("body-parser");
require("dotenv").config();
require("/.env");
var mongoose = require("mongoose");
var db = process.env.DATABASEURL || 'mongodb://localhost/yelpcamp';
mongoose.connect(db, { useNewUrlParser: true });
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var user = require("./models/user");
var seed = require("./seeds");
var camp = require("./models/campgrounds");
var comments = require("./models/comments");
var campground = require("./routes/campgrounds");
var comment = require("./routes/comments");
var auth = require("./routes/auth");
console.log(process.env.DATABASEURL);
app.use(express.static(__dirname + "/public"));
// seed();

//===========================================//
//passport configuration
//===========================================//

app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "This is the college project",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//============================================//
//other requirements//
//============================================//

app.use(parser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("landing");
});

app.use(campground);
app.use(comment);
app.use(auth);

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("server has started");
});
