class ExtendableError extends Error {
	constructor(message, error) {
		super();
		this.message = message;
		this.name = this.constructor.name;

		if (error) {
			this.stack = error.stack;
		}
		else {
			this.stack = new Error().stack;
		}
	}
}
module.exports = exports = ExtendableError;