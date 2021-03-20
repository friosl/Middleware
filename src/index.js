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
async function getMessages(req, res) {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify(messages));
	res.end();

}

async function createChannel(req, res) {
	
	console.log("nombre canal creado: ");

}

async function deleteChannel(req, res) {
	 try {
                await bodyParser(req);
	}catch (error) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.write(error);
                res.end();
	}
		console.log("nombre canal eliminado: ");
		console.log(req.body);	
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
				
			}
			if (url === "/getAllMessages") {
				getMessages(req, res);
				
			}
			break;
		//	        case "PUT": Creo que no es necesario porque PUT es actualizar

		case "POST":
			if (url === "/send") {
				MessageHandler(req, res);
			
			}
			if (url === "/create") {
				console.log("entro a create");
                                console.log("es res"+res);
				createChannel(req, res);
				
			}
			break;
		case "DELETE":
				if(url === "/delete"){
				deleteChannel(req, res);
				}
				break;
	}

})

server.listen(3000);
console.log('Server on port', 3000);

