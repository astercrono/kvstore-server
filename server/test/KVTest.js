module.exports = exports = (test, startServer) => {
	const config = require("../config");
	config.database.path = ":memory:";

	const kvservice = require("../src/services/KVService");
	const async = require("async");
	let server;

	if (startServer) {
		server = require("../app");
	}

	const context = {
		config: config,
		service: kvservice,
		server: server,

		mockData: (done) => {
			async.series([
				(callback) => {
					kvservice.refreshDatabase((err) => {
						callback(err);
					});
				},
				(callback) => {
					kvservice.putValue("key1", "value1", (err) => {
						callback(err);
					});
				},
				(callback) => {
					kvservice.putValue("key2", "value2", (err) => {
						callback(err);
					});
				},
				(callback) => {
					kvservice.putValue("key3", "value3", (err) => {
						callback(err);
					});
				},
				(callback) => {
					kvservice.putValue("key4", "value1", (err) => {
						callback(err);
					});
				},
				(callback) => {
					kvservice.putValue("key5", "value4", (err) => {
						callback(err);
					});
				}
			], (error, results) => {
				if (error) {
					callback(error);
					return;
				}
				done();
			});
		},

		destroy: () => {
			if (server) {
				server.close();
			}
		}
	};
	
	test(context, require("assert"));
};