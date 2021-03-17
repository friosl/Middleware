const https = require('http')

const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

//readline.setPrompt('OHAI> ');

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

readline.question('What is the message? ', message => {
if (message == 'exit')
	return readline.close();

var data = JSON.stringify({
        message
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

recursiveAsyncReadLine();

	});
};

recursiveAsyncReadLine();

