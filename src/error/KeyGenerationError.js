function KeyGenerationError(cause) {
	this.name = "KeyGenerationError";
	this.message = "Error generating key.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
};
KeyGenerationError.prototype = Object.create(Error);

module.exports = exports = KeyGenerationError;