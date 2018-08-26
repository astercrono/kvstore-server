const ivKeyDelimiter = "$__$";

class IVCipher {
	constructor(cipherText, iv) {
		this.cipherText = cipherText;
		this.iv = iv;
	}

	encode() {
		return this._addIVToCipherText(this.cipherText, this.iv);
	}

	_addIVToCipherText(cipherText, iv) {
		return iv + ivKeyDelimiter + cipherText;
	}

	static decode(encoded) {
		return this._separateIVFromCipherText(encoded);
	}

	static _separateIVFromCipherText(fullCipherText) {
		const index = fullCipherText.indexOf(ivKeyDelimiter);
		const iv = fullCipherText.substring(0, index);
		const cipherText = fullCipherText.substring(index + 1, fullCipherText.length);

		return new IVCipher(cipherText, iv);
	}
}

module.exports = exports = IVCipher;