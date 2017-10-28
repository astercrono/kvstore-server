function KeyStoreInitError(cause) {
	this.name = "KeyStoreInitError";
	this.message = "Error initializing Key Store.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
}
KeyStoreInitError.prototype = Object.create(Error);

module.exports = exports = KeyStoreInitError;