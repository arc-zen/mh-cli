import fetch from "node-fetch";
export async function getServerId(server) {
	return (await fetch(`https://api.minehut.com/server/${server}?byName=true`).then((response) => response.json())).server._id;
}

export async function getServerFiles(server_id, authorization, x_session_id) {
	return await fetch(`https://api.minehut.com/file/${server_id}/list/`, {
		headers: { Authorization: authorization, "x-session-id": x_session_id },
	})
		// .then((response) => response.json())
		.then((response) => console.log(response)); // .files
}
