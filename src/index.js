require('dotenv').config();

const RobotCrawler     = require('./robots/crawler');
const RobotVoice       = require('./robots/voice');
const RobotFileManager = require('./robots/file-manager');
const RobotAudio       = require('./robots/audio');
const RobotNews        = require('./robots/news');
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
		news: new RobotNews({ limit }),
		voice: new RobotVoice(),
		manager,
		audio: new RobotAudio({ fileManager: manager })
	}

	// Init
	print.banner('INIT', 'Podnews')

	await load('1 - Clean temporary folder',async () => {
		await ROBOTS.manager.resetTempDirectory();
	});

	// await load('2 - Crawler',async (loader) => {
	// 	ROBOTS.crawler.loader = loader;
	// 	data = await ROBOTS.crawler.getAllNews();
	// });

	await load('2 - Get news from Google News', async ()=> {
		data = await ROBOTS.news.getNews();
	})

	await load('3 - Text to Speech',async (loader) => {
		ROBOTS.voice.loader = loader;

		data = await ROBOTS.voice.getDataWithAudio({ data });
	});

	await load('4 - Concat audio',async (loader) => {
		ROBOTS.audio.loader = loader;
		let audioIntroBinary  = await ROBOTS.voice.getIntro();

		data = await ROBOTS.audio.concatAudio({ data, audioIntroBinary });
	});
}

module.exports = {
	init: Init
}