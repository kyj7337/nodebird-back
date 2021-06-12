const express = require('express');
const { User } = require('../models');
const router = express.Router();

router.route('/').get(async (req, res, next) => {
  try {
    console.log('hi');
    const users = await User.findAll({});
    console.log('---', users);
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).end('end');
  }
});

module.exports = router;
