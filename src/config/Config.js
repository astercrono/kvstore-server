const path = require("path");
const loader = require("./ConfigLoader");
const KeyOptions = require("../crypt/KeyOptions");

const configPath = path.join(__dirname, "/../../config.json");
const encryptionKeyLength = 16;
const signingKeyLength = 32;
const apiKeyLength = 32;

class Config {
	constructor() {
		this.configModel = undefined;
		this.name = undefined;
	}

	encryptionKeyLength() {
		return encryptionKeyLength;
	}

	signingKeyLength() {
		return signingKeyLength;
	}

	apiKeyLength() {
		return apiKeyLength;
	}

	load(profileName) {
		this.configModel = loader.load(configPath, profileName);
		this.name = profileName;
	}

	databasePath() {
		return this.configModel.databasePath;
	}

	secretPath() {
		return this.configModel.secretPath;
	}

	encryptionKeyIterations() {
		return this.configModel.encryptionKeyIterations;
	}

	signingKeyIterations() {
		return this.configModel.signingKeyIterations;
	}

	apiKeyIterations() {
		return this.configModel.apiKeyIterations;
	}

	aesMode() {
		return this.configModel.aesMode;
	}

	encryptionKeyOptions() {
		const options = new KeyOptions();
		options.iterations = this.configModel.encryptionKeyIterations;
		options.keyLength = this.encryptionKeyLength();
		options.algorithm = "sha256";
		options.saltLength = 8;
		options.passwordLength = 8;
		return options;
	}

	signingKeyOptions() {
		const options = new KeyOptions();
		options.iterations = this.configModel.signingKeyIterations;
		options.keyLength = this.signingKeyLength();
		options.algorithm = "sha256";
		options.saltLength = 16;
		options.passwordLength = 16;
		return options;
	}

	apiKeyOptions() {
		const options = new KeyOptions();
		options.iterations = this.configModel.apiKeyIterations;
		options.keyLength = this.apiKeyLength();
		options.algorithm = "sha256";
		options.saltLength = 16;
		options.passwordLength = 16;
		return options;
	}
}

module.exports = exports = new Config();