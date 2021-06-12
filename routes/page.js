const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  const { user, followerCount, followingCount, followerIdList } = res.locals;
  user = null;
  followerCount = 0;
  followingCount = 0;
  followerIdList = [];
  next();
});

router.get('/profile', (req, res) => {
  res.json({
    title: '내 정보 - NodeBird',
  });
});

router.get('/join', (req, res) => {
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
