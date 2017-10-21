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
			"saltLength": 64,
			"passwordLength": 64,
			"pbkdf2Iterations": 10000,
			"pbkdf2Algorithm": "sha512",
			"algorithm": "aes-256-cbc",
			"keyDelimiter": "$"
		},
		"signing": {
			"path": path.join(__dirname, "/kvstore-signing.secret"),
			"algorithm": "sha512"
		}
	}
};
