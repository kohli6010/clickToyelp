var express = require("express");
var router = express.Router();
var camp = require("../models/campgrounds");

//============================================//
//campgrounds usage routes//
//===========================================//
//INDEX - show all campgrounds
router.get("/campgrounds", function (req, res) {
    // Get all campgrounds from DB
    camp.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
        }
    });
});

router.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image_url;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = { name: name, image: image, description: desc, author: author };
    camp.create(newCamp, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds");
        }
    })
});

router.get("/campgrounds/new", isLoggedIn, function (req, res) {

    res.render("campgrounds/new");
});



router.get("/campgrounds/:id", function (req, res) {
    camp.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
        if (err || !foundCamp) {
            req.flash("error", "campground not found");
            res.redirect("back");

        }
        else {
            res.render("campgrounds/show", { campground: foundCamp });
        }
    });
});

router.get("/campgrounds/:id/edit", checkOwnerShip, function (req, res) {
    camp.findById(req.params.id, function (err, campground) {
        res.render("campgrounds/edit", { campground: campground });
    });
});

router.put("/campgrounds/:id", checkOwnerShip, function (req, res) {
    camp.findByIdAndUpdate(req.params.id, req.body.campground, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

router.delete("/campgrounds/:id", checkOwnerShip, function (req, res) {
    camp.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds");
        }
    });
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
}

function checkOwnerShip(req, res, next) {
    if (req.isAuthenticated()) {
        camp.findById(req.params.id, function (err, foundCamp) {
            if (err || !foundCamp) {
                req.flash("error", "nothing found");
                res.redirect("back");
            }
            else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    res.redirect("back");
                }
            }
        })

    }
    else {
        req.flash("error", "you need to be logged in to do that");
        res.redirect("back");
    }
}
module.exports = router;
