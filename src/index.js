require('dotenv').config();

const chalk            = require('chalk');
const RobotCrawler     = require('./robots/crawler');
const RobotVoice       = require('./robots/voice');
const RobotFileManager = require('./robots/file-manager');
const RobotAudio       = require('./robots/audio');
const Commander        = require('./commander');
const print            = require('./utils/print');

// Crawlers
const Globo = require('./crawlers/globo');

async function Init(){
	let { limit } = Commander.init();

	let robotCrawler = new RobotCrawler({ 
		crawlers: [ new Globo({ limit }) ] 
	})
	   
	// Robots 
	let manager = new RobotFileManager();

	const ROBOTS = {
		crawler: robotCrawler,
		voice: new RobotVoice(),
		manager,
		audio: new RobotAudio({ fileManager: manager })
	}

	// Init
	print.banner('INIT', 'Podnews')

	console.log(chalk.yellow('1 - Clean temporary folder'));
	await ROBOTS.manager.resetTempDirectory();
	print.line('yellow');

	let data = {};

	console.log(chalk.yellow('2 - Crawler'));
	data = await ROBOTS.crawler.getAllNews();
	print.line('yellow');


	console.log(chalk.yellow('3 - Text to Speech'));
	data = await ROBOTS.voice.getDataWithAudio({ data });
	print.line('yellow');

	console.log(chalk.yellow('4 - Concat audio'));
	data = await ROBOTS.audio.concatAudio({ data });
	print.line('yellow');
	
}

module.exports = {
	init: Init
}