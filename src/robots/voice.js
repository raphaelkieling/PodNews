require('dotenv').config();

const textToSpeech = require('@google-cloud/text-to-speech');
const print        = require('../utils/print')

class Voice{
    constructor(){
        this.client = new textToSpeech.TextToSpeechClient();
        this.intro  = process.env.VOICE_INTRO;
        this.loader = null;
    }

    async getIntro(){
        this.loader.text = `🔈  Get Intro`;
        return await this.textToAudioFile(this.intro);
    }
    
    /**
     * @description  Transform text from google textSpeech api to audio to save.
     * @param {string} text string to google text speech 
     * @returns {Promise} Promise object and resolve represents audio from api
     */
    textToAudioFile(text){
        if(!text) return null;

        return new Promise((resolve, reject)=>{
            const request = {
                input: { text: text },
                voice: { languageCode: 'pt-BR', ssmlGender: 'male' },
                audioConfig: { audioEncoding: 'MP3' },
            };
            
            this.client.synthesizeSpeech(request, (err, response) => {
                if (err) reject(err);
                resolve(response ? response.audioContent : null);
            });
        })
    }

    async getDataWithAudio({ data }){
        let size = data.length;
        let count = 0;

        for(let source of data){
            this.loader.text = `🔈  (${size}/${++count}) ~> ${source.title.slice(0, 15)}...`;
            source.audio = {};
            source.audio.title = await this.textToAudioFile(source.title);
            source.audio.description = await this.textToAudioFile(source.description);
            source.audio.sentences = [];

            for(let sentence of source.sentences){
                let audioBinary = await this.textToAudioFile(sentence);
                source.audio.sentences.push({
                    text: sentence,
                    audio: audioBinary
                });

            }
        }

        return data;
    }
}

module.exports = Voice