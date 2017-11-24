const path = require("path");

const production = {
	"database": {
		"path": path.join(__dirname, "/kvstore.db")
	},
	"server": {
		"port": 443,
		"sslEnabled": true,
		"keyPath": "/etc/ssl/private/kvstore.key",
		"certPath": "/etc/ssl/certs/kvstore.crt"
	},
	"crypt": {
		"keystore": {
			"path": path.join(__dirname, "/keystore.secret")
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

const test = JSON.parse(JSON.stringify(production));
test.database.path = ":memory:";
test.server.sslEnabled = false;
test.server.port = 8080;
test.crypt.keystore.path = path.join(__dirname, "/keystore-test.secret");

let activeConfig = production;

module.exports = exports = {
	enableTestMode: () => {
		activeConfig = test;
	},

	get: () => {
		return activeConfig;
	}
};