require("dotenv").config();

function TokenVerify(req, res, next){
    const token = req.headers["authorization"];
    if (token){
        require("jsonwebtoken").verify(token, process.env.SECRET, async (error, decoded) => {
            if (error){
                res.status(403).send("invalid token");
                console.error(error);
            }else{
                const model = require("../model/model");
                req.user = await model.user.findById(decoded._id);
                next();
            }
        })
    } else{
        res.status(401).send("Unauthorized");
    }
}
module.exports = TokenVerify;