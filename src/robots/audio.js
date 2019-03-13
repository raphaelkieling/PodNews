const fs    = require('fs');
const print = require('../utils/print');
const path  = require('path');

class Audio{
	constructor({ fileManager }){
		this.fileManager = fileManager;
	}

	async saveAudio(name, binary){
		let pathWithName = path.resolve(this.fileManager.getPathTemp(), `${name}.mp3`);
		return await fs.writeFileSync(pathWithName, binary, 'binary');
	}

	async concatAudio({ data, audioIntroBinary }){
		await this.saveAudio('intro', audioIntroBinary);

		let size = data.length;
        let count = 0;

		for(let source of data){
        	await this.saveAudio(Math.random().toString(), source.audio.title);
        	await this.saveAudio(Math.random().toString(), source.audio.description);

        	for(let sentence of source.audio.sentences){
				await this.saveAudio(Math.random().toString(), sentence.audio);
        	}
		}
	}
}

module.exports = Audio;