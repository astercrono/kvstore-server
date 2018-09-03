const assert = require("assert");
const KVTestHelper = require("../src/test/KVTestHelper");
const ComponentStore = require("../src/component/ComponentStore");
const KeyValue = require("../src/model/KeyValue");

function putTestValue(dao, callback) {
	let kv = new KeyValue("test", "This is a test value.", "This is a test signature.");
	dao.putValue(kv, (error) => {
		assert.ok(!error);
		assert.ok(kv.signature);
		callback();
	});
}

describe("KVDao", () => {
	before(KVTestHelper.initialize());

	it("#getAll()", (done) => {
		const dao = ComponentStore.get("KVDao");
		putTestValue(dao, () => {
			dao.getAll((error, keyValues) => {
				assert.ok(!error);
				assert.ok(keyValues);
				assert.equal(keyValues.length, 1);

				const kv = keyValues[0];
				assert.ok(kv);
				assert.equal(kv.key, "test");
				assert.equal(kv.value, "This is a test value.");
				assert.equal(kv.signature, "This is a test signature.");

				done();
			});
		});
	});

	it("#getValue()", (done) => {
		const dao = ComponentStore.get("KVDao");
		putTestValue(dao, () => {
			dao.getValue("test", (error, value) => {
				assert.ok(!error);
				assert.ok(value);
				assert.equal(value, "This is a test value.");
				done();
			});
		});
	});

	it("#putValue()", (done) => {
		const dao = ComponentStore.get("KVDao");
		putTestValue(dao, () => {
			done();
		});
	});

	it("#getKeys", (done) => {
		const dao = ComponentStore.get("KVDao");
		putTestValue(dao, () => {
			dao.getKeys((error, keys) => {
				assert.ok(!error);
				assert.ok(keys);
				assert.equal(keys.length, 1);
				assert.equal("test", keys[0]);
				done();
			});
		});
	});

	it("#deleteValue()", (done) => {
		const dao = ComponentStore.get("KVDao");
		putTestValue(dao, () => {
			dao.deleteValue("test", (error) => {
				assert.ok(!error);

				dao.getValue("test", (error, value) => {
					assert.ok(!error);
					assert.ok(!value);
					done();
				});
			});
		});
	});

	it("#run()", (done) => {
		const dao = ComponentStore.get("KVDao");
		putTestValue(dao, () => {
			dao.run("delete from kvstore where key = ?", ["test"], (error) => {
				assert.ok(!error);

				dao.getValue("test", (error, value) => {
					assert.ok(!error);
					assert.ok(!value);
					done();
				});
			});
		});
	});
});