const fs     = require('fs');
const path   = require('path');
const audioconcat = require('audioconcat');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

class Audio{
	constructor({ fileManager }){
		this.fileManager = fileManager;
		this.loader      = null;
	}

	async saveAudio(name, binary){
		let pathWithName = path.resolve(this.fileManager.getPathTemp(), `${name}.mp3`);
		await fs.writeFileSync(pathWithName, binary, 'binary');
		return pathWithName;
	}

	_concatAudio(songs){
		return new Promise((resolve ,reject)=>{
			audioconcat(songs)
				.concat(path.resolve(this.fileManager.getPathTemp(), 'all.mp3'))
				.on('start', (command) => {
					this.loader.text = `⚙️	Concat start`;
					resolve();
				})
				.on('error', (err, stdout, stderr) => {
					new Error(err)
					resolve();
				})
				.on('end', (output) => {
					this.loader.text = `⚙️	Concat finished: ${output}`;
					resolve();
				})
		})
	}

	async concatAudio({ data, audioIntroBinary }){
		let size = data.length;
        let count = 0;
		let audiosToConcat = [
			await this.saveAudio('intro', audioIntroBinary)
		];

		for(let source of data){
			this.loader.text = `⚙️	(${size}/${++count}) ~> ${source.title.slice(0, 15)}...`;

        	audiosToConcat.push(await this.saveAudio(Math.random().toString(), source.audio.title));
        	audiosToConcat.push(await this.saveAudio(Math.random().toString(), source.audio.description));

        	for(let sentence of source.audio.sentences){
				audiosToConcat.push(await this.saveAudio(Math.random().toString(), sentence.audio));
			}
			
			await this._concatAudio(audiosToConcat);
		}
	}
}

module.exports = Audio;