const rp        = require("request-promise");
const cheerio   = require('cheerio');
const Tokenizer = require('sentence-tokenizer');

class Globo {
    constructor({ limit }){
        if(!process.env.GOOGLE_APPLICATION_CREDENTIALS) throw new Error('credentials.json not defined in .env')

        this.limit = limit ? parseInt(limit) : 1;
        this.name  = "G1 Globo";
        this.urlNews = 'https://g1.globo.com';
    }

    async getContent(url){
        let options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        return await rp(options).then(async ($) => $('.content-text__container ').text());
    }

    async getSentences(contentString){
        let tokenizer = new Tokenizer(this.name);
        
        tokenizer.setEntry(contentString);
        let sentences = tokenizer.getSentences();
        return sentences;
    }

    getNews({ loader = null }) {
        let options = {
            uri: this.urlNews,
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

                    loader.text = `📄  ${this.name} (${this.limit}/${++count}) ~> ${title.slice(0, 15)}...`;

                    news[i] = { title, description, url };
                });
                
                for(let index in news){
                    news[index].content = await this.getContent(news[index].url);
                    news[index].sentences = await this.getSentences(news[index].content);
                }
                
                return news;
            })
    }

    async run() {
        return await this._getNews();
    }
}

module.exports = Globo;