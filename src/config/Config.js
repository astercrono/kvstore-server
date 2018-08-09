const path = require("path");
const loader = require("./ConfigLoader");
const KeyOptions = require("../crypt/KeyOptions");

const configPath = path.join(__dirname, "/../../config.json");

let configModel = undefined;
let name = undefined;

const encryptionKeyLength = 16;
const signingKeyLength = 32;
const apiKeyLength = 32;

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

	encryptionKeyLength: () => {
		return encryptionKeyLength;
	},

	signingKeyLength: () => {
		return signingKeyLength;
	},

	apiKeyLength: () => {
		return apiKeyLength;
	},

	encryptionKeyOptions: () => {
		const options = KeyOptions();
		options.iterations = configModel.encryptionKeyIterations;
		options.keyLength = encryptionKeyLength;
		options.algorithm = "sha256";
		options.saltLength = 8;
		options.passwordLength = 8;
		return options;
	},

	signingKeyOptions: () => {
		const options = KeyOptions();
		options.iterations = configModel.signingKeyIterations;
		options.keyLength = signingKeyLength;
		options.algorithm = "sha256";
		options.saltLength = 16;
		options.passwordLength = 16;
		return options;
	},

	apiKeyOptions: () => {
		const options = KeyOptions();
		options.iterations = configModel.apiKeyIterations;
		options.keyLength = apiKeyLength;
		options.algorithm = "sha256";
		options.saltLength = 16;
		options.passwordLength = 16;
		return options;
	}
};

