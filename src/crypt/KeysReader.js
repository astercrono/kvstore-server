const KeysFormatError = require("../error/KeysFormatError");
const KeysReadError = require("../error/KeysReadError");
const Keys = require("./Keys");
const fs = require("fs");

class KeysReader {
	constructor(path) {
		this.path = path;
	}

	read(callback) {
		fs.readFile(this.path, "utf8", (err, json) => {
			if (err) {
				callback(new KeysReadError(err));
				return;
			}

			let keyMap;

			try {
				keyMap = JSON.parse(json);
			} catch (parseError) {
				callback(new KeysFormatError(parseError));
				return;
			}

			if (!keyMap) {
				callback(new KeysFormatError());
				return;
			}

			const keys = new Keys();

			Object.keys(keyMap).forEach((k) => {
				keys.set(k, keyMap[k]);
			});

			keys.lock();
			callback(undefined, keys);
		});
	}
}

module.exports = exports = KeysReader;
