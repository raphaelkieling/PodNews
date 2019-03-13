const chalk     = require('chalk');

class Crawler {
    constructor({ crawlers = [] }) { 
        if(!process.env.GOOGLE_APPLICATION_CREDENTIALS) throw new Error('credentials.json not defined in .env')

        this.crawlers = crawlers;
        this.loader   = null;
    }

    async getAllNews() {
        let content = [];
        for(let craw of this.crawlers){
            content = content.concat(await craw.getNews({ loader: this.loader }));
        }
        return content;
    }
}

module.exports = Crawler;