module.exports = exports = {
	send: (response) => {
		response.json(undefined);
	},

	send: (response, data) => {
		response.json(data);
	},
	
	failParam: (response) => {
		response.status(400).json({message: "Missing parameter"});
	},
	
	failUnknownRoute: (response) => {
		response.status(404).json({message: "Unknown route"});
	},
	
	failInternalError: (response) => {
		response.status(500).json({message: "An internal error occurred."});
	}
};