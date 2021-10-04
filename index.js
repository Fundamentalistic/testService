const ws = require('ws');

const wServer = new ws.Server({port: 8000});

const fsyms = ["BTC", "XRP", "ETH", "BCH", "EOS", "LTC", "XMR", "DASH"];
const tsyms = ["USD", "EUR", "GBP", "JPY", "RUR"];

function calculateDifference(from, to){
	let response = {};
	response[to] = {
			"CHANGE24HOUR": "$ -13.25",
			"CHANGEPCT24HOUR": "-0.18",
			"OPEN24HOUR": "$ 7,299.12",
			"VOLUME24HOUR": "Ƀ 47,600.1",
			"VOLUME24HOURTO": "$ 348,033,250.5",
			"HIGH24HOUR": "$ 7,426.64",
			"PRICE": "$ 7,285.87",
			"FROMSYMBOL": "Ƀ",
			"TOSYMBOL": "$",
			"LASTUPDATE": "Just now",
			"SUPPLY": "Ƀ 18,313,937.0",
			"MKTCAP": "$ 133.43 B"
		};
	return response;
}

wServer.on('connection', (client) => {
	client.send(JSON.stringify({'status': 'connected'}));
	client.on('message', (message) => {
		try{
			var json = JSON.parse(message);
		}catch(err){
			console.log("JSON parsig error");
			console.log(err);
			return;
		}
		if (!Array.isArray(json.fsyms) || !Array.isArray(json.tsyms)){
			console.log("Not array");
			console.log(json);
			return;
		}
		console.log(message);
		client.send("start exchange");
		tsyms.forEach(tsym => {
			fsyms.forEach(fsym => {
				client.send(JSON.stringify(calculateDifference(tsym, fsym)));
			});
		});

	});
	client.on('close', () => {
		console.log("User is disconnected");
	});
});
