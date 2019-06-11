const config = require('config');

module.exports = function() {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  };
  if (!config.get('SOUNDCLOUD_CLIENT_KEY')) {
    throw new Error('FATAL ERROR: SOUNDCLOUD_CLIENT_KEY is not defined.');
  }
}