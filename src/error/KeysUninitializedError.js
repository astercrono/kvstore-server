const ExtendableError = require("./ExtendableError");

class KeysUninitializedError extends ExtendableError {
	constructor(error) {
		super("Keys not initialized.", error);
	}
}

module.exports = exports = KeysUninitializedError;