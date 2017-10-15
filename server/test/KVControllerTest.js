const request = require("request");
const run = require("./KVTest");

function testKVController(context, assert) {
	const baseUrl = "http://localhost:" + context.config.server.port;
	const url = (path) => {
		return baseUrl + path;
	};

	describe("KVController", () => {
		before((done) => {
			context.mockData((err) => {
				assert.ok(!err);
				done();
			});
		});

		it("GET /all", (done) => {
			request(url("/all"), function(err, response, body) {
				assert.ok(!err);
				assert.ok(body);
				assert.equal(response.statusCode, 200);
				done();
			});
		});

		it("GET /value/:key", (done) => {
			request(url("/value/key1"), function(err, response, body) {
				assert.ok(!err);
				assert.ok(body);
				assert.equal(response.statusCode, 200);
				done();
			});
		});

		it("GET /keys", (done) => {
			request(url("/keys"), function(err, response, body) {
				assert.ok(!err);
				assert.ok(body);
				assert.equal(response.statusCode, 200);
				done();
			});
		});

		it("PUT /keys", (done) => {
			request({
				url: url("/value"),
				method: "PUT",
				json: {
					"key": "key5",
					"value": "value5"
				}
			}, (err, response, body) => {
				assert.ok(!err);
				assert.ok(!body);
				assert.equal(response.statusCode, 200);
				done();
			});
		});	

		it("GET /keysWithValue/:value", (done) => {
			request(url("/keysWithValue/value1"), function(err, response, body) {
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
				}
			}, (err, response, body) => {
				assert.ok(!err);
				assert.ok(!body);
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