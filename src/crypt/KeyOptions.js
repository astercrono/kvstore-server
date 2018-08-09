const KeyOptions = () => {
	return {
		keyLength: 64,
		algorithm: "sha256",
		iterations: 1000000,
		saltLength: 32,
		passwordLength: 32
	};
};

module.exports = exports = KeyOptions;