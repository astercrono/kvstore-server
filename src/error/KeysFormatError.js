const ExtendableError = require("./ExtendableError");

class KeysFormatError extends ExtendableError {
	constructor(error) {
		super("Invalid Key Store format.", error);
	}
}

module.exports = exports = KeysFormatError;