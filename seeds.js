var mongoose = require("mongoose");
var campground = require("./models/campgrounds");
var commentsModel = require("./models/comments");

var data = [
    {
        name: "Cloudy Trap",
        image: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=76a6fe71178051755a01c265ede2f17b&auto=format&fit=crop&w=500&q=60",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Laky lake",
        image: "https://images.unsplash.com/photo-1491439176760-28b4d8675a59?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=82c8bccdd63f23165aa1ba5ff3e7bb23&auto=format&fit=crop&w=750&q=80",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Beautify you",
        image: "https://images.unsplash.com/photo-1479741044197-d28c298f8c77?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=00a8cfc7aba62bd47f10abd96551cb1d&auto=format&fit=crop&w=750&q=80",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    ]

function seed() {
    campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        // else {
        //     data.forEach(function (camp) {
        //         campground.create(camp, function (err, newCamp) {
        //             if (err) {
        //                 console.log(err);
        //             }
        //             else {
        //                 commentsModel.create({
        //                     comment: "This is nice at least no mosquito but i wish i could have access to the internet here",
        //                     author: "John carn"
        //                 }, function (err, comment) {
        //                     if (err) {
        //                         console.log(err);
        //                     }
        //                     else {
        //                         newCamp.comments.push(comment);
        //                         newCamp.save();
        //                     }
        //                 });
        //             }
        //         })
            // });
        // }
        
    });

}

module.exports = seed;
