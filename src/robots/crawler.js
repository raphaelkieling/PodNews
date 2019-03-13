class Crawler {
    constructor({ crawlers = [] }) { 
        this.crawlers = crawlers;
    }

    async getAllNews() {
        let content = [];
        for(let craw of this.crawlers){
            content = content.concat(await craw.run());
        }
        return content;
    }
}

module.exports = Crawler;