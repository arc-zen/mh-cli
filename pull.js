import * as helper from "./helper.js";
import fetch from "node-fetch";
import fs from "fs";
import chalk from "chalk";
/**
 * @param {String} server_id
 * @param {String} auth
 * @param {String} x_session_id
 * @returns {Array}
 */
export async function pull(server_id, auth, x_session_id) {
	let i = 0;
	let skript_files = [];
	let files = await helper.getSkriptFiles(server_id, auth, x_session_id);
	// console.log(files);
	// get file names
	for (let file of files) {
		if (file.name.startsWith("-")) {
			continue;
		}
		if (!file.name.endsWith(".sk")) {
			let nested_files = await helper.getNestedSkriptFiles(server_id, auth, x_session_id, file.name);
			console.log(chalk.cyan.bold("FILE IS FOLDER"));
			console.log(chalk.cyan(`pulling /read//plugins/Skript/scripts/${file.name}/`));
			for (let nested_file of nested_files) {
				console.log(chalk.gray(`pulling /read//plugins/Skript/scripts/${file.name}/${nested_file.name}`));
				const nested_resp = await fetch(`https://api.minehut.com/file/${server_id}/read//plugins/Skript/scripts/${file.name}/${nested_file.name}`, {
					method: "GET",
					headers: { Authorization: auth, "x-session-id": x_session_id },
				})
					.then(i++)
					.then((response) => response.json())
					.then(console.log(chalk.green.bold("GOT! ") + chalk.gray(file.name + "/" + nested_file.name)))
					.catch((err) => console.error(err));
				if (!fs.existsSync(`./scripts/${file.name}/${nested_file.name}`)) {
					if (fs.readFileSync(`./scripts/${file.name}/${nested_file.name}`, "utf8") === nested_resp.content) {
						console.log(chalk.cyan(`no changes for ${nested_file.name}, skipping`));
						continue;
					}
					// write files
					if (!fs.existsSync(`./scripts/${file.name}/`)) {
						fs.mkdirSync(`./scripts/${file.name}/`);
					}
					fs.writeFileSync(`./scripts/${file.name}/${nested_file.name}`, nested_resp.content);
					console.log(chalk.green.bold("WROTE! ") + chalk.gray(nested_file.name) + chalk.gray(` to ./scripts/${file.name}`));
				} else {
					console.log(chalk.green.bold("CREATED! ") + chalk.gray(nested_file.name) + chalk.gray(` to ./scripts/${file.name}`));
				}
			}
		} else {
			// read files
			console.log(chalk.gray(`pulling /read//plugins/Skript/scripts/${file.name}`));
			const resp = await fetch(`https://api.minehut.com/file/${server_id}/read//plugins/Skript/scripts/${file.name}`, {
				method: "GET",
				headers: { Authorization: auth, "x-session-id": x_session_id },
			})
				.then(i++)
				.then((response) => response.json())
				.then(console.log(chalk.green.bold("GOT! ") + chalk.gray(file.name)))
				.catch((err) => console.error(err));
			if (fs.existsSync(`./scripts/${file.name}`)) {
				if (fs.readFileSync(`./scripts/${file.name}`, "utf8") === resp.content) {
					console.log(chalk.cyan(`no changes for ${file.name}, skipping`));
					continue;
				}
				// write files
				fs.writeFileSync(`./scripts/${file.name}`, resp.content);
				console.log(chalk.green.bold("WROTE! ") + chalk.gray(file.name) + chalk.gray(" to ./scripts/"));
			} else {
				console.log(chalk.green.bold("CREATED! ") + chalk.gray(file.name) + chalk.gray(" to ./scripts/"));
			}
		}
	}
}
