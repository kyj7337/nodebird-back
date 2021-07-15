const express = require('express');
const { isLoggedin, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get('/profile', isLoggedin, (req, res) => {
  res.json({
    title: '내 정보 - NodeBird',
  });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.json({ title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
  const twits = [];
  res.json({
    title: 'NodeBird',
    twits,
  });
});

module.exports = router;
