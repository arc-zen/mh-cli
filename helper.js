import fetch from "node-fetch";
import chalk from "chalk";
import fs from "fs";
export async function getServerId(server) {
	return (await fetch(`https://api.minehut.com/server/${server}?byName=true`).then((response) => response.json())).server._id;
}
export function timeDifference(current, previous) {
	var msPerMinute = 60 * 1000;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerMonth = msPerDay * 30;
	var msPerYear = msPerDay * 365;
	var elapsed = current - previous;
	if (elapsed < msPerMinute) {
		return Math.round(elapsed / 1000) + " seconds";
	} else if (elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + " minutes";
	} else if (elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) + " hours";
	} else if (elapsed < msPerMonth) {
		return "approximately " + Math.round(elapsed / msPerDay) + " days";
	} else if (elapsed < msPerYear) {
		return "approximately " + Math.round(elapsed / msPerMonth) + " months";
	} else {
		return "approximately " + Math.round(elapsed / msPerYear) + " years";
	}
}
/**
 * @param {String} server_id
 * @param {String} authorization - userconfig.authorization
 * @param {String} x_session_id - userconfig.x_session_id
 * @returns {Array}
 */
export async function getServerFiles(server_id, authorization, x_session_id) {
	const resp = await fetch(`https://api.minehut.com/file/${server_id}/list/`, {
		headers: { Authorization: authorization, "x-session-id": x_session_id },
	}).then((response) => response.json());
	return resp.files;
}
/**
 * @param {String} server_id
 * @param {String} authorization - userconfig.authorization
 * @param {String} x_session_id - userconfig.x_session_id
 * @returns {Promise<Array>}
 */
export async function getSkriptFiles(server_id, authorization, x_session_id) {
	const resp = await fetch(`https://api.minehut.com/file/${server_id}/list//plugins/Skript/scripts`, {
		headers: { Authorization: authorization, "x-session-id": x_session_id },
	}).then((response) => response.json());
	return resp.files;
}

export async function getNestedSkriptFiles(server_id, authorization, x_session_id, nested_folder_name) {
	const resp = await fetch(`https://api.minehut.com/file/${server_id}/list//plugins/Skript/scripts/${nested_folder_name}/`, {
		headers: { Authorization: authorization, "x-session-id": x_session_id },
	}).then((response) => response.json());
	return resp.files;
}
/**
 * @param {Array} files - Array of file objects.
 * @param {String} type - type of file to filter by. Can be "skript" or "home".
 */
export function formatFiles(files, type) {
	let r = "";
	if (type == "home") {
		r = chalk.blue.bold("home");
	} else if (type == "skript") {
		r = chalk.cyan.bold("scripts");
	} else {
		console.error(chalk.red.bold("something went outrageously wrong with the formatting... \n please report to arczen! o7"));
		process.exit();
	}
	for (const e of files) {
		if (e.directory) e.name = `${chalk.cyan("├ " + e.name + "/")}`;
		else if (type == "skript" && e.name.startsWith("-")) e.name = `${chalk.red.bold(e.name)}`;
		else e.name = `${chalk.blue("├ " + e.name)}`;
		r = r + "\n" + e.name + " (" + e.size + " bytes" + ")";
	}
	return r;
}
/**
 * @param {string} authorization - Your auth key. Please update user-config.js with your auth key, as it will read from there.
 * @param {string} x_session_id - Your session id. Please update user-config.js with your session id, as it will read from there.
 * @param {string} server_id - The server id. No need to get the actual ID, as a server name will work just fine (server name is required, actually).
 * @param {string} path - The path to the file on the server side. This is not your local file path, but your to the file on minehut's side. This DOES include your file name.
 * @param {string} content - The content of the file to be uploaded. Note that this must first be already parsed or be parsed by helper.toPayloadableJSON().
 * @param {boolean} timed - Whether or not to time the upload. This is optional, and will default to 'false'.
 */
export async function editFile(authorization, x_session_id, server_id, file_path, content_to, timed = false) {
	if (timed) var start_time = Date.now();
	let body = {
		content: content_to,
	};
	console.log(chalk.gray("sending " + file_path + " to " + `https://api.minehut.com/file/${server_id}/edit/${file_path}`));
	const resp = await fetch(`https://api.minehut.com/file/${server_id}/edit/${file_path}`, {
		method: "POST",
		body: JSON.stringify(body),
		headers: { Authorization: authorization, "x-session-id": x_session_id, "Content-Type": "application/json" },
	})
		.then(console.log(chalk.green.bold("successfully edited file")))
		.then(console.log(chalk.green(`took ${Date.now() - start_time}ms`)));
}
/**
 * @param {string} file - The file to be read and parsed, to be uploaded. Note that this is the file path AND file name.
 */
export function toPayloadableJSON(file) {
	try {
		let data = fs.readFileSync(file, "utf8");
		data = data.split("\n").join("");
		return data;
	} catch (err) {
		console.error(chalk.red.bold("failed to read file\nreport to arczen ASAP ty o7"));
		console.log(err);
		process.exit();
	}
}
