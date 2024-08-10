try{
    require("dotenv").config();
    require("mongoose")
        .connect(process.env.DB_URL)
        .then(() => {
            console.log("Successfully connected to MongoDB Atlas!");
        });

    const express = require("express");
    const app = express();
    
    app.use(require("cors")());
    app.use(express.json());
    app.get("/", (req, res) => {res.send("Welcome to Framey.API")});
    app.use("/user", require("./src/routers/UserRouter"));
    app.use("/post", require("./src/routers/PostRouter"));
    app.use("/upload", require("./src/routers/UploadRouter"));

    app.listen(process.env.PORT, console.log(`Listening on ${process.env.PORT}!`));
}catch (error){
    console.log(error);
}