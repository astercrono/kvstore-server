const config = require("../../config").get();

const crypto = require("crypto");

const signingConfig = config.crypt.signing;

function KVSigner(signingKey) {
	return {
		sign: (key, value) => {
			return hmac(key, value, signingKey);
		},

		confirm: (key, value, expectedSignature) => {
			if (!value) {
				return false;
			}
	
			const signature = hmac(key, value, signingKey);
	
			if (!signature) {
				return false;
			}
	
			return signature === expectedSignature;
		}
	};
}

function hmac(key, value, signingKey) {
	const algorithm = signingConfig.algorithm;

	const hmac = crypto.createHmac(algorithm, signingKey);
	hmac.update(key);
	hmac.update(value);

	return hmac.digest("hex");
}

module.exports = exports = KVSigner;