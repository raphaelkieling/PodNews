require('dotenv').config();

const fs           = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');

class Voice{
    constructor(){
        this.client = new textToSpeech.TextToSpeechClient();
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

    async run({ data }){
        for(let source of data){
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

                await fs.writeFileSync("C:\\Users\\rapha\\Projects\\PodNews\\temp\\"+Math.random().toString()+'.mp3', audioBinary, 'binary')
            }

            await fs.writeFileSync("C:\\Users\\rapha\\Projects\\PodNews\\temp\\"+Math.random().toString()+'.mp3', source.audio.title, 'binary')
            await fs.writeFileSync("C:\\Users\\rapha\\Projects\\PodNews\\temp\\"+Math.random().toString()+'.mp3', source.audio.description, 'binary')
            
        }

        return data;
    }
}

module.exports = Voice