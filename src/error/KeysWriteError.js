function KeysWriteError(cause) {
	this.name = "KeysWriteError";
	this.message = "Unable to read Key Store.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
};
KeysWriteError.prototype = Object.create(Error);

module.exports = exports = KeysWriteError;