// Default middleware initialized at startup

const express = require("express");
const winston = require("winston");
const passport = require("passport");
const helmet = require("helmet");

// Body parser
const bodyParser = require("body-parser");

// Debuggers
const startupDebugger = require("debug")("app:startup");

module.exports = function(app) {
  // Body Parser Middleware
  app.use(bodyParser.json({ limit: "500mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "500mb",
      extended: true,
      parameterLimit: 5000000
    })
  );

  // for SSL
//   app.use(express.static(__dirname, { dotfiles: "allow" }));

  // HTTP Protection
  app.use(helmet());

  // Passport auth middleware & config
  app.use(passport.initialize());
  require("../config/passport")(passport);

  // Development Middleware
  if (app.get("env") === "development") {
    const morgan = require("morgan");
    // Logs API requests
    app.use(morgan("tiny"));
    // startupDebugger("Morgan enabled... Requests will be logged.");
    winston.info("Morgan enabled... Requests will be logged.");
  }
};