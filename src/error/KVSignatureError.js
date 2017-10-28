function KVSignatureError(cause) {
	this.name = "KVSignatureError";
	this.message = "Error confirming signature of key-value.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
}
KVSignatureError.prototype = Object.create(Error); 

module.exports = exports = KVSignatureError;