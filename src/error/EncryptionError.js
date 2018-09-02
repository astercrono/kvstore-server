const ExtendableError = require("../error/ExtendableError");

class EncryptionError extends ExtendableError {
	constructor(key, error) {
		super("Error encrypting value for key=" + key, error);
	}
}

module.exports = exports = EncryptionError;