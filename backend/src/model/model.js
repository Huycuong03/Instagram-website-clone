const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username!"],
      },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
    },
    profile_image: { type: String },
    follower_user_id: [{type: mongoose.Schema.Types.ObjectId}],
    following_user_id: [{type: mongoose.Schema.Types.ObjectId}],
});

const commentSchema = new mongoose.Schema({
    comment: {type: String},
    date_time: { type: Date, default: Date.now },
    user_id: {type: mongoose.Schema.Types.ObjectId},
  });
  
  const postSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: [true, "Please provide a username!"],
    },
    date_time: { type: Date, default: Date.now },
    caption: { type: String },
    images: [{ type: String }],
    like_user_id: [{type: mongoose.Schema.Types.ObjectId}],
    comments: [commentSchema],
  });

module.exports = {
    user: mongoose.model("user", userSchema),
    post: mongoose.model("post", postSchema),
}