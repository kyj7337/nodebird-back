exports.isLoggedin = (req, res, next) => {
  if (req.isAuthenticated()) {
    // 로그인 되어 있음.
    next(); // 로그인 되어 있다면 다음으로 진행해라.
  } else {
    res.status(401).send('you need Login');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // 로그인 되어 있지 않음.
    next();
  } else {
    const message = encodeURIComponent('you already LoggedIn');
    res.status(403).json(message);
  }
};
