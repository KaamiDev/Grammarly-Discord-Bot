// load env variables
require('dotenv').config();

// require modules
const { correct, Grammarly } = require('@stewartmcgown/grammarly-api');

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
	console.log('Using grammarly FREE');
} else {
	// setup grammarly free
	grammarly = new Grammarly();
	console.log('Using grammarly FREE');
}

// test text
const text = `When we have shuffled off this mortal coil,
Must give us pause - their's the respect
That makes calamity of so long life.`;

grammarly.analyse(text).then(correct).then((res) => console.log(res.corrected));
