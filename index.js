// const fetch = require("node-fetch");
import userconfig from "./user-config.js";
import * as helper from "./helper.js";
import chalk from "chalk";
import { pull } from "./pull.js";
const args = process.argv.slice(2);
const server_id = await helper.getServerId(userconfig.server);
if (args.length === 0) {
	if (!userconfig.authorization || !userconfig.x_session_id) {
		console.log(
			chalk.red.bold(
				"Please provide an email and/or a password. A guide will be uploaded soon. For now, please navigate to user-config.js and configure your credentials.\nhttps://github.com/TeamMH/minehutxyz/blob/apidocs/api/auth.md"
			)
		);
		process.exit();
	}
} else if (args.includes("pull") && !args.includes("push")) {
	pull(server_id, userconfig.authorization, userconfig.x_session_id).then(process.exit);
} else if (args.includes("push") && !args.includes("pull")) {
	console.log("not implemented yet");
}
console.log(args);
// const content = helper.toPayloadableJSON("./scripts/misc.sk");
// helper.editFile(userconfig.authorization, userconfig.x_session_id, server_id, "/plugins/Skript/scripts/test.sk", content, true);
