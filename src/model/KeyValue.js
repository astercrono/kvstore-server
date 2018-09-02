const keyValueDelimeter = "$__$";

class KeyValue {
	constructor(key, value, signature) {
		this.key = key;
		this.value = value;
		this.signature = signature;
	}

	encode() {
		return this.key + keyValueDelimeter + this.value;
	}

	static decode(encodedString) {
		const index = encodedString.indexOf(keyValueDelimeter);
		const key = encodedString.substring(0, index);
		const value = encodedString.substring(index + 1, encodedString.length);
		return new KeyValue(key, value);
	}
}

module.exports = exports = KeyValue;