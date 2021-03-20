const https = require('http')
const fs = require("fs")

const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
var AuthUser = "";
var cont = 1;
var state = "";
var user_id = 0;
const options = {
	hostname: 'ec2-52-4-113-182.compute-1.amazonaws.com',
	port: 3000,
	path: '/send',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	}
}

function log_res(text) {
	state = (text == "login") ? "login" : "register"; //If then else case
	++cont;
	console.log("Please type username and password in the same line separated by space");
}

function auth(username, password) {
	var user = false;
	var text = "";
	switch (state) {
		case "login":
			fs.readFile("/home/ec2-user/Proyecto1/src/auth.txt", 'utf8', (error, datos) => {
				if (error) throw error;
				datos = datos.split(/\n/g);
				var i = 0;
				while (user == false && i < datos.length) {
					args2 = datos[i].split(/\s+/);
					if (username == args2[0] && password == args2[1]) {
						user = true;
						user_id = i;
						++cont;
					}
					i++;
				}
				if (user == true) {
					AuthUser = username;
					console.log("Log-in success");
				} else {
					console.log("User unfound");
				}
			});
			break;
		case "register":
			var exist;
			var userR = false;
			fs.readFile("/home/ec2-user/Proyecto1/src/auth.txt", 'utf8', (error, datos) => {
				if (error) throw error;
				text = datos;
				datos = datos.split(/\n/g);
				var j = 0;
				while (userR == false && j < datos.length) {

					args2 = datos[j].split(/\s+/);
					if (username == args2[0]) {
						exist = true;
						userR = true;
						cont = 1;
						console.log("Please, say what you want to do, if login or register");
					}
					j++;
				}
				if (j == datos.length && userR == false) {
					exist = false;
				}
				if (exist == false) {
					++cont;
					text = text + username + " " + password + "\n";
					fs.writeFile("/home/ec2-user/Proyecto1/src/auth.txt", text, 'utf8', function (err) {
						if (err) {
							console.err(err);
						} else {
							console.log("user registered");
						}
					});
				}

			});
			break;
	}
}

function createRequest(args) {
	valid = true; //Confirmar si el mensaje es válido
	var to_send = "";
	let command= args[0];
	switch (command) {
		case "pull":
			options.path = '/getMessages' + args[1];
			options.method = 'GET';
			break;
		case "send":
			var element = "";
			for (var i = 2; i < args.length; i++) {
				element = element + args[i] + " ";
			}
			options.path = '/send';
			options.method = 'POST';
			to_send = element;
			break;
		case "create":
			//options.path = '/POST';
			console.log("create");
			break;
		case "delete":
			//options.path = '/delete'+args[1];
			console.log("delete");
			break;

		default:
			valid = false;
			console.log("None of the methods were valid");
			break;
	}

	if (valid) {
		console.log("es valido...");
		var data = JSON.stringify({
			to_send
		});

		const req = https.request(options, res => {
			console.log(`statusCode: ${res.statusCode}`)

			res.on('data', d => {
				process.stdout.write(d)
			})
		})
		req.on('error', error => {
			console.error(error)
		})

		req.write(data);
		req.end();
	}

	else {
		console.log(
			"Valid messages: \n send <channel> <Message>\n create <channel>\n delete <channel> \n get <channel>  ");
	}

}

var recursiveAsyncReadLine = function () {
	rl.question('What do you want to do?', message => {
		if (message == 'exit')
			return rl.close();
		var args = message.trim().replace(/  +/g, ' ');
		args = args.split(/\s+/); //Split by space

		if (cont == 1 && (args[0] == "login" || args[0] == "register")) {
			log_res(args[0]);
		}
		else if (cont == 2 && args.length == 2) {
			var username = args[0];
			var password = args[1];
			auth(username,password);
		}
		if (args.length >= 2 && cont > 2) {
			createRequest(args);
		}
		recursiveAsyncReadLine();
	});
};

recursiveAsyncReadLine();

