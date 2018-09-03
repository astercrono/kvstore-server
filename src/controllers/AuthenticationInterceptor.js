const ResponseSender = require("./ResponseSender");
const KVCrypt = require("../crypt/KVCrypt");

class AuthenticationInterceptor {
	static createDefault() {
		return (request, response, next) => {
			const sender = new ResponseSender(response);
			const authHeader = request.headers.authorization;

			if (!authHeader) {
				sender.failBadRequest(response);
				return;
			}

			const auth = authHeader.split(" ");

			if (!auth || auth.length !== 2) {
				sender.failBadRequest(response);
				return;
			}

			const authType = auth[0];
			const authKey = auth[1];

			if (authType !== "Bearer") {
				sender.failBadRequest(response);
				return;
			}

			if (!authKey || !KVCrypt().confirmApiKey(authKey)) {
				sender.failAuthentication(response);
				return;
			}

			next();
		};
	}
}

module.exports = exports = AuthenticationInterceptor;
