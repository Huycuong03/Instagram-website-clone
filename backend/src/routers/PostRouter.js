const model = require("../model/model");
const router = require("express").Router();
const TokenVerify = require("../lib/TokenVerify");

router.get("/", TokenVerify, async (req, res) => {
    try{
        let posts = await model.post.find({user_id: req.user._id}).lean();
        posts = posts.concat(await model.post.find({user_id: {$in: req.user.following_user_id}}).lean());
        posts.sort((postA, postB) => (postB.date_time - postA.date_time));
        for (let i=0; i<posts.length; i++){
            const user = await model.user.findById(posts[i].user_id);
            posts[i].username = user.username;
            posts[i].profile_image = user.profile_image;
        }
        res.send(posts);
    }catch (error) {
        console.error(error);
        res.status(500).send("Please try again");
    }
});

router.post("/:_id", TokenVerify, async (req, res) => {
    try{
        const post = await model.post.findById(req.params._id.replace(":", "")).lean();
        const {like, comment} = req.body;
        if (like) {
            if (post.like_user_id) post.like_user_id = [];
            post.like_user_id.push(req.user._id);
        } else if (like === false) {
            post.like_user_id = post.like_user_id.filter((like_user_id) => (!like_user_id.equals(req.user._id)));
        }

        if (comment) {
            post.comments.push({
                comment: comment,
                user_id: req.user._id,
            });
        }
        await model.post.findByIdAndUpdate(post._id, post);
        res.status(200).send("Update successfully");
    }catch (error) {
        console.error(error);
        res.status(500).send("Please try again");
    }
});

router.get("/:_id", TokenVerify, async (req, res) => {
    try{
        let post = await model.post.findById(req.params._id.replace(":", "")).lean();
        const user = await model.user.findById(post.user_id);
        post.username = user.username;
        post.profile_image = user.profile_image;

        if (post.comments){
            for (let j=0; j<post.comments.length; j++){
                const user = await model.user.findById(post.comments[j].user_id);
                post.comments[j].username = user.username;
                post.comments[j].profile_image = user.profile_image;
            }
        }
        res.send(post);
    }catch (error) {
        console.error(error);
        res.status(500).send("Please try again");
    }
});

router.post("/", TokenVerify, async (req, res) => {
    try {
        const post = new model.post(req.body);
        await post.save();
        res.send("Post successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Please try again");
    }
});

module.exports = router;