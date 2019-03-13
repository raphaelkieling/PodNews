const Tokenizer = require('sentence-tokenizer');
const NewsAPI   = require('newsapi');
const prompts   = require('prompts');

class News{
    constructor({ limit = 1 , language = 'pt', category='general'}){
        this.key      = process.env.GOOGLE_NEWS_CREDENTIAL;
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

    async selectNews(news){
        if(!news) throw new Error('Not has news to work');

        this.loader.stop();

        let sanitizedNews = [];
        for(let newObj of news){
            sanitizedNews.push({ title: newObj.title, value: newObj });
        }

        let result = await prompts({
            type: 'multiselect',
            name: 'value',
            message: 'Choice a new',
            choices: sanitizedNews
        })

        this.loader.start();

        return result.value;
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
            .then(async news => await this.selectNews(news));
    }
}

module.exports = News;