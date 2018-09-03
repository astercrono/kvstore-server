const ExtendableError = require("./ExtendableError");

class ComponentDestroyError extends ExtendableError {
	constructor(error) {
		super("Error destroying component.", error);
	}
}

module.exports = exports = ComponentDestroyError;