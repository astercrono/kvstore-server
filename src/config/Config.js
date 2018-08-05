const loader = require("./ConfigLoader");

let configModel = undefined;

module.exports = exports = {
	load: (path, profileName) => {
		configModel = loader.load(path, profileName);
	},

	databasePath: () => {
		return configModel.databasePath;
	},

	secretPath: () => {
		return configModel.secretPath;
	},

	encryptionKeyIterations: () => {
		return configModel.encryptionKeyIterations;
	},

	apiKeyIterations: () => {
		return configModel.apiKeyIterations;
	}
};

