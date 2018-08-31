const Component = require("./Component");

class ComponentLoader {
	load() { }

	createComponent(name, obj)	{
		return new Component(name, obj);
	}
}

module.exports = exports = ComponentLoader;