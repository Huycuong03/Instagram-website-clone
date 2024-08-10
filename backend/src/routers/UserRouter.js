const model = require("../model/model");
const router = require("express").Router();
const TokenVerify = require("../lib/TokenVerify");
require("dotenv").config()

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await model.user.findOne({username: username, password: password}).lean();
        if (user){
            require("jsonwebtoken").sign({_id: user._id}, process.env.SECRET, {expiresIn: "24h"}, (error, token) => {
                if (error){
                    throw error;
                } else {
                    user.token = token;
                    res.send(user);
                }
            });
        }else{
            res.status(404).send("Invalid username or password");
        }
    } catch (error){
        console.error(error);
        res.status(500).send("Something went wrong. Please try again");
    }
});

router.post("/signup", async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await model.user.findOne({username: username});
        if (user){
            res.status(401).send("Invalid username");
        }else{
            const mongoose = require("mongoose");
            const new_id = new mongoose.Types.ObjectId();
            const new_user = {
                _id: new_id,
                username: username,
                password: password,
                following_user_id: [],
                follower_user_id: [],
            }
            res.send(new_user);
            new model.user(new_user).save();
        }
    } catch (error){
        console.error(error);
        res.status(500).send("Please try again");
    }
});

router.get("/search", TokenVerify, async (req, res) => {
    const {username} = req.query;
    if (username){
        const user = await model.user.find({username: {$regex: ".*" + username + ".*"}}).lean();
        if (user) {
            res.send(user);
        } else {
            res.status(404).send("No user found");
        }
    } else {
        res.status(403).send("Invalid query parameter");
    }
});

router.get("/:_id", TokenVerify, async (req, res) => {
    const user = await model.user.findById(req.params._id.replace(":", "")).lean();
    if (user) {
        const posts = await model.post.find({user_id: user._id}).lean();
        res.send({
            ...user,
            following: user.follower_user_id ? user.follower_user_id.some((user_id) => (user_id.equals(req.user._id))) : false,
            posts: posts,
        });
    } else {
        res.status(404).send("No user found");
    }
});

router.post("/:_id", TokenVerify, async (req, res) => {
    try {
        const rootUser = req.user;
        const user = await model.user.findById(req.params._id.replace(":", "")).lean();
        const {following} = req.body;

        if (following) {
            user.follower_user_id.push(rootUser._id);
            rootUser.following_user_id.push(user._id);
        } else if (following === false) {
            user.follower_user_id = user.follower_user_id.filter((user_id) => (!user_id.equals(rootUser._id)));
            rootUser.following_user_id = rootUser.following_user_id.filter((user_id) => (!user_id.equals(user._id)));
        }
        await model.user.findByIdAndUpdate(user._id, user);
        await model.user.findByIdAndUpdate(rootUser._id, rootUser);
        res.status(200).send("Update successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Please try again");
    }
});

router.post("/", TokenVerify, async (req, res) => {
    const user = req.user;
    user.profile_image = req.body.profile_image;
    await model.user.findByIdAndUpdate(user._id, user);
    res.send("Update successfully");
});

module.exports = router;