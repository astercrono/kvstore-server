module.exports = exports = (test) => {
	const config = require("../config");
	config.database.path = ":memory:";

	const kvservice = require("../src/services/KVService");
	const async = require("async");

	const context = {
		service: kvservice,

		mockData: (done) => {
			async.series([
				(callback) => {
					kvservice.createDatabase((err) => {
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
		}
	};
	
	test(context, require("assert"));
};