var config = require("../../config");
var fs = require("fs");

module.exports = exports = {
	create: (key, iv) => {
		const model = {
			key: undefined,
			iv: undefined,

			save: (callback) => {
				if (!key || !iv) {
					callback("Missing properties in secret.");
					return;
				}

				const modelJson = JSON.stringify({
					key: this.key,
					iv: this.iv,
				});

				fs.writeFile(config.crypt.path, modelJson, "utf8", (err) => {
					if (err) {
						callback(err);
						return;
					}

					callback();
				});
			},

			validate: () => {
				return key !== undefined && iv !== undefined;
			}
		};

		model.key = key;
		model.iv = iv;

		return model;
	}
};