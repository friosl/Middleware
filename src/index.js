const http = require('http');

const { bodyParser } = require('./lib/bodyParser');
var Hashmap = require('hashmap');
var Queue = require('queue');


var channelMap = new Hashmap();
var channelOwner = new Hashmap();

function decode(encode) {
	var decode = Buffer.from(encode, 'base64').toString();
	return decode;
}
async function requestFromClient(req) {
	try {
		await bodyParser(req);
		res.writeHead(200, { 'Content-Type': 'application/json' });
	}
	catch (error) {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.write(error);
		res.end();
	}
	return req;
}

async function sendMessageHandler(req, res) {
	req = await requestFromClient(req,res);
	let channel = req.body.channel;
	let user_id = req.body.user_id;
	let message = req.body.to_send;
	channel = decode(channel);
	message = decode(message);
	if (channelMap.has(channel) === true) {
		if (channelMap.get(channel).has(user_id) === false) {
			channelMap.get(channel).set(user_id, new Queue());
		}
		let keys = channelMap.get(channel).keys();
		for (i = 0; i < keys.length; i++) {
			j = keys[i];
			channelMap.get(channel).get(j).push(message);
		}
		res.write(JSON.stringify({ message: 'Mensaje enviado' }));
		res.end();
	} else {
		res.write(JSON.stringify({ "El canal no existe": channel }));
		res.end();
	}
}
async function getMessages(req, res) {
	req = await requestFromClient(req,res);
	let channel = req.body.channel;
	let user_id = req.body.user_id;
	channel = decode(channel);
	if (channelMap.has(channel)) {
		if (channelMap.get(channel).has(user_id)) {
			messages = channelMap.get(channel).get(user_id)['jobs'];
			res.write(JSON.stringify({ messages }));
			res.end();
		}
		else {
			res.write(JSON.stringify({ "No está suscrito a canal, creando cola": channel }));
			res.end();
			channelMap.get(channel).set(user_id, new Queue());
		}
	}
	else {
		res.write(JSON.stringify({ "No existe": channel }));
		res.end();
	}

}

async function createChannel(req, res) {
	req = await requestFromClient(req,res);
	let channel = req.body.channel;
	let user_id = req.body.user_id;
	channel = decode(channel);
	if (channelMap.has(channel) === false) {
		channelMap.set(channel, new Hashmap());
		channelMap.get(channel).set(user_id, new Queue());
		channelOwner.set(channel, user_id);
		res.write(JSON.stringify({ "Se creó el canal": channel }));
		res.end();
	}
	else {
		res.write(JSON.stringify({ "Ya existe": channel }));
		res.end();
	}
}

async function deleteChannel(req, res) {
	req = await requestFromClient(req,res);
	let channel = req.body.channel;
	let user_id = req.body.user_id;
	channel = decode(channel);
	if (channelMap.has(channel)) {
		if (channelOwner.get(channel) === user_id) {
			channelMap.delete(channel);
			res.write(JSON.stringify({ "Se eliminó el canal": channel }));
			res.end();
		}
		else {
			res.write(JSON.stringify({ "No tiene permiso para eliminar: ": channel })); //If then else
			res.end();
		}
	}
	else {
		res.write(JSON.stringify({ "No existe el canal": channel }));
		res.end();
	}

}

const server = http.createServer((req, res) => {
	const { url, method } = req;
	console.log(`URL: ${url} - Method: ${method}`);

	switch (method) {
		case "GET":
			if (url === "/") {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({ message: 'Hello world' }));
				res.end();
			}
			break;

		case "POST":
			if (url === "/send") {
				sendMessageHandler(req, res);
			}
			else if (url === "/create") {
				createChannel(req, res);
			}
			else if (url === "/delete") {
				deleteChannel(req, res);
			}
			else if (url === "/getMessages") {
				getMessages(req, res);
			}
			break;
	}

});

server.listen(3000);
console.log('Server on port', 3000);

