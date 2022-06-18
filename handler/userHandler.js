const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema');

const router = express.Router();

// user signup
router.post('/singup', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: 'You have successfully sign up! ' });
  } catch (error) {
    if (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// user login
router.post('/login', async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPassword) {
        // generate token
        const token = await jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.SECRET_CODE,
          {
            expiresIn: '1h',
          }
        );
        res.status(200).json({
          access_token: token,
          message: 'Login successful!',
        });
      } else {
        res.status(401).json({ error: 'Authentication failed!' });
      }
    } else {
      res.status(401).json({ error: 'Authentication failed!' });
    }
  } catch (error) {
    if (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// get all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().populate('todos');
    res.status(200).json({
      data: users,
      message: 'success',
    });
  } catch (error) {
    if (error) {
      res.status(500).json({ error: 'There was a server side error!' });
    }
  }
});

// export the router
module.exports = router;
