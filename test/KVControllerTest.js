const config = require("../config");
const KVCrypt = require("../src/crypt/KVCrypt");
const run = require("./KVMockDataTest");

const request = require("request");

function testKVController(context, assert) {
	const baseUrl = "http://localhost:" + config.server.port;
	const url = (path) => {
		return baseUrl + path;
	};

	describe("KVController", () => {
		before((done) => {
			context.startServer(() => {
				context.mockData(() => {
					done();
				});
			});
		});

		it("GET /all", (done) => {
			request(url("/all"), {
				"auth": {
					"bearer": KVCrypt.getKey("api")
				}	
			}, function(err, response, body) {
				assert.ok(!err);
				assert.ok(body);
				assert.equal(response.statusCode, 200);
				done();
			});
		});

		it("GET /value/:key", (done) => {
			request(url("/value/key1"), {
				"auth": {
					"bearer": KVCrypt.getKey("api")
				}		
			}, function(err, response, body) {
				assert.ok(!err);
				assert.ok(body);
				assert.equal(response.statusCode, 200);
				done();
			});
		});

		it("GET /keys", (done) => {
			request(url("/keys"), {
				"auth": {
					"bearer": KVCrypt.getKey("api")
				}	
			}, function(err, response, body) {
				assert.ok(!err);
				assert.ok(body);
				assert.equal(response.statusCode, 200);
				done();
			});
		});

		it("PUT /value", (done) => {
			request({
				url: url("/value"),
				method: "PUT",
				json: {
					"key": "key5",
					"value": "value5"
				},
				headers: {
					"Authorization": "Bearer " + KVCrypt.getKey("api")
				}
			}, (err, response, body) => {
				assert.ok(!err);
				assert.ok(body);
				assert.equal(response.statusCode, 200);
				done();
			});
		});	

		it("DELETE /value", (done) => {
			request({
				url: url("/value"),
				method: "DELETE",
				json: {
					"key": "key1",
				},
				headers: {
					"Authorization": "Bearer " + KVCrypt.getKey("api")
				}
			}, (err, response, body) => {
				assert.ok(!err);
				assert.ok(body);
				assert.equal(response.statusCode, 200);
				done();
			});
		});	

		after((done) => {
			context.destroy();
			done();
		});
	});
}

run((context, assert) => {
	assert.ok(context != null);
	assert.ok(!assert != null);

	testKVController(context, assert);
}, true);