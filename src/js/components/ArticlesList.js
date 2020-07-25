export default class ArticlesList {
  constructor(container, article, articles, showmoreButton, loader, notFound, articlesResults) {
    this.container = container;
    this.article = article;
    this.articles = articles;
    this.showmoreButton = showmoreButton;
    this.loader = loader;
    this.notFound = notFound;
    this.articlesResults = articlesResults;
  }
//показываем первые 3 статьи и удалем их из массива, если статьи кончились кнопка "показать еще" пропадает
  renderNewsResults(tag, state, id) {
    for (let i = 2; i >= 0; i--) {
      if (this.articles[i]) {
        const articles = this.articles;
        const article = articles.shift([i]);
        this._addNewsArticle(article, tag, state, id);
      }
    }
    this._showMore();
  }

  _addNewsArticle(data, tag, state, id) {
    const article = this.article.createArticle(data.url, data.urlToImage, data.publishedAt, data.title, data.description, data.source.name, tag, state, id);
    this.container.insertAdjacentHTML('beforeend', article);
  }

  _showMore() {
    if (this.articles.length !== 0)
      this.showmoreButton.classList.remove('button_hidden');
    else this.showmoreButton.classList.add('button_hidden');
  }

  loaderHandler(status) {
    if (status === 'show')
      this.loader.classList.remove('results_hidden');
    if (status === 'hide')
      this.loader.classList.add('results_hidden');
  }
//если массив статей пустой показываем блок что ничего не найдено
  searchResults(articles) {
    if (articles.length !== 0) {
      this.articlesResults.classList.remove('results_hidden');
      this.notFound.classList.add('results_hidden')
    }
    else {
      this.articlesResults.classList.add('results_hidden');
      this.notFound.classList.remove('results_hidden')
    }
  }
}
