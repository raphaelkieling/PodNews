const chalk = require('chalk');

function banner(prefix, text){
	console.log(chalk.green('--------------'));
    console.log(chalk.green(`${prefix.toUpperCase()} ${text}`));
    console.log(chalk.green('--------------'));
}

function line(color){
	console.log(chalk[color]('--------------'));
}

module.exports = {
	banner,
	line
}