var express = require("express");
var router = express.Router();
var camp = require("../models/campgrounds");

var multer = require('multer');
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter })

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'rahulkk',
    // api_key: process.env.API_KEY,
    api_key: 146131788677666,
    // api_secret: process.env.API_SECRET
    api_key: "tfVZFTZWYfOcxLRp9Wc_ueO15nE"
});

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

router.post("/campgrounds", isLoggedIn, upload.single('image'), function (req, res) {
    cloudinary.uploader.upload(req.file.path, function (result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.campground.image = result.secure_url;
        // add author to campground
        req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        }
        camp.create(req.body.campground, function (err, campground) {
            if (err) {
                req.flash('error', "Wrong Actions");
                return res.redirect('back');
            }
            res.redirect('/campgrounds/' + campground.id);
        });
    });
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
