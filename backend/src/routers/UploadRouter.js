const router = require("express").Router();
const TokenVerify = require("../lib/TokenVerify");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'F:\\Project Library\\Web\\Framey\\frontend\\public\\images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  
const upload = multer({ storage: storage });

router.post("/image/post", TokenVerify, upload.array("image", 10) ,(req, res) => {
    res.json(req.files);
});

router.post("/image/profile", TokenVerify, upload.single("image") ,(req, res) => {
  res.json(req.file);
});

module.exports = router;