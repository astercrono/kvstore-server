const path = require("path");
const loader = require("./ConfigLoader");
const KeyOptions = require("../crypt/KeyOptions");

const configPath = path.join(__dirname, "/../../config.json");

let configModel = undefined;
let name = undefined;

module.exports = exports = {
	load: (profileName) => {
		configModel = loader.load(configPath, profileName);
		name = profileName;
	},

	name: () => {
		return name;
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

	signingKeyIterations: () => {
		return configModel.signingKeyIterations;
	},

	apiKeyIterations: () => {
		return configModel.apiKeyIterations;
	},

	aesMode: () => {
		return configModel.aesMode;
	},

	encryptionKeyOptions: () => {
		const options = KeyOptions();
		options.iterations = configModel.encryptionKeyIterations;
		options.keyLength = 16;
		options.algorithm = "sha256";
		options.saltLength = 8;
		options.passwordLength = 8;
		return options;
	},

	signingKeyOptions: () => {
		const options = KeyOptions();
		options.iterations = configModel.signingKeyIterations;
		options.keyLength = 32;
		options.algorithm = "sha256";
		options.saltLength = 16;
		options.passwordLength = 16;
		return options;
	},

	apiKeyOptions: () => {
		const options = KeyOptions();
		options.iterations = configModel.apiKeyIterations;
		options.keyLength = 32;
		options.algorithm = "sha256";
		options.saltLength = 16;
		options.passwordLength = 16;
		return options;
	}
};

