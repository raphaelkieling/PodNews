require('dotenv').config();

const RobotCrawler     = require('./robots/crawler');
const RobotVoice       = require('./robots/voice');
const RobotFileManager = require('./robots/file-manager');
const RobotAudio       = require('./robots/audio');
const RobotNews        = require('./robots/news');
const RobotImage       = require('./robots/image');
const Commander        = require('./commander');
const print            = require('./utils/print');
const ora              = require('ora');
const prompts          = require('prompts');

// Crawlers
const Globo = require('./crawlers/globo');
const Folha = require('./crawlers/folha');

async function load(text, fn){
	let loader = ora(text).start();
	await fn(loader);
	loader.succeed();
} 

async function answerLanguage(){
	let result = await prompts({
		type: 'select',
		name: 'value',
		message: 'Choice a language',
		choices: [
			{ title: 'pt-BR', value: 'pt-BR' },
			{ title: 'en', value: 'en' }
		]
	})

	return result.value;
}

async function answerLimitNews(){
	let response = await prompts({
		type: 'number',
		name: 'limit',
		message: 'What is the limit of news?',
		initial: 1
	});

	return response.limit;
}

async function answerSearchValue(){
	let result = await prompts({
		type: 'text',
		name: 'value',
		message: 'Type a search to news'
	})

	return result.value;
}

async function answerCategory(){
	let response = await prompts({
		type: 'text',
		name: 'category',
		message: 'What is the category?',
		initial: ''
	});

	return response.category;
}

async function Init(){
	let { limit, language, category, searchTerm } = Commander.init();
	
	// Init
	print.banner('INIT', 'Podnews')

	if(!limit) limit = await answerLimitNews();
	if(!language) language = await answerLanguage();
	if(!category) category = await answerCategory();
	if(!searchTerm) searchTerm = await answerSearchValue();

	
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
		news: new RobotNews({ limit, language, category }),
		voice: new RobotVoice({ language }),
		manager,
		audio: new RobotAudio({ fileManager: manager }),
		image: new RobotImage({ fileManager: manager })
	}

	await load('1 - Clean temporary folder',async () => {
		await ROBOTS.manager.resetTempDirectory();
	});

	// await load('2 - Crawler',async (loader) => {
	// 	ROBOTS.crawler.loader = loader;
	// 	data = await ROBOTS.crawler.getAllNews();
	// });

	await load('2 - Get news from Google News', async (loader)=> {
		ROBOTS.news.loader = loader;
		data = await ROBOTS.news.getNews({ searchTerm });
	})

	await load('3 - Text to Speech',async (loader) => {
		ROBOTS.voice.loader = loader;
		data = await ROBOTS.voice.getDataWithAudio({ data });
	});

	await load('4 - Create thumb image',async (loader) => {
		ROBOTS.image.loader = loader;
		await ROBOTS.image.getImage({ searchTerm: searchTerm || data[0].title });
	});

	await load('5 - Concat audio',async (loader) => {
		ROBOTS.audio.loader = loader;
		let audioIntroBinary  = await ROBOTS.voice.getIntro();

		await ROBOTS.audio.concatAudio({ data, audioIntroBinary });
	});
}

module.exports = {
	init: Init
}