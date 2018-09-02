const ExtendableError = require("./ExtendableError");

class KeysReadError extends ExtendableError {
	constructor(error) {
		super("Unable to read Key Store", error);
	}
};

module.exports = exports = KeysReadError;