const KeysWriteError = require("../error/KeysWriteError");

const fs = require("fs");

function KeysWriter() {
	return {
		write: (path, keys, callback) => {
			fs.writeFile(path, keys.json(), (err) => {
				if (err) {
					callback(new KeysWriteError(err));
					return;
				}

				callback();
			});
		}
	};
}

module.exports = exports = KeysWriter;
