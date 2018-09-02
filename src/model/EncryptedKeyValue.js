const KeyValue = require("./KeyValue");
const IVCipher = require("../crypt/IVCipher");

class EncryptedKeyValue extends KeyValue {
	constructor(key, ivCipher, signature) {
		super(key, ivCipher.encode(), signature);
	}

	encode() {
		return super.encode();
	}

	ivCipher() {
		return IVCipher.decode(this.value);
	}

	static decode(encodedString) {
		return KeyValue.decode(encodedString);
	}
}

module.exports = exports = EncryptedKeyValue;