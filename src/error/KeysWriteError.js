const ExtendableError = require("./ExtendableError");

class KeysWriteError extends ExtendableError {
	constructor(error) {
		super("Unable to write to Key Store.", error);
	}
};

module.exports = exports = KeysWriteError;