const async = require("async");
const run = require("./KVMockDataTest");
const KVService = require("../src/services/KVService");

function testKVService(context, assert) {
	describe("KVService", () => {
		before((done) => {
			context.startServer(() => {
				context.mockData(() => {
					done();
				});
			});
		});

		it("getAll()", (done) => {
			KVService.getAll((err, rows) => {
				assert.ok(!err);
				assert.equal(rows.length, 5);
				done();
			});
		});

		it("getValue()", (done) => {
			KVService.getValue("key2", (err, value) => {
				assert.ok(!err);
				assert.equal(value, "value2");
				done();
			});
		});

		it("putValue() - insert", (done) => {
			const newKey = "key6";
			const newValue = "value6";

			async.series([
				(callback) => {
					KVService.putValue(newKey, newValue, (err) => {
						assert.ok(!err);
						callback();
					});
				},
				(callback) => {
					KVService.getValue(newKey, (err, value) => {
						assert.ok(!err);
						assert.equal(value, newValue);
						callback();
					});
				}
			], (err, results) => {
				assert.ok(!err);
				done();
			});
		});

		it("putValue() - update", (done) => {
			const existingKey = "key3";
			const oldValue = "value3";
			const newValue = "value3A";

			assert.notEqual(newValue, oldValue);

			async.series([
				(callback) => {
					KVService.putValue(existingKey, newValue, (err) => {
						assert.ok(!err);
						callback();
					});
				},
				(callback) => {
					KVService.getValue(existingKey, (err, value) => {
						assert.ok(!err);
						assert.notEqual(value, oldValue);
						assert.equal(value, newValue);
						callback();
					});
				}
			], (err, results) => {
				assert.ok(!err);
				done();
			});
		});

		it("getKeys()", (done) => {
			KVService.getKeys((err, keys) => {
				assert.ok(!err);
				assert.equal(keys.length, 6);
				done();
			});
		});

		it("getKeysWithValue()", (done) => {
			KVService.getKeysWithValue("value1", (err, keys) => {
				assert.ok(!err);
				assert.equal(keys.length, 2);
				done();
			});
		});

		it("deleteValue()", (done) => {
			const key = "key6";

			async.series([
				(callback) => {
					KVService.deleteValue(key, (err) => {
						assert.ok(!err);
						callback();
					});
				},
				(callback) => {
					KVService.getValue(key, (err, value) => {
						assert.ok(!err);
						assert.ok(!value);
						callback();
					});
				}
			], (err, results) => {
				assert.ok(!err);
				done();
			});

		});

		after((done) => {
			context.destroy();
			done();
		});
	});
};

run((context, assert) => {
	assert.ok(context != null);
	assert.ok(!assert != null);

	testKVService(context, assert);
}, false);
