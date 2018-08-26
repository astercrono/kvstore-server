const Config = require("../config/Config");

const crypto = require("crypto");

const IVCipher = require("./IVCipher");
const KeyStore = require("./KeyStore");
const KeyGenerator = require("./KeyGenerator");
const KVSigner = require("./KVSigner");

let instance = undefined;

class KVCrypt {
	constructor() {
		this.ivGenerator = new KeyGenerator(Config.encryptionIVOptions());

		const signingKey = KeyStore.get("signing");
		const signingOptions = Config.signingKeyOptions();
		this.signer = new KVSigner(signingKey, signingOptions);
	}

	encrypt(plaintext, callback) {
		const encryptionKey = KeyStore.getBuffer("encryption");

		this._generateIV((err, iv) => {
			if (err) {
				callback(err);
				return;
			}

			const ivBuffer = Buffer.from(iv, "hex");
			const cipher = crypto.createCipheriv(Config.aesMode(), encryptionKey, ivBuffer);

			let cipherText = cipher.update(plaintext, "utf8", "hex");
			cipherText += cipher.final("hex");

			callback(undefined, new IVCipher(cipherText, iv));
		});
	}

	decrypt(ivCipher, callback) {
		const encryptionKey = KeyStore.getBuffer("encryption");

		const ivBuffer = Buffer.from(ivCipher.iv, "hex");
		const decipher = crypto.createDecipheriv(Config.aesMode(), encryptionKey, ivBuffer);

		let plaintext = decipher.update(ivCipher.cipherText, "hex", "utf8");
		plaintext += decipher.final("utf8");

		callback(undefined, plaintext);
	}

	signKeyValue(encryptedKeyValue) {
		return this.signer.sign(encryptedKeyValue);
	}

	confirmSignature(actual, expected) {
		return this.signer.confirm(actual, expected);
	}

	confirmApiKey(actualKey) {
		return actualKey && actualKey === KeyStore.get("api");
	}

	_generateIV(callback) {
		return this.ivGenerator.generate(callback);
	}
}

function getInstance() {
	if (!instance) {
		instance = new KVCrypt();
	}
	return instance;
}

module.exports = exports = getInstance;