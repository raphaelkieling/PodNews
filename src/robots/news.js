const Tokenizer = require('sentence-tokenizer');
const NewsAPI = require('newsapi');

class News{
    constructor({ limit }){
        this.key = process.env.GOOGLE_NEWS_CREDENTIAL;
        this.limit = limit ? parseInt(limit) : 1;
    }

    getNews(){
        const newsapi = new NewsAPI(this.key);

        let sanitizeNews = (news) => news.map(newObj => ({
            title: newObj.title,
            description: newObj.description,
            url: newObj.url,
            content: newObj.content
        }));

        let putSentences = (news) => news.map(newObj => {
            let tokenizer = new Tokenizer('google-news');
            tokenizer.setEntry(newObj.content || '');

            newObj.sentences = tokenizer.getSentences();
            return newObj;
        })

        return newsapi.v2.topHeadlines({
                country: 'br',
                pageSize: this.limit
            })
            .then(response => response.articles)
            .then(sanitizeNews)
            .then(putSentences)
    }
}

module.exports = News;