function EncryptionError(cause) {
	this.name = "EncryptionError";
	this.message = "Error encrypting.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
}
EncryptionError.prototype = Object.create(Error); 

module.exports = exports = EncryptionError;