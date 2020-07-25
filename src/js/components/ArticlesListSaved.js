import ArticlesList from "./ArticlesList";

export default class ArticleListSaved extends ArticlesList {
  constructor(container, article, articles, showmoreButton, notFound, articlesResults, articlesTotal){
    super(container, article, articles, showmoreButton, notFound, articlesResults)
    this.articlesTotal = articlesTotal;
    this.articlesResults = articlesResults;
    }

  renderSavedResults(state) {
    for (let i = 2; i >= 0; i--) {
      if (this.articles[i]) {
        const articles = this.articles;
        const article = articles.shift([i]);
        this._addSavedArticle(article, state);
      }
    }
    this._showMore();
  }

  _addSavedArticle(data, state){
    const article = this.article.createArticle(data.link, data.image, data.date, data.title,data.text, data.source, data.keyword, state, data._id);
    this.container.insertAdjacentHTML('beforeend', article);
  }

}
