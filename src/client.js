const https = require('http')
const fs = require("fs")

const rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
var AuthUser="";
var cont=1;
var state= "";
var user_id=0;
const options = {
  hostname: 'ec2-52-4-113-182.compute-1.amazonaws.com',
  port: 3000,
  path: '/send',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
   //, 'Content-Length': data.length
  }
}


var recursiveAsyncReadLine = function () {
rl.question('What do you want to do?', message => {
var valid = true;
if (message == 'exit')
	return rl.close();

var args = message.trim().replace(/  +/g, ' ');
args = args.split(/\s+/); //Split by space

if(cont == 1 && (args[0] == "login" ||args[0] == "register")){
	console.log("El argumento es login o register, nice");
        state = (args[0]== "login")?"login":"register"; //Esto funcionará? XD Es un if then else.
	console.log("Please type username and then password");
	++cont;
}
else if (cont == 2){
	console.log("Contador es 2.");
	++cont;
	var username = args[0];
	var password = args[1];
	var user= false;
	switch (state) {
		case "login":
		fs.readFile("/home/ec2-user/Proyecto1/src/auth.txt", 'utf8', (error, datos) => {
                if (error) throw error;
                datos = datos.split(/\n/g);
                var i = 0;
                while(user == false && i< datos.length){
                	console.log(i);
                        console.log(datos.length);
                        args2 = datos[i].split(/\s+/);
                        if(username == args2[0] && password== args2[1])
                        	user = true;
				user_id= i;
                        	i++;
                        }
                        if(user == true){
                        	AuthUser= username;
                        }
                        console.log(AuthUser);
			console.log("Entra a login ");
                        });
			break;
		case "register":
			console.log("register");
			break;
		default:
			console.log("Si entra aquí, la cagué");
			break;
	}
}
if (args.length >= 2 && cont>2 ){
	var to_send= "";
	console.log("llega a alguno de estos no");
	switch (args[0]) {
		case "pull":
			options.path   = '/getMessages'+args[1];
			options.method = 'GET';
			break;
		case "send":
			console.log("aqui debe entrar");
			var element = "";
			for(var i = 2;i<args.length; i++){
				 element =  element + args[i]+" ";
			} 
			console.log(element);
			options.path   = '/send';
			options.method = 'POST';
			to_send=element;
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
			valid=false;
			console.log("None of the methods were valid");
			break;
			//recursiveAsyncReadLine(); //Does nothing and writes error, no estoy seguro si esto debería hacerlo así porque volvería a llamar la función , hmm, veremos.

}
if (valid){
console.log("es valido...") ;
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
}
else {
	console.log("Expected 2 arguments or error in typo");
}

recursiveAsyncReadLine();

	});
};


recursiveAsyncReadLine();

