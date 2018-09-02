const ExtendableError = require("./ExtendableError");

class KeysInitializedError extends ExtendableError {
	constructor(error) {
		super("Keys already initialized.", error);
	}
}

module.exports = exports = KeysInitializedError;