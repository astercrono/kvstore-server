const os = require("os");
const fs = require("fs");

const defaultProfileName = "default";
const homeDirectory = os.homedir();

const ConfigName = {
	DatabasePath: "databasePath",
	EncryptionSecretPath: "encryptionSecretPath",
	SigningSecretPath: "signingSecretPath"
};

const VariableName = {
	HomeDirectory: {
		name: "${homeDirectory}",
		replacement: homeDirectory
	}
};

module.exports = exports = {
	load: (path, profileName) => {
		const fullModel = readConfigFile(path);
		const profileModel = processOverrides(fullModel, profileName);
		compileProfileValues(profileModel);
		return profileModel;
	}
};

function processOverrides(fullModel, profileName) {
	const defaultModel = fullModel[defaultProfileName];
	const profileModel = fullModel[profileName];

	Object.keys(ConfigName).forEach((configName) => {
		const config = ConfigName[configName];

		if (!profileModel.hasOwnProperty(config) && defaultModel.hasOwnProperty(config)) {
			profileModel[config] = defaultModel[config];
		}
	});

	return profileModel;
}

function compileProfileValues(profile) {
	const names = Object.keys(profile);
	names.forEach((n) => {
		profile[n] = compileConfigValue(profile[n]);
	});
}

function compileConfigValue(value) {
	const variables = Object.keys(VariableName);
	variables.forEach((name) => {
		const v = VariableName[name];
		value = replaceVariable(value, v.name, v.replacement);
	});
	return value;
}

function containsVariable(value, variable) {
	return value.indexOf(variable) >= 0;
}

function replaceVariable(value, variable, replacement) {
	if (containsVariable(value, variable)) {
		return value.replace(variable, replacement);
	}
	return value;
}

function readConfigFile(path) {
	return JSON.parse(fs.readFileSync(path, "utf8"));
}