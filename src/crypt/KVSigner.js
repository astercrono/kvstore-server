const crypto = require("crypto");

class KVSigner {
	constructor(key, options) {
		this.key = key;
		this.options = options;
	}

	sign(value) {
		return this._hmac(value);
	}

	confirm(actual, expected) {
		if (!actual || !expected) {
			return false;
		}

		const signature = this._hmac(actual);
		if (!signature) {
			return false;
		}
		return signature === expected;
	}

	_hmac(value) {
		const hmac = crypto.createHmac(options.algorithm, this.key);
		hmac.update(this.key);
		hmac.update(value);

		return hmac.digest("hex");
	}
}

module.exports = exports = KVSigner;