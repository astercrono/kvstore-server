function KeysFormatError(cause) {
	this.name = "KeysFormatError";
	this.message = "Invalid Key Store format.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
}
KeysFormatError.prototype = Object.create(Error);

module.exports = exports = KeysFormatError;