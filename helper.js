import fetch from "node-fetch";
import chalk from "chalk";
import fs from "fs";
import { join } from "path";
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
export async function getServerFiles(server_id, authorization, x_session_id) {
	const resp = await fetch(`https://api.minehut.com/file/${server_id}/list/`, {
		headers: { Authorization: authorization, "x-session-id": x_session_id },
	}).then((response) => response.json());
	return resp.files;
}

export async function getSkriptFiles(server_id, authorization, x_session_id) {
	const resp = await fetch(`https://api.minehut.com/file/${server_id}/list//plugins/Skript/scripts`, {
		headers: { Authorization: authorization, "x-session-id": x_session_id },
	}).then((response) => response.json());
	return resp.files;
}
// i do not know how to do @param lmfaoo
// quick documentation i guess:
// the "types" refer to the type of formatting needed to do
// "home" is the home file
// "skript" are the skripts folder

// also, this is horribly written
// ill fix it later
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
		else e.name = `${chalk.blue("├ " + e.name)}`;
		if (type == "skript" && e.name.startsWith("-")) e.name = `${chalk.red.bold(e.name)}`;
		r = r + "\n" + e.name + " (" + e.size + " bytes" + ")";
	}
	return r;
}

export async function editFile(authorization, x_session_id, server_id, file_path, file_name, content_to, timed) {
	if (timed) var start_time = Date.now();
	let body = {
		content: content_to,
	};
	console.log(chalk.gray("sending " + JSON.stringify(body)));
	console.log(chalk.gray("to " + `https://api.minehut.com/file/${server_id}/edit/${file_path}${file_name}`));
	const resp = await fetch(`https://api.minehut.com/file/${server_id}/edit/${file_path}${file_name}`, {
		method: "POST",
		body: JSON.stringify(body),
		headers: { Authorization: authorization, "x-session-id": x_session_id, "Content-Type": "application/json" },
	})
		.then(console.log(chalk.green.bold("successfully edited file")))
		.then(console.log(chalk.green(`took ${Date.now() - start_time}ms`)));
}
// note that the argument takes in the LOCAL PATH to the file
// (the one that we have in the /scripts/ folder)
export function toPayloadableJSON(file) {
	try {
		let data = fs.readFileSync(file, "utf8");
		data = data.split("\n");
		data = data.join("");
		return data;
	} catch (err) {
		console.error(chalk.red.bold("failed to read file\nreport to arczen ASAP ty o7"));
		console.log(err);
		process.exit();
	}
}
