function KeyValue(key, value) {
	const model = {
		"key": null,
		"value": value
	};

	if (key) {
		model.key = key;
	}

	if (value) {
		model.value = value;
	}

	return model;
}

module.exports = exports = KeyValue;