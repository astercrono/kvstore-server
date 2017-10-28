function KeysInitializedError(cause) {
	this.name = "KeysInitializedError";
	this.message = "Keys already initialized.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
}
KeysInitializedError.prototype = Object.create(Error); 

module.exports = exports = KeysInitializedError;