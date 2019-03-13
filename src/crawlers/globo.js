const rp        = require("request-promise");
const cheerio   = require('cheerio');
const Tokenizer = require('sentence-tokenizer');
const chalk     = require('chalk');
const print     = require('../utils/print');

class Globo {
    constructor({ limit }){
        if(!process.env.GOOGLE_APPLICATION_CREDENTIALS) throw new Error('credentials.json not defined in .env')

        this.limit = limit ? parseInt(limit) : 1;
    }

    async _getSentences(url){
        let options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        let tokenizer = new Tokenizer('Globo');
        let contentString = await rp(options).then(async ($) => $('.content-text__container ').text());
        tokenizer.setEntry(contentString);
        let sentences = tokenizer.getSentences();
        return sentences;
    }

    _getNews() {
        console.log('');
        console.log(chalk.yellow('GLOBO'));

        let options = {
            uri: 'https://g1.globo.com',
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        return rp(options)
            .then(async ($) => {
                let news         = [];
                let newsElements = $('.feed-post-body');
                let count        = 0;

                newsElements.each((i, elem) => {
                    if(count === this.limit) return;

                    let title       = $(elem).find('.feed-post-body-title').find('div').find('div').text();
                    let description = $(elem).find('.feed-post-body-resumo').find('div').text();
                    let url         = $(elem).find('.feed-post-body-title').find('.feed-post-link').attr('href');

                    console.log(chalk.yellow(`~> Finded with title => ${title}`));

                    news[i] = { title, description, url };

                    count++;
                });
                
                for(let index in news){
                    news[index].sentences = await this._getSentences(news[index].url);
                }
                
                console.log('');
                return news;
            })
    }

    async run() {
        return await this._getNews();
    }
}

module.exports = Globo;