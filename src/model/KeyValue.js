const keyValueDelimeter = "$__$";

class KeyValue {
	constructor(key, value) {
		this.key = key;
		this.value = value;
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