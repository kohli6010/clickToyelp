var express = require("express");
var router = express.Router();
var user = require("../models/user");
var passport = require("passport");

//===================================================//
//auth routes//
//===================================================//

router.get("/signup", function (req, res) {
    res.render("register", { page: 'register' });
})

router.post("/signup", function (req, res) {
    user.register(new user({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/signup");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//======================================//
//show log in form //
//======================================//

router.get("/login", function (req, res) {
    res.render("login", { page: 'login' });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {});

//======================================//
//logout route//
//======================================//

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "logged you out")
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
