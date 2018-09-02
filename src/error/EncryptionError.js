const ExtendableError = require("../error/ExtendableError");

class EncryptionError extends ExtendableError {
	constructor(key) {
		super("Error encrypting value for key=" + key);
	}
}

module.exports = exports = EncryptionError;