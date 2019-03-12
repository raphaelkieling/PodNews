const router        = require('express').Router();
const RobotComposer = require('../robots/composer');
const RobotCrawler  = require('../robots/crawler');
const RobotVoice    = require('../robots/voice');

const Globo = require('../crawlers/globo');

let robotCrawler = new RobotCrawler({
    crawlers: [
        new Globo()
    ]
})
    
// Crawler
let composer = new RobotComposer({
    robots: [
        robotCrawler,
        new RobotVoice()
    ]
});

router.post('/create', async (req, res)=>{
    let content = await composer.run();
    res.json(content);
})


module.exports = router;