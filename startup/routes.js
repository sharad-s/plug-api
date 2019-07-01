const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

const plugs = require('../routes/plugs');
const snippets = require('../routes/snippets');



module.exports = function(app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  // Plug
  app.use('/api/plugs', plugs);
  app.use('/api/snippets', snippets);


  app.use(error);
}