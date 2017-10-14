const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const ControllerUtil = require("../util/ControllerUtil");
const kvservice = require("../services/KVService");

const jsonParser = bodyParser.json();

router.get("/all",  (request, response) => {
	kvservice.getAll((err, rows) => {
		ControllerUtil.send(response, rows);
	});
});

router.get("/value/:key",  (request, response) => {
	if (!("key" in request.params)) {
		ControllerUtil.failParam(response);
		return;
	}

	const key = request.params.key;

	kvservice.getValue(key, (err, keys) => {
		if (err) {
			ControllerUtil.failInternalError(response);
			return;
		}
		ControllerUtil.send(response, keys);
	});
});

router.get("/keys",  (request, response) => {
	kvservice.getKeys((err, keys) => {
		if (err) {
			ControllerUtil.failInternalError(response);
			return;
		}
		ControllerUtil.send(response, keys);
	});
});

router.put("/value", jsonParser, (request, response) => {
	const model = request.body;

	if (!("key" in model) || !("value" in model)) {
		ControllerUtil.failParam(response);
	}

	const key = model.key;
	const value = model.value;

	kvservice.putValue(key, value, (err) => {
		if (err) {
			ControllerUtil.failInternalError(response);
			return;
		}
		ControllerUtil.send(response);
	});
});


router.get("/keysWithValue/:value",  (request, response) => {
	if (!("value" in request.params)) {
		ControllerUtil.failParam(respose);
		return;
	}

	const value = request.params.value;

	kvservice.getKeysWithValue(value, (err, keys) => {
		if (err) {
			ControllerUtil.failInternalError(response);
			return;
		}
		ControllerUtil.send(response, keys);
	});
});

router.delete("/value/:key", (request, response) => {
	if (!("key" in request.params)) {
		ControllerUtil.failParam(response);
	}

	const key = request.params.key;

	kvservice.deleteValue(key, (err) => {
		if (err) {
			ControllerUtil.failInternalError(response);
			return;
		}
		ControllerUtil.send(response);
	});
});

router.all("*", (request, response) => {
	ControllerUtil.failUnknownRoute(response);
});

module.exports = exports = router;
