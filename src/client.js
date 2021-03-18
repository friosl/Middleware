const https = require('http')


const rl = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});



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

recursiveAsyncReadLine();

