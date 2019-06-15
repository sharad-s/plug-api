const jwt = require('jsonwebtoken');
const config = require('config');
const isEmpty = require('../utils/isEmpty')

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  console.log("TOKEN", token, isEmpty(token))

  if (isEmpty(token)) {
    console.log("NO TOKEN", token)
    req.user = {_id: null};
    return next()
  }
  

  try {
    // Get Decoded token and set req.user as decoded token. 
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded; 
    next();
  }
  catch (ex) {
    // console.log(ex);
    res.status(400).send('Invalid token.');
  }
}