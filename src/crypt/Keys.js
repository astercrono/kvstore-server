function Keys() {
	const keys = {};
	let locked = false;

	return {
		set: (name, value) => {
			if (!locked) {
				keys[name] = value;
			}
		},

		get: (name) => {
			return keys[name];
		},

		lock: () => {
			Object.freeze(keys);
			locked = true;
		},

		json: () => {
			return JSON.stringify(keys);
		}
	};
}

module.exports = exports = Keys;