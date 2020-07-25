export default class Article {
  constructor(){}
//создаем статью в зависимости от состояния
  createArticle(url, urlToImage,publishedAt, title, description, source, tag, state, id){
    const template =
    `<article class="article" data-tag = "${tag}" ${this._setArticleId(id)}>
    <a href="${url}"  target="_blank" class="article__link">
    <img src="${urlToImage}" alt="${title}" class="article__image">
    <div class="article__info">
    <p class="article__date">${publishedAt}</p>
    <h3 class="article__title">${title}</h3>
    <div class="article__text">${description}</div>
    <p class="article__source">${source}</p>
    </a>
    ${this._articleSelectorState(state)}
    ${this._articleTag(state, tag)}
    </article>`;
    return template;
  }

//если статья в сохраненных, добавляем тултип
_articleTag(state, tag){
  if (state === 'savedArticle')
  return `<div class="article__tag">${tag}</div>`
  else return '';
}

//отрисорвка селектора в зависимости от состояния
  _articleSelectorState(state){
    let articleSelector;
    if (!state)
    articleSelector = '';
    if (state === 'loggedIn')
    articleSelector = `<div class="article__selector">
      </div>`;
    if (state === 'notLoggedIn')
      articleSelector = `<div class="article__selector">
      <div class="article__selector-text article__selector-text_hidden">Войдите, чтобы сохранять статьи</div>
    </div>`;
     if (state === 'savedArticle')
      articleSelector = `<div class="article__selector article__selector_trash">
      <div class="article__selector-text article__selector-text_delete article__selector-text_hidden">Убрать из сохраненных</div>
    </div>`

    return articleSelector;
  }
  //если у статьи был Id добавляем датасет
  _setArticleId(id){
    if (id)
    return `data-article-id = "${id}"`
    else return '';
  }

  //удаление статьи
  removeNewsArticle(article, api){
  return api.removeArticle(article.dataset.articleId)
  }

}
