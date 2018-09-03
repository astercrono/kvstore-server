const assert = require("assert");
const KVTestHelper = require("../src/test/KVTestHelper");
const ComponentStore = require("../src/component/ComponentStore");
const KeyValue = require("../src/model/KeyValue");

function putTestValue(service, callback) {
	let kv = new KeyValue("test", "This is a test value.");
	service.putValue(kv, (error) => {
		assert.ok(!error);
		callback();
	});
}

describe("KVService", () => {
	before(KVTestHelper.initialize());

	it("#getAll()", (done) => {
		const service = ComponentStore.get("KVService");
		putTestValue(service, () => {
			service.getAll((error, keyValues) => {
				assert.ok(!error);
				assert.ok(keyValues);
				assert.equal(keyValues.length, 1);

				const kv = keyValues[0];
				assert.ok(kv);
				assert.equal(kv.key, "test");
				assert.equal(kv.value, "This is a test value.");

				done();
			});
		});
	});

	it("#getValue()", (done) => {
		const service = ComponentStore.get("KVService");
		putTestValue(service, () => {
			service.getValue("test", (error, value) => {
				assert.ok(!error);
				assert.ok(value);
				assert.equal(value, "This is a test value.");
				done();
			});
		});
	});

	it("#putValue()", (done) => {
		const service = ComponentStore.get("KVService");
		putTestValue(service, () => {
			done();
		});
	});

	it("#getKeys", (done) => {
		const service = ComponentStore.get("KVService");
		putTestValue(service, () => {
			service.getKeys((error, keys) => {
				assert.ok(!error);
				assert.ok(keys);
				assert.equal(keys.length, 1);
				assert.equal("test", keys[0]);
				done();
			});
		});
	});

	it("#deleteValue()", (done) => {
		const service = ComponentStore.get("KVService");
		putTestValue(service, () => {
			service.deleteValue("test", (error) => {
				assert.ok(!error);

				service.getValue("test", (error, value) => {
					assert.ok(!error);
					assert.ok(!value);
					done();
				});
			});
		});
	});
});

