require('dotenv').config() 

module.exports = function() {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  };
  if (!process.env.SOUNDCLOUD_CLIENT_KEY) {
    throw new Error('FATAL ERROR: SOUNDCLOUD_CLIENT_KEY is not defined.');
  }
  if (!process.env.DATABASE_STRING) {
    throw new Error('FATAL ERROR: DATABASE_STRING is not defined.');
  }
}