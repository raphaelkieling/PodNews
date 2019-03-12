const rp = require("request-promise");
const cheerio = require('cheerio');

class Globo {
    _getContentNews(url){
        let options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        return rp(options).then(async ($) => $('.content-text__container ').text());
    }

    _getNews() {
        let options = {
            uri: 'https://g1.globo.com',
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        return rp(options)
            .then(async ($) => {
                let news = [];
                let newsElements = $('.feed-post-body');

                newsElements.each((i, elem) => {
                    let title       = $(elem).find('.feed-post-body-title').find('div').find('div').text();
                    let description = $(elem).find('.feed-post-body-resumo').find('div').text();
                    let url         = $(elem).find('.feed-post-body-title').find('.feed-post-link').attr('href');

                    news[i] = {
                        title,
                        description,
                        url
                    }
                });
                for(let index in news){
                    news[index].content = await this._getContentNews(news[index].url);
                }

                return news;
            })
    }

    async run() {
        return await this._getNews();
    }
}

module.exports = Globo;