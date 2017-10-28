function DecryptionError(cause) {
	this.name = "DecryptionError";
	this.message = "Error decrypting.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
}
DecryptionError.prototype = Object.create(Error); 

module.exports = exports = DecryptionError;