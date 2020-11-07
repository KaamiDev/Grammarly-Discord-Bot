// load env variables
require('dotenv').config();

// require modules
const { correct, Grammarly } = require('@stewartmcgown/grammarly-api');
const Discord = require('discord.js');
const axios = require('axios');

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

// message template functions for reples
const createMessage = (desc, name, image) => {
	return new Discord.MessageEmbed().setAuthor(name, image).setColor('#00D632').setDescription(desc);
};

const createErr = (desc, name, image) => {
	return new Discord.MessageEmbed().setAuthor(name, image).setColor('#F8453C').setDescription(desc);
};

const createWarning = (desc, name, image) => {
	return new Discord.MessageEmbed().setAuthor(name, image).setColor('#e0c709').setDescription(desc);
};

// listen for discord commands
client.on('message', async (message) => {
	// check for prefix in command
	if (message.content.slice(0, 2) === 'g!') {
		// extract prefix from command
		message.content = message.content.slice(2);

		// check for specific commands
		if (message.content === 'help') {
			// display help embed
			message.channel.send(
				new Discord.MessageEmbed()
					.setColor('#5BD5B8')
					.setTitle('Grammarly Bot')
					.setDescription('The perks of grammarly from right here on discord!')
					.setThumbnail('https://imgur.com/lh3fO0H.png')
					.addField(
						'How to Use',
						'`g!correct <raw pastebin>` - Bot will scan the link for errors and DM you a corrected text file.'
					)
					.setTimestamp()
					.setFooter('Grammarly Bot', 'https://imgur.com/lh3fO0H.png')
			);
		} else if (message.content.split(' ')[0] === 'correct') {
			// extract link from command
			let link = message.content.split(' ')[1];

			// make sure link exists
			if (link) {
				// send progress message
				let progress = await message.channel.send(
					createWarning(
						'Your request is being processed...',
						message.member.user.tag,
						message.member.user.avatarURL()
					)
				);

				axios
					.get(link)
					.then((response) => {
						// get text from response
						let text = response.data;

						// make sure it's not html
						if (text.includes('<')) {
							// if invalid link, send error
							progress.edit(
								createErr(
									'Error correcting text.\nInvalid link was provided.',
									message.member.user.tag,
									message.member.user.avatarURL()
								)
							);
						} else {
							// correct text using grammarly API
							grammarly.analyse(text).then(correct).then((res) => {
								// send corrected text as txt file to user
								message.author.send({
									files: [
										{
											attachment: Buffer.from(res.corrected || res.original, 'utf-8'),
											name: 'corrected_text' + Date.now() + '.txt'
										}
									]
								});

								// send success message in channel
								progress.edit(
									new Discord.MessageEmbed()
										.setColor('#5BD5B8')
										.setTitle('Corrected successfully!')
										.setDescription('Your text has been corrected successfully! Check your DMs!')
										.setAuthor(message.member.user.tag, message.member.user.avatarURL())
										.setTimestamp()
										.setFooter('Grammarly Bot', 'https://imgur.com/lh3fO0H.png')
								);
							});
						}
					})
					.catch((err) => {
						// if invalid link, send error
						progress.edit(
							createErr(
								'Error correcting text.\nInvalid link was provided.',
								message.member.user.tag,
								message.member.user.avatarURL()
							)
						);
					});
			} else {
				// if invalid link, send error
				message.channel.send(
					createErr(
						'Error correcting text.\nInvalid link was provided.',
						message.member.user.tag,
						message.member.user.avatarURL()
					)
				);
			}
		}
	}
});

// authenticate discord
client.login(process.env.TOKEN);
