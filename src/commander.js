const program = require('commander');
const pjson   = require('../package.json')

function init(){
	program
	  .version(pjson.version)
	  .option('-l, --limit <limit>', 'Limit notices')
	  .option('-i, --language [language]', 'Set the language', /^(pt|en)$/i)
	  .parse(process.argv);

	return program;
}

module.exports = {
	init: init
};