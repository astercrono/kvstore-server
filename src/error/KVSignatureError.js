const ExtendableError = require("./ExtendableError");

class KVSignatureError extends ExtendableError {
	constructor(key) {
		super("Error confirming signature of value for key=" + key);
	}
};

module.exports = exports = KVSignatureError;

