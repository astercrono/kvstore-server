const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const kvservice = require("../services/KVService");

const jsonParser = bodyParser.json();

router.get("/all",  (request, response) => {
	kvservice.getAll((err, rows) => {
		send(response, rows);
	});
});

router.get("/value/:key",  (request, response) => {
	if (!("key" in request.params)) {
		failParam(response);
		return;
	}

	const key = request.params.key;

	kvservice.getValue(key, (err, keys) => {
		if (err) {
			failInternalError(response);
			return;
		}
		send(response, keys);
	});
});

router.get("/keys",  (request, response) => {
	kvservice.getKeys((err, keys) => {
		if (err) {
			failInternalError(response);
			return;
		}
		send(response, keys);
	});
});

router.put("/value", jsonParser, (request, response) => {
	const model = request.body;

	if (!("key" in model) || !("value" in model)) {
		failParam(response);
	}

	const key = model.key;
	const value = model.value;

	kvservice.putValue(key, value, (err) => {
		if (err) {
			failInternalError(response);
			return;
		}
		send(response, undefined);
	});
});


router.get("/keysWithValue/:value",  (request, response) => {
	if (!("value" in request.params)) {
		failParam(respose);
		return;
	}

	const value = request.params.value;

	kvservice.getKeysWithValue(value, (err, keys) => {
		if (err) {
			failInternalError(response);
			return;
		}
		send(response, keys);
	});
});

router.all("*", (request, response) => {
	failUnknownRoute(response);
});

function send(response, data) {
	response.json(data);
}

function failParam(response) {
	response.status(400).json({message: "Missing parameter"});
}

function failUnknownRoute(response) {
	response.status(404).json({message: "Unknown route"});
}

function failInternalError(response) {
	response.status(500).json({message: "An internal error occurred."});
}

module.exports = exports = router;
