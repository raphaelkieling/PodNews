const Tokenizer = require('sentence-tokenizer');
const NewsAPI   = require('newsapi');
const prompts   = require('prompts');

class News{
    constructor({ limit = 1 , language = 'pt', category='general' , credential}){
        this.key      = credential;
        this.limit    = limit;
        this.loader   = null;
        this.language = this._getLanguage(language);
        this.category = category;
        this.SCOPE    = {
            everything: 'everything',
            topHeadlines: 'topHeadlines' 
        }
    }

    _getLanguage(language){
        switch(language){
            case 'pt-BR':
                return 'pt'
            case 'en':
                return 'en'
            default:
                return language;
        }
    }

    async getNews({ searchTerm }){
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
        });

        let scope = searchTerm ? this.SCOPE.everything : this.SCOPE.topHeadlines;

        let optionsNewsApi = {
            language: this.language,
            q: searchTerm,
            pageSize: this.limit,
            sortBy: 'relevancy'
        };

        // Add category if is 'topHeadlines', everything scope not support this parameter 
        if(scope === this.SCOPE.topHeadlines){
            optionsNewsApi.category = this.category;
        }
        
        return newsapi.v2[scope](optionsNewsApi)
            .then(response => response.articles)
            .then(sanitizeNews)
            .then(putSentences)
    }
}

module.exports = News;