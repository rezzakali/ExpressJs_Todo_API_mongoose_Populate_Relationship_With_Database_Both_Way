const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_CODE);
    const { username, userId } = decodedToken;
    req.username = username;
    req.userId = userId;
    next();
  } catch (error) {
    next('Authentication Failed!');
  }
};

module.exports = checkLogin;
