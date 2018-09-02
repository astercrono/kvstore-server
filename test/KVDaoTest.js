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

	/*it("#putValue()", () => {
		const dao = ComponentStore.get("KVDao");
		before(putTestValue(dao));
	});*/
});