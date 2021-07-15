const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(
    new kakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao Profile:', profile);

        console.log('카카오?');
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'kakao' },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: '',
              nick: '',
              snsId: '',
              provider: 'kakao',
            });
            done(null, newUser);
          }
        } catch (err) {
          console.log(err);
          done(err);
        }
      }
    )
  );
};
