const KVResponseModel = require("../model/KVResponseModel");

module.exports = exports = {
	send: (response) => {
		response.json(KVResponseModel());
	},

	send: (response, data) => {
		response.json(KVResponseModel(data));
	},

	failAuthentication: (response) => {
		response.status(401).json(KVResponseModel(undefined, "Unauthorized access"));
	},

	failBadRequest: (response) => {
		response.status(400).json(KVResponseModel(undefined, "Bad request"));
	},
	
	failParam: (response) => {
		response.status(400).json(KVResponseModel(undefined, "Missing parameter"));
	},
	
	failUnknownRoute: (response) => {
		response.status(404).json(KVResponseModel(undefined, "Unknown route"));
	},
	
	failInternalError: (response) => {
		response.status(500).json(KVResponseModel(undefined, "An internal error occurred."));
	}
};