const Config = require("../config/Config");

const crypto = require("crypto");

const IVCipher = require("./IVCipher");
const KeyStore = require("./KeyStore");
const KeyGenerator = require("./KeyGenerator");

const encryptionIVOptions = Config.encryptionIVOptions();
const ivGenerator = new KeyGenerator(encryptionIVOptions);
let instance = undefined;

class KVCrypt {
	encrypt(plaintext, callback) {
		const encryptionKey = KeyStore.getBuffer("encryption");

		ivGenerator.generate((err, iv) => {
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
}

function getInstance() {
	if (!instance) {
		instance = new KVCrypt();
	}
	return instance;
}

module.exports = exports = getInstance;