const program = require('commander');

function init(){
	program
	  .version('0.1.0')
	  .option('-l, --limit [limit]', 'Limit notices')
	  .parse(process.argv);

	return program;
}

module.exports = {
	init: init
};