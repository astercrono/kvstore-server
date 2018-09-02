const assert = require("assert");
const KVTestHelper = require("../src/test/KVTestHelper");
const Component = require("../src/component/Component");
const ComponentStore = require("../src/component/ComponentStore");

describe("Component Test", () => {
	before(KVTestHelper.initialize());

	it("Loading Component Store", (done) => {
		const component = ComponentStore.get("KVDao");
		assert.ok(component);
		assert.ok(component.getAll);
		assert.ok(component.getValue);
		assert.ok(component.putValue);
		assert.ok(component.getKeys);
		assert.ok(component.deleteValue);

		try {
			ComponentStore.add(new Component("KVDao", {}));
		}
		catch(error) {
			assert.ok(error);
		}

		done();
	});
});