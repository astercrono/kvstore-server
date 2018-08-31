const assert = require("assert");
const ComponentLoader = require("../src/component/ComponentLoader");
const Component = require("../src/component/Component");

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
	before((done) => {
		let loaders = require("../src/component/load");
		loaders.push(TestLoader);
		done();
	});

	it("Loading Component Store", (done) => {
		const ComponentStore = require("../src/component/ComponentStore");
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