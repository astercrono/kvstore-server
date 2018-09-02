const ExtendableError = require("./ExtendableError");

class KeyLengthTooLargeError extends ExtendableError {
	constructor(key, length, error) {
		super("Key too large. Key=" + key, _+ ", Length=" + length, error);
	}
};

module.exports = exports = KeyLengthTooLargeError;