const path = require("path");
const loader = require("./ConfigLoader");
const KeyOptions = require("../crypt/KeyOptions");

const configPath = path.join(__dirname, "/../../config.json");
const encryptionKeyLength = 16;
const encryptionKeyIterations = 1000000;
const encryptionIVLength = 16;
const encryptionIVIterations = 500000;
const signingKeyLength = 32;
const signingKeyIterations = 1000000;
const apiKeyLength = 32;
const apiKeyIterations = 1000000;
const aesMode = "aes-128-ctr";

class Config {
	constructor() {
		this.configModel = undefined;
		this.name = undefined;
	}

	encryptionKeyLength() {
		return encryptionKeyLength;
	}

	encryptionIVLength() {
		return encryptionIVLength;
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
		return encryptionKeyIterations;
	}

	encryptionIVIterations() {
		return encryptionIVIterations;
	}

	signingKeyIterations() {
		return signingKeyIterations;
	}

	apiKeyIterations() {
		return apiKeyIterations;
	}

	aesMode() {
		return aesMode;
	}

	encryptionKeyOptions() {
		const options = new KeyOptions("encryption");
		options.iterations = this.encryptionKeyIterations();
		options.keyLength = this.encryptionKeyLength();
		options.algorithm = "sha256";
		options.saltLength = 8;
		options.passwordLength = 8;
		return options;
	}

	encryptionIVOptions() {
		const options = new KeyOptions("encryptionIV");
		options.iterations = this.encryptionIVIterations();
		options.keyLength = this.encryptionIVLength();
		options.algorithm = "sha256";
		options.saltLength = 8;
		options.passwordLength = 8;
		return options;
	}

	signingKeyOptions() {
		const options = new KeyOptions("signing");
		options.iterations = this.signingKeyIterations();
		options.keyLength = this.signingKeyLength();
		options.algorithm = "sha256";
		options.saltLength = 16;
		options.passwordLength = 16;
		return options;
	}

	apiKeyOptions() {
		const options = new KeyOptions("api");
		options.iterations = this.apiKeyIterations();
		options.keyLength = this.apiKeyLength();
		options.algorithm = "sha256";
		options.saltLength = 16;
		options.passwordLength = 16;
		return options;
	}
}

module.exports = exports = new Config();