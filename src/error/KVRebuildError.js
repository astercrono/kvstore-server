function KVRebuildError(cause) {
	this.name = "KVRebuildError";
	this.message = "Error rebuilding system.";

	if (cause) {
		this.message += "\n" + cause.stack;
	}
}
KVRebuildError.prototype = Object.create(Error); 

module.exports = exports = KVRebuildError;