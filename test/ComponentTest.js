const assert = require("assert");
const KVTestHelper = require("./KVTestHelper");
const ComponentLoader = require("../src/component/ComponentLoader");
const Component = require("../src/component/Component");
const ComponentStore = require("../src/component/ComponentStore");

class TestLoader extends ComponentLoader {
	load() {
		const obj = {
			foo: 1,
			bar: () => { return 2; }
		};
		return [super.createComponent("TestComponent", obj)];
	}
}

describe("Component Test", () => {
	before(KVTestHelper.initialize(false));

	it("Loading Component Store", (done) => {
		let loaders = require("../src/component/load");
		loaders.push(TestLoader);

		ComponentStore.load();

		const component = ComponentStore.get("TestComponent");
		assert.ok(component);
		assert.equal(component.foo, 1);
		assert.equal(component.bar(), 2);

		try {
			ComponentStore.add(new Component("TestComponent", {}));
		}
		catch(error) {
			assert.ok(error);
		}

		done();
	});
});