const ExtendableError = require("../error/ExtendableError");

class DecryptionError extends ExtendableError {
	constructor(key, error) {
		super("Error decrypting value for key=" + key, error);
	}
}

module.exports = exports = DecryptionError;