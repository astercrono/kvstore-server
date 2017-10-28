function KeysReadError(cause) {
	this.name = "KeysReadError";
	this.message = "Unable to read Key Store.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
};
KeysReadError.prototype = Object.create(Error);

module.exports = exports = KeysReadError;