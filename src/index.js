const http = require('http');

const { bodyParser } = require('./lib/bodyParser');
let messages = [];

async function MessageHandler(req,res) {
	try {
		await bodyParser(req);
		console.log(req.body);
		messages.push(req.body);
		res.writeHead(200,{'Content-Type': 'application/json'});
        	res.write(JSON.stringify({message: 'Mensaje recibido'}));
	        res.end();
	}catch(error) {
                res.writeHead(200,{'Content-Type': 'text/plain'});
                res.write('Invalid data');
                res.end();

	}

}
function getMessages(req,res) {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.write(JSON.stringify(messages));
	res.end();

}
const server = http.createServer((req, res)=>{
	const  {url, method} = req;

	//LOGGER
	console.log(`URL: ${url} - Method: ${method}`);

        switch(method) {
	        case "GET":
        	        if (url === "/") {
       				res.writeHead(200,{'Content-Type': 'application/json'});
        			res.write(JSON.stringify({message: 'Hello world'}));
        			res.end();
        			}
                        if (url === "/getAllMessages") {
                                getMessages(req,res);
                                }

//	        case "PUT": Creo que no es necesario porque PUT es actualizar

        	case "POST":
			if ( url === "/send"){
				MessageHandler(req,res);
			}
//	        case "DELETE": Añadir este
//        	default:
}

})

server.listen(3000);
console.log('Server on port', 3000);

