const async = require("async");
const run = require("./KVTest");

function testKVService(context, assert) {
	describe("KVService", () => {
		before((done) => {
			context.mockData((err) => {
				assert.ok(!err);
				done();
			});
		});

		it("getAll()", (done) => {
			context.service.getAll((err, rows) => {
				assert.ok(!err);
				assert.equal(rows.length, 5);
				done();
			});
		});

		it("getValue()", (done) => {
			context.service.getValue("key2", (err, value) => {
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
					context.service.putValue(newKey, newValue, (err) => {
						assert.ok(!err);
						callback();
					});
				},
				(callback) => {
					context.service.getValue(newKey, (err, value) => {
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
					context.service.putValue(existingKey, newValue, (err) => {
						assert.ok(!err);
						callback();
					});
				},
				(callback) => {
					context.service.getValue(existingKey, (err, value) => {
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
			context.service.getKeys((err, keys) => {
				assert.ok(!err);
				assert.equal(keys.length, 6);
				done();
			});
		});

		it("getKeysWithValue()", (done) => {
			context.service.getKeysWithValue("value1", (err, keys) => {
				assert.ok(!err);
				assert.equal(keys.length, 2);
				done();
			});
		});

		it("deleteValue()", (done) => {
			const key = "key6";

			async.series([
				(callback) => {
					context.service.deleteValue(key, (err) => {
						assert.ok(!err);
						callback();
					});
				},
				(callback) => {
					context.service.getValue(key, (err, value) => {
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
	});
};

run((context, assert) => {
	assert.ok(context != null);
	assert.ok(!assert != null);

	testKVService(context, assert);
});
