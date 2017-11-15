const path = require("path");

module.exports = exports = {
	"database": {
		"path": path.join(__dirname, "/kvstore.db"),
		"testPath": ":memory:"
	},
	"server": {
		"port": 443,
		"ssl": {
			"keyPath": "/etc/ssl/private/kvstore.key",
			"certPath": "/etc/ssl/certs/kvstore.crt"
		}
	},
	"crypt": {
		"keystore": {
			"path": path.join(__dirname, "/keystore.secret"),
			"testPath": path.join(__dirname, "/keystore-test.secret")
		},
		"encryption": {
			"keyLength": 32,
			"algorithm": "aes-256-cbc",
			"iterations": 100000,
			"keyDelimiter": "$",
			"iv": {
				"keyLength": 16,
				"algorithm": "sha256",
				"iterations": 10000
			}
		},
		"signing": {
			"keyLength": 64,
			"algorithm": "sha512",
			"iterations": 100000
		},
		"api": {
			"keyLength": 64,
			"algorithm": "sha512",
			"iterations": 100000
		}
	}
};
