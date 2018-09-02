class KeyOptions {
	constructor(name) {
		this.name = name;
		this.keyLength = 64;
		this.algorithm = "sha256";
		this.iterations = 1000000;
		this.saltLength = 32;
		this.passwordLength = 32;
	};
};

module.exports = exports = KeyOptions;