const fs    = require('fs');
const print = require('../utils/print')

class Audio{
	constructor({ fileManager }){
		this.fileManager = fileManager;
	}

	async concatAudio({ data }){
		console.log('');

		let size = data.length;
        let count = 0;

		for(let source of data){
			print.message(`~>  Processig ${++count}/${size}`);

        	await fs.writeFileSync(`${this.fileManager.getPathTemp()}/${Math.random().toString()}.mp3`, source.audio.title, 'binary')
        	await fs.writeFileSync(`${this.fileManager.getPathTemp()}/${Math.random().toString()}.mp3`, source.audio.description, 'binary')

        	for(let sentence of source.sentences){
	        	await fs.writeFileSync(`${this.fileManager.getPathTemp()}/${Math.random().toString()}.mp3`, sentence, 'binary')
        	}
		}
	}
}

module.exports = Audio;