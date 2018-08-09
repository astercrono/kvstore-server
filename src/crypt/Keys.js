function Keys() {
	let keys = {};
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

		getBuffer: (name) => {
			return Buffer.from(keys[name], "hex");
		},

		lock: () => {
			Object.freeze(keys);
			locked = true;
		},

		json: () => {
			return JSON.stringify(keys);
		},

		equals: (otherKeys) => {
			const keySet = Object.keys(keys);
			const otherKeySet = Object.keys(otherKeys);

			if (keySet.length !== otherKeySet.length) {
				return false;
			}

			return keySet.every((k) => {
				return keys[k] === otherKeys[k];
			});
		}
	};
}

module.exports = exports = Keys;