const http = require('http');

const { bodyParser } = require('./lib/bodyParser');
//let messages = [];

const Queue = require('./queue');
//var colaprueba = new Queue();

async function MessageHandler(req, res) {
	try {
		await bodyParser(req);
		//		messages.push(req.body);
		//colaprueba.ponerenCola(req.body);
		//console.log(colaprueba.mostrar());
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({ message: 'Mensaje recibido' }));
		res.end();
	} catch (error) {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.write(error);
		res.end();

	}
	//	colaprueba.ponerenCola(req.body);
	//	console.log("then");
	//	console.log(colaprueba.mostrarCola());

}
function getMessages(req, res) {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify(messages));
	res.end();

}

function createChannel(req, res) {
	console.log("nombre canal: ");
	console.log(res);
}

function deleteChannel(req, res) {
	console.log("nombre canal: ");
	console.log(res);	
}

const server = http.createServer((req, res) => {
	const { url, method } = req;

	//LOGGER
	console.log(`URL: ${url} - Method: ${method}`);

	switch (method) {
		case "GET":
			if (url === "/") {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({ message: 'Hello world' }));
				res.end();
				break;
			}
			if (url === "/getAllMessages") {
				getMessages(req, res);
				break;
			}

		//	        case "PUT": Creo que no es necesario porque PUT es actualizar

		case "POST":
			if (url === "/send") {
				MessageHandler(req, res);
				break;
			}
			if (url === "/create") {
				createChannel(req, res);
				break;
			}
		case "DELETE":
				deleteChannel(req, res);
				res.split("?");
				break;
	}

})

server.listen(3000);
console.log('Server on port', 3000);

