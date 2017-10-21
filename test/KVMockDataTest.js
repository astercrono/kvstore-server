const config = require("../config");
config.database.path = ":memory:";
config.crypt.path = "kvstore-test.secret";

const KVServer = require("../src/KVServer");
const KVService = require("../src/services/KVService");

const async = require("async");
const assert = require("assert");

module.exports = exports = (test) => {


	let server = KVServer(true);

	test({
		startServer: (done) => {
			server.start(config.server.port, (err, listener) => {
				assert.ok(!err);
				assert.ok(listener);
				done();	
			});
		},

		mockData: (done) => {
			async.series([
				(callback) => {
					KVService.refreshDatabase((err) => {
						callback(err);
					});
				},
				(callback) => {
					KVService.putValue("key1", "value1", (err) => {
						callback(err);
					});
				},
				(callback) => {
					KVService.putValue("key2", "value2", (err) => {
						callback(err);
					});
				},
				(callback) => {
					KVService.putValue("key3", "value3", (err) => {
						callback(err);
					});
				},
				(callback) => {
					KVService.putValue("key4", "value1", (err) => {
						callback(err);
					});
				},
				(callback) => {
					KVService.putValue("key5", "value4", (err) => {
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
	}, assert);
};