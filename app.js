const KVServer = require("./src/KVServer");
const config = require("./config");

const server = KVServer(false);
server.start(config.server, (err, listener) => {
	if (err) {
		server.close();
		throw err;
	}
});