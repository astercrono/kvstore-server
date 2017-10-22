const path = require("path");

module.exports = exports = {
	"database": {
		"path": path.join(__dirname, "/kvstore.db")
	},
	"server": {
		"port": 8080
	},
	"crypt": {
		"encryption": {
			"path": path.join(__dirname, "/kvstore.secret"),
			"blockMode": "cbc",
			"keyLength": 32,
			"ivLength": 16,
			"algorithm": "aes-256-cbc",
			"keyDelimiter": "$"
		},
		"pbkdf2": {
			"saltLength": 64,
			"passwordLength": 64,
			"iterations": 10000,
			"algorithm": "sha512",
		},
		"signing": {
			"path": path.join(__dirname, "/kvstore-signing.secret"),
			"algorithm": "sha512",
			"keyLength": 32
		}
	}
};
