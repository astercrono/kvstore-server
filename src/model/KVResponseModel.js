function KVResponseModel(data, message) {
	const model = {
		"data": null,
		"message": null 
	};

	if (data) {
		model.data = data;
	}

	if (message) {
		model.message = message;
	}

	return model;
}

module.exports = exports = KVResponseModel;