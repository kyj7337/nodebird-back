const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedin, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/sign-in', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  console.log(req.body);
  try {
    const exUser = await User.findOne({
      where: { email },
    });
    if (exUser) {
      // 유저가 있다면?
      return res.status(403).json('existUser');
    }
    const hashedPW = await bcrypt.hash(password, 12);

    await User.create({
      email,
      nick,
      password: hashedPW,
    });
    const selfUser = await User.findOne({ where: { email } });
    console.log(selfUser);
    return res.status(200).json(selfUser);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
    return next(err);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    console.log(authError, user, info);
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(500).json(info);
    }
    return req.login(user, (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.status(200).json(user);
    });
  })(req, res, next); // 미들 웨어 내의 미들웨어에는 (req,res,next)를 붙입니다.
});

router.get('/logout', isLoggedin, (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).json('로그아웃성공');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
