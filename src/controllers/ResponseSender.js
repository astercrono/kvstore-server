const KVResponseModel = require("../model/KVResponseModel");

class ResponseSender {
	constructor(response) {
		this.response = response;
	}

	send(data) {
		this.response.json(new KVResponseModel(data));
	}

	failAuthentication() {
		this.response.status(401).json(new KVResponseModel(undefined, "Unauthorized access"));
	}

	failBadRequest() {
		this.response.status(400).json(new KVResponseModel(undefined, "Bad request"));
	}

	failParam() {
		this.response.status(400).json(new KVResponseModel(undefined, "Missing parameter"));
	}

	failUnknownRoute() {
		this.response.status(404).json(new KVResponseModel(undefined, "Unknown route"));
	}

	failInternalError() {
		this.response.status(500).json(new KVResponseModel(undefined, "An internal error occurred."));
	}
}

module.exports = exports = ResponseSender;
