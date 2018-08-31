const ExtendableError = require("./ExtendableError");

class ComponentAlreadyExistsError extends ExtendableError {
	constructor(name) {
		super("Error creating component. A component with the name " + name + " already exists.");
	}
};
module.exports = exports = ComponentAlreadyExistsError;