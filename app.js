// load env variables
require('dotenv').config();

// require modules
const { correct, Grammarly } = require('@stewartmcgown/grammarly-api');
const Discord = require('discord.js');

// initialize grammarly api
let grammarly;
if (process.env.GRAUTH && process.env.CSRF_TOKEN) {
	// setup grammarly premium
	grammarly = new Grammarly({
		auth: {
			grauth: process.env.GRAUTH,
			'csrf-token': process.env.CSRF_TOKEN
		}
	});
	console.log('Using Grammarly PREMIUM');
} else {
	// setup grammarly free
	grammarly = new Grammarly();
	console.log('Using Grammarly FREE');
}

// initialize discord api
const client = new Discord.Client();
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

// listen for discord commands
client.on('message', (message) => {
	// check for prefix in command
	if (message.content.slice(0, 2) === 'g!') {
		// extract prefix from command
		message.content = message.content.slice(2);

		// check for specific commands
		if (message.content === 'help') {
		}
	}
});

// grammarly.analyse(text).then(correct).then((res) => console.log(res.corrected));

// authenticate discord
client.login(process.env.TOKEN);
