const ExtendableError = require("../error/ExtendableError");

class DecryptionError extends ExtendableError {
	constructor(key) {
		super("Error decrypting value for key=" + key);
	}
}

module.exports = exports = DecryptionError;