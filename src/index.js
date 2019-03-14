require('dotenv').config({
	path: require('path').resolve(__dirname, '../.env')
});

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
	await fn(loader, (done=true,message=text)=>{
		if(done)
			loader.succeed();
		else
			loader.fail(message);
	});
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

async function selectNews(news){
	if(!news) throw new Error('Not has news to work');

	let sanitizedNews = [];
	for(let newObj of news){
		sanitizedNews.push({ title: newObj.title, value: newObj });
	}

	let result = await prompts({
		type: 'multiselect',
		name: 'value',
		message: 'Choice a new',
		choices: sanitizedNews
	})

	return result.value;
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
		news: new RobotNews({ limit, language, category , credential: process.env.GOOGLE_NEWS_CREDENTIAL }),
		voice: new RobotVoice({ language }),
		manager,
		audio: new RobotAudio({ fileManager: manager }),
		image: new RobotImage({ fileManager: manager })
	}

	await load('0 - Clean temporary folder',async (loader, done) => {
		await ROBOTS.manager.resetTempDirectory();
		done();
	});

	let dataNews = [];

	await load('1 - Crawler',async (loader, done) => {
		ROBOTS.crawler.loader = loader;
		dataNews = dataNews.concat(await ROBOTS.crawler.getAllNews())
		done();
	});

	await load('2 - Get news from Google News', async (loader, done)=> {
		ROBOTS.news.loader = loader;
		dataNews = dataNews.concat(await ROBOTS.news.getNews({ searchTerm }));
		done();
	})

	dataNews = await selectNews(dataNews);

	let dataTextToSpeech = {};

	await load('3 - Text to Speech',async (loader, done) => {
		ROBOTS.voice.loader = loader;
		dataTextToSpeech = await ROBOTS.voice.getDataWithAudio({ data: dataNews });
		done();
	});

	await load('4 - Concat audio',async (loader, done) => {
		ROBOTS.audio.loader = loader;
		let audioIntroBinary  = await ROBOTS.voice.getIntro();

		await ROBOTS.audio.concatAudio({ data: dataTextToSpeech, audioIntroBinary });
		done();
	});

	await load('5 - Create thumb image',async (loader, done) => {
		if(!process.env.GOOGLE_IMAGES_CSE_KEY || !process.env.GOOGLE_KEY) {
			done(false, 'Google KEYS not defineds');
			return;
		};
		
		ROBOTS.image.init();
		ROBOTS.image.loader = loader;
		await ROBOTS.image.getImage({ searchTerm: dataNews[0].title || searchTerm });
		done();
	});
}

module.exports = {
	init: Init
}