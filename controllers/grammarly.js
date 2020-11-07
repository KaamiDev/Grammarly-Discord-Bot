const { correct, Grammarly } = require('@stewartmcgown/grammarly-api');

const text = `When we have shuffled off this mortal coil,
Must give us pause - their's the respect
That makes calamity of so long life.`;

const free = new Grammarly();

free.analyse(text).then(correct).then((res) => console.log(res));
