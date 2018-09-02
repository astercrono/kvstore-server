const Initializer = require("../Initializer");

module.exports = exports = {
	initialize: () => {
		return (done) => {
			Initializer.run("test", done);
		};
	}
};
