const ExtendableError = require("./ExtendableError");

class KeyGenerationError extends ExtendableError {
	constructor(name, error) {
		super("Error generating key=" + name, error);
	}
};

module.exports = exports = KeyGenerationError;