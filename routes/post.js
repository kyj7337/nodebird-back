const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Post, Hashtag } = require('../models');
const { isLoggedin } = require('./middlewares');

const router = express.Router();

// try {
//   fs.readFileSync('uploads');
// } catch (err) {
//   console.log('뭣;비ㅏㄹ', err);
//   fs.mkdirSync('uploads');
// }

const { diskStorage } = multer;
const upload = multer({
  storage: diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', upload.single('img'), (req, res) => {
  console.log(req);
  for (let i = 0; i < req.body.files.length; i++) {
    console.log(req.body.files[0]);
  }
  // console.log(req.file, req.body);
  res.json('ㅠㅠㅠ');
  // res.json({ url: `/img/${file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedin, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
