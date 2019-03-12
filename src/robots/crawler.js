class RobotCrawler {
    constructor({ crawlers = [] }) { 
        this.crawlers = crawlers;
    }

    async run() {
        let content = [];
        for(let craw of this.crawlers){
            content = content.concat(await craw.run());
        }
        return content;
    }
}

module.exports = RobotCrawler;