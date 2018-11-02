var express = require("express");
var router = express.Router();
var camp = require("../models/campgrounds");
var comments = require("../models/comments");
//=============================================================//
//comments route//
//============================================================//

router.get("/campgrounds/:id/comment/new", isLoggedIn, function (req, res) {
  camp.findById(req.params.id, function (err, selectedCamp) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/new", { campground: selectedCamp });
    }
  })
});

router.post("/campgrounds/:id/comment", isLoggedIn, function (req, res) {
  camp.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    }
    else {
      comments.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        }
        else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
        }
      });
    }
    res.redirect("/campgrounds/" + campground._id);
  });
});

router.get("/campgrounds/:id/comment/:comment_id/edit", checkCommentownerShip, function (req, res) {
  camp.findById(req.params.id, function (err, foundCamp) {
    if (err || !foundCamp) {
      req.flash("error", "no campground found")
      return res.redirect("back");
    }
  })
  comments.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      console.log(err);
    }
    else {
      res.render('comments/edit', { campgrounds_id: req.params.id, comment: foundComment });
    }
  });
});

router.put("/campgrounds/:id/comment/:comment_id", checkCommentownerShip, function (req, res) {
  comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, comment) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

router.delete("/campgrounds/:id/comment/:comment_id", checkCommentownerShip, function (req, res) {
  comments.findByIdAndDelete(req.params.comment_id, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("back");
    }
  })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login first");
  res.redirect("/login");
}

function checkCommentownerShip(req, res, next) {
  if (req.isAuthenticated()) {
    comments.findById(req.params.comment_id, function (err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "comment not found")
        res.redirect("back")
      }
      else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        }
        else {
          res.redirect("back")
        }
      }
    });
  }
  else {
    res.redirect("back");
  }
}

module.exports = router;
