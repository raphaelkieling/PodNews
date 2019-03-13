require('dotenv').config();

const chalk            = require('chalk');
const RobotCrawler     = require('./robots/crawler');
const RobotVoice       = require('./robots/voice');
const RobotFileManager = require('./robots/file-manager');
const RobotAudio       = require('./robots/audio');
const Commander        = require('./commander');
const print            = require('./utils/print');
const ora              = require('ora');
// Crawlers
const Globo = require('./crawlers/globo');
const Folha = require('./crawlers/folha');

async function load(text, fn){
	let loader = ora(text).start();
	await fn(loader);
	loader.succeed();
} 

async function Init(){
	let { limit } = Commander.init();

	let data = {};
	
	let manager = new RobotFileManager();
	
	let robotCrawler = new RobotCrawler({ 
		crawlers: [ 
			new Globo({ limit }),
			new Folha({ limit })
		] 
	})

	const ROBOTS = {
		crawler: robotCrawler,
		voice: new RobotVoice(),
		manager,
		audio: new RobotAudio({ fileManager: manager })
	}

	// Init
	print.banner('INIT', 'Podnews')

	await load('1 - Clean temporary folder',async () => {
		await ROBOTS.manager.resetTempDirectory();
	});

	await load('2 - Crawler',async (loader) => {
		ROBOTS.crawler.loader = loader;
		data = await ROBOTS.crawler.getAllNews();
	});

	await load('3 - Text to Speech',async (loader) => {
		ROBOTS.voice.loader = loader;

		audioIntroBinary  = await ROBOTS.voice.getIntro();
		data = await ROBOTS.voice.getDataWithAudio({ data, audioIntroBinary });
	});

	await load('4 - Concat audio',async (loader) => {
		data = await ROBOTS.audio.concatAudio({ data });
	});
}

module.exports = {
	init: Init
}