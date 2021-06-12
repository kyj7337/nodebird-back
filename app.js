const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const { sequelize, User } = require('./models');
const indexRouter = require('./routes');
dotenv.config();

const pageRouter = require('./routes/page'); // 폴더 만들지 않음.
const app = express();
const { PORT, COOKIE_SECRET, NODE_ENV } = process.env;
app.set('port', PORT);
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
sequelize
  .sync({ force: false })
  .then((res) => {
    console.log('DB연결성공');
  })
  .catch(() => {});
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use('/g1', indexRouter);

app.use((req, res, next) => {
  const { method, url } = req;
  const error = new Error(`${method} ${url} 라우터는 없어요~`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const { message, error } = res.locals;
  res.end('ready');
  //   message = err.message;

  //   error = NODE_ENV !== 'production' ? err : {};
  //   res.status(err.status || 500);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
