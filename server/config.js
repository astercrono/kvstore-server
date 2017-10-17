const path = require("path");

module.exports = exports = {
	"database": {
		"path": path.join(__dirname, "/kvstore.db")
	},
	"server": {
		"port": 8080
	},
	"crypt": {
		"enabled": true,
		"path": path.join(__dirname, "/kvstore.secret"),
		"blockMode": "cbc",
		"keyLength": 256,
		"saltLength": 512,
		"passwordLength": 256,
		"pbkdf2Iterations": 10000
	}
};
