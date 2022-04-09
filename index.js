// const fetch = require("node-fetch");
import userconfig from "./user-config.js";
import * as helper from "./helper.js";
import chalk from "chalk";
const args = process.argv.slice(2);
if (args.length === 0) {
	if (!userconfig.authorization || !userconfig.x_session_id) {
		console.log(
			chalk.red.bold(
				"Please provide an email and/or a password. A guide will be uploaded soon. For now, please navigate to user-config.js and configure your credentials.\nhttps://github.com/TeamMH/minehutxyz/blob/apidocs/api/auth.md"
			)
		);
		process.exit();
	}
}
const server_id = await helper.getServerId(userconfig.server);
console.log(args);
// const script_files = await helper.getSkriptFiles(server_id, userconfig.authorization, userconfig.x_session_id);
// console.log(helper.formatFiles(script_files, "skript"));
// let content = "# hello wORLDLDLLDLDD";
// helper.editFile(userconfig.authorization, userconfig.x_session_id, server_id, "/plugins/Skript/scripts/", "test.sk", content, true);
// console.log(await helper.getServerId(userconfig.server));
