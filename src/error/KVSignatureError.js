const ExtendableError = require("./ExtendableError");

class KVSignatureError extends ExtendableError {
	constructor(key, error) {
		super("Error confirming signature of value for key=" + key, error);
	}
};

module.exports = exports = KVSignatureError;

