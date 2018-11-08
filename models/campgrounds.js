var mongoose = require("mongoose");
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageId: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});

module.exports = mongoose.model("campground", campSchema);
