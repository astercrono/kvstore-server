const config = require("./config").get();
const KVServer = require("./src/KVServer");

const server = KVServer(false);
server.start((err, listener) => {
	if (err) {
		console.log("Server closing");
		console.log(err);
		server.close();
		throw err;
	}
	console.log("Server listening on port " + config.server.port);
});