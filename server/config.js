const path = require("path");

module.exports = exports = {
	"database": {
		"path": path.join(__dirname, "/kvstore.db")
	},
	"server": {
		"port": 8080
	}
};
