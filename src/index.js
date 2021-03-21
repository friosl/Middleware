const http = require('http');

const { bodyParser } = require('./lib/bodyParser');
var Hashmap = require('hashmap');
var Queue = require('queue');


var channelMap = new Hashmap();
var channelOwner = new Hashmap();

async function MessageHandler(req, res) {
	try {
		await bodyParser(req);
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({ message: 'Mensaje recibido' }));
		res.end();
	} catch (error) {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.write(error);
		res.end();

	}
        let channel = req.body.channel;
        let user_id = req.body.user_id;
	let message = req.body.to_send;
	if(channelMap.has(channel) === true) {
		if(channelMap.get(channel).has(user_id) === false) {
			channelMap.get(channel).set(user_id, new Queue());
		}
		let keys = channelMap.get(channel).keys();
		//console.log(channelMap.get(channel).get(user_id));
		for(i = 0; i < keys.length;i++) {
			j= keys[i];
			channelMap.get(channel).get(j).push(message);
		}
	}else{
		console.log("El canal no existe");
	}

}
async function getMessages(req, res) {
        try {
                await bodyParser(req);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                //res.write(JSON.stringify({ message: 'Mensaje recibido' }));
                res.end();
        } catch (error) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write(error);
                res.end();

        }
        let channel = req.body.channel;
        let user_id = req.body.user_id;
        if (channelMap.has(channel)){
		if (channelMap.get(channel).has(user_id)) {
			messages = channelMap.get(channel).get(user_id)['jobs'];
			console.log(messages);
		}
                else {
			console.log("No esta suscrito");
		}
        }
	else {
		console.log("El canal no existe");
	}

}

async function createChannel(req, res) {
        try {
                await bodyParser(req);
        }
        catch (error) {
                console.log("error en bodyP");
        }
        let channel = req.body.channel;
        let user_id = req.body.user_id;
	if (channelMap.has(channel)=== false){
		channelMap.set(channel, new Hashmap());
		channelMap.get(channel).set(user_id, new Queue());}
		channelOwner.set(channel,user_id);
		console.log("nombre canal creado: "+channel+ " por el usuario "+ user_id);
	else {
		console.log("channel exists");
	}
}

async function deleteChannel(req, res) {
        try {
                await bodyParser(req);
        }
        catch (error) {
                console.log("error en bodyP");
        }
        let channel = req.body.channel;
        let user_id = req.body.user_id;
	if (channelMap.has(channel)){
		if (channelOwner.get(channel) === user_id)? channelMap.delete(channel): console.log("Usted no es el dueño");
		//If then else
	}
	else {
		console.log("El canal no existe");
	}

	console.log("nombre canal eliminado: "+channel + "por el usuario" + user_id );
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
				MessageHandler(req, res);
			}
			if (url === "/create") {
				createChannel(req,res);
			}
			if (url === "/delete"){
				deleteChannel(req, res);
			}
			if (url === "/getMessages") {
				getMessages(req,res);
}
			break;
	}

});

server.listen(3000);
console.log('Server on port', 3000);

