function KeysUninitializedError(cause) {
	this.name = "KeysUninitializedError";
	this.message = "Keys not nitialized.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
}
KeysUninitializedError.prototype = Object.create(Error);

module.exports = exports = KeysUninitializedError;