const http = require('http');

const { bodyParser } = require('./lib/bodyParser');
let messages = [];

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
	
        let channel = req.body.channel;
        let user_id = req.body.user_id;
	let message = req.body.to_send;

        console.log("nombre canal creado: "+channel+ " por el usuario "+ user_id+ " mensaje " + message);

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
        try {
                await bodyParser(req);
        }
        catch (error) {
                console.log("error en bodyP");
        }
        let channel = req.body.channel;
        let user_id = req.body.user_id;


	console.log("nombre canal creado: "+channel+ " por el usuario "+ user_id);


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
				createChannel(req,res);
			}
			if (url === "/delete"){
				deleteChannel(req, res);
			}
			break;
	}

});

server.listen(3000);
console.log('Server on port', 3000);

