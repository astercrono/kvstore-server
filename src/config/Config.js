const loader = require("./ConfigLoader");

let configModel = undefined;

module.exports = exports = {
	load: (path, profileName) => {
		configModel = loader.load(path, profileName);
	},

	databasePath: () => {
		return configModel.databasePath;
	},

	encryptionSecretPath: () => {
		return configModel.encryptionSecretPath;
	},

	signingSecretPath: () => {
		return configModel.signingSecretPath;
	}
};

