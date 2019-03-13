const program = require('commander');
const pjson   = require('../package.json')

function init(){
	program
	  .version(pjson.version)
	  .option('-l, --limit [limit]', 'Limit notices')
	  .parse(process.argv);

	return program;
}

module.exports = {
	init: init
};