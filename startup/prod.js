const helmet = require("helmet");
const compression = require("compression");

module.exports = function(app) {
	// Protects common HTML security vulnerabilities
	app.use(helmet());

	// Compresses
	app.use(compression());
};