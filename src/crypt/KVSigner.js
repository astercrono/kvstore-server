const crypto = require("crypto");

class KVSigner {
	constructor(signingKey, options) {
		this.signingKey= signingKey;
		this.options = options;
	}

	sign(encryptedKeyValue) {
		const hmac = crypto.createHmac(this.options.algorithm, this.signingKey);
		hmac.update(encryptedKeyValue.encode());
		return hmac.digest("hex");
	}

	confirm(actualEncryptedKeyValue, expectedEncryptedKeyValue) {
		if (!actualEncryptedKeyValue || !expectedEncryptedKeyValue) {
			return false;
		}

		const expectedSignature = this.sign(expectedEncryptedKeyValue);
		if (!expectedSignature) {
			return false;
		}
		const actualSignature = this.sign(actualEncryptedKeyValue);
		if (!actualSignature) {
			return false;
		}

		return actualSignature === expectedSignature;
	}
}

module.exports = exports = KVSigner;