const chalk = require('chalk');

function banner(prefix, text){
	console.log(chalk.green('--------------'));
    console.log(chalk.green(`${prefix.toUpperCase()} ${text}`));
    console.log(chalk.green('--------------'));
}

function line(color){
	console.log(chalk[color]('--------------'));
}

function message(text){
	console.log(chalk.yellow(text));
}

module.exports = {
	banner,
	line,
	message
}