const rp        = require("request-promise");
const cheerio   = require('cheerio');
const Tokenizer = require('sentence-tokenizer');

class Folha {
    constructor({ limit }){
        this.limit = limit ? parseInt(limit) : 1;
        this.name  = "Folha de S.Paulo";
        this.urlNews = "https://www1.folha.uol.com.br/virtual/spiffy/mais-comentadas/home-1.0.0.json";
    }

    async _getSentences(url){
        let options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        let tokenizer = new Tokenizer(this.name);
        let contentString = await rp(options).then(async ($) => $('.c-news__body ').text());
        tokenizer.setEntry(contentString);
        let sentences = tokenizer.getSentences();
        return sentences;
    }

    getNews({ loader = null}) {
        return rp(this.urlNews).then(async (newsResponse) => {
            newsResponse  = JSON.parse(newsResponse);
            let news      = [];
            let count     = 0;

            for(let newObject of newsResponse){
                if(count === this.limit) break;

                let title = newObject.title;
                let url   = newObject.url;

                loader.text = `📄  ${this.name} (${this.limit}/${++count}) ~> ${title.slice(0, 15)}...`;
                
                news.push({ title, description: '', url });
            }

            for(let index in news){
                news[index].sentences = await this._getSentences(news[index].url);
            }

            return news;
        })
    }
}

module.exports = Folha;