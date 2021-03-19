const https = require('http')
const fs = require("fs")

const rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
var AuthUser="";


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
function auth(){

rl.question('login or register ', answer => {
  // TODO: Log the answer in a database

var args2 = answer.trim().replace(/  +/g, ' ');
args2 = args2.split(/\s+/); //Split by space

if (args2.length >= 1 ){
        switch (args2[0]) {
                case "login":
                        rl.question('enter username and password ', answer => {
                          // TODO: Log the answer in a database
                        var args2 = answer.trim().replace(/  +/g, ' ');
                        args2 = args2.split(/\s+/); //Split by space
                        var username = args2[0];
                        var password = args2[1];
                        console.log(username + password);
                        var user= false;
                        fs.readFile("auth.txt", 'utf8', (error, datos) => {
                         if (error) throw error;
                        datos = datos.split(/\n/g);
                        var i = 0;
                        while(user == false && i< datos.length){
                                console.log(i);
                                console.log(datos.length);
                                 args2 = datos[i].split(/\s+/);
                                if(username == args2[0] && password== args2[1])
                                user = true;
                        i++;
                        }
                        if(user == true){
                        AuthUser= username
                        }
                        console.log(AuthUser);

                        });
                        });
                        break;
                case "register":
                        console.log("register 2 ");
                        break;
                default :
                        break;
}
}
});
}
var recursiveAsyncReadLine = function () {


rl.question('What is the message? ', message => {

if (message == 'exit')
	return readline.close();

var args = message.trim().replace(/  +/g, ' ');
args = args.split(/\s+/); //Split by space


if (args.length >= 2 ){
	var to_send= "";
	switch (args[0]) {
		case "pull":
			options.path   = '/getMessages'+args[1];
			options.method = 'GET';
			break;
		case "send":
			console.log("segundo");
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
			console.log("None of the methods were valid");
			//recursiveAsyncReadLine(); //Does nothing and writes error, no estoy seguro si esto debería hacerlo así porque volvería a llamar la función , hmm, veremos.

}

 // If it enters the switch, then it will do this, right?
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
	console.log("Expected 2 arguments");
}
recursiveAsyncReadLine();

	});
};
auth();
recursiveAsyncReadLine();

