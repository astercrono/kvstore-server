const ExtendableError = require("./ExtendableError");

class KeyStoreInitError extends ExtendableError {
	constructor(error) {
		super("Error initializing Key Store.", error);
	}
}

module.exports = exports = KeyStoreInitError;