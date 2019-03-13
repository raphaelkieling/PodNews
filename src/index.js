require('dotenv').config();

const chalk         = require('chalk');
const RobotCrawler  = require('./robots/crawler');
const RobotVoice    = require('./robots/voice');
const Commander     = require('./commander');
const print         = require('./utils/print');

// Crawlers
const Globo = require('./crawlers/globo');

async function Init(){
	let { limit } = Commander.init();

	let robotCrawler = new RobotCrawler({
	    crawlers: [ new Globo({ limit }) ]
	})
	   
	// Robots 
	const ROBOTS = {
		crawler: robotCrawler,
		voice: new RobotVoice()
	}

	print.banner('INIT', 'Podnews')

	let data = {};
	console.log(chalk.yellow('1 - Crawler'));
	data = await ROBOTS.crawler.run();
	print.line('yellow');
	console.log(chalk.yellow('2 - Text to Speech'));
	data = await ROBOTS.voice.run({ data });

	console.log(data);
}

module.exports = {
	init: Init
}