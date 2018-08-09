function KeyLengthTooLargeError(cause) {
	this.name = "KeyGenerationError";
	this.message = "The requested key length is too large.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
};
KeyLengthTooLargeError.prototype = Object.create(Error);

module.exports = exports = KeyLengthTooLargeError;