const defaultOptions = {
	keyLength: 64,
	algorithm: "sha512",
	iterations: 100000,
	saltLength: 32,
	passwordLength: 32
};

function KeyOptions(options) {
	let keyOptions = Object.assign(Object.create(null), defaultOptions);

	if (options) {
		Object.keys(defaultOptions).forEach((key) => {
			if (options[key]) {
				keyOptions[key] = options[key];
			}
		});
	}

	return Object.assign({}, keyOptions);
}

module.exports = exports = KeyOptions;