const KeysWriteError = require("../error/KeysWriteError");

const fs = require("fs");

class KeysWriter {
	constructor(path) {
		this.path = path;
	}

	write(keys, callback) {
		fs.writeFile(this.path, keys.json(), (err) => {
			if (err) {
				callback(new KeysWriteError(err));
				return;
			}

			callback();
		});
	}
}

module.exports = exports = KeysWriter;
