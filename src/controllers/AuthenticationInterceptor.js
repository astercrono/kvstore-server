const ResponseSender = require("./ResponseSender");
const KVCrypt = require("../crypt/KVCrypt");

module.exports = exports = () => {
	return (request, response, next) => {
		const authHeader = request.headers.authorization;

		if (!authHeader) {
			ResponseSender.failBadRequest(response);
			return;
		}

		const auth = authHeader.split(" ");

		if (!auth || auth.length !== 2) {
			ResponseSender.failBadRequest(response);
			return;
		}

		const authType = auth[0];
		const authKey = auth[1];

		if (authType !== "Bearer") {
			ResponseSender.failBadRequest(response);
			return;
		}

		if (!authKey || !KVCrypt.confirmApiKey(authKey)) {
			ResponseSender.failAuthentication(response);
			return;
		}

		next();
	};
};