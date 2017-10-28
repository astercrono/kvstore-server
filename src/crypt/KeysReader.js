const KeysFormatError = require("../error/KeysFormatError");
const KeysReadError = require("../error/KeysReadError");
const Keys = require("./Keys");
const fs = require("fs");

function KeysReader() {
	return {
		read: (path, callback) => {
			fs.readFile(path, "utf8", (err, json) => {
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
					callback(new KeysFormatError(parseError));
					return;
				}

				const keys = Keys();

				Object.keys(keyMap).forEach((k) => {
					keys.set(k, keyMap[k]);
				});

				keys.lock();
				callback(undefined, keys);
			});
		}
	};
}

module.exports = exports = KeysReader;
