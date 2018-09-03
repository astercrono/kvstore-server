const ivKeyDelimiter = "$__$";

class IVCipher {
	constructor(cipherText, iv) {
		this.cipherText = cipherText;
		this.iv = iv;
	}

	encode() {
		return this.iv + ivKeyDelimiter + this.cipherText;
	}

	static decode(encodedString) {
		const index = encodedString.indexOf(ivKeyDelimiter);
		const iv = encodedString.substring(0, index);
		const cipherText = encodedString.substring(index + 4, encodedString.length);
		return new IVCipher(cipherText, iv);
	}
}

module.exports = exports = IVCipher;