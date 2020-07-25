import '../style.css';
import '../images/NewsExplorer-white.svg';
import '../images/NewsExplorer-black.svg';
import '../images/search-bg.jpg';
import '../images/search-bg-mobile.jpg';
import '../images/lapka.svg';
import '../images/logout-white.svg';
import '../images/logout-black.svg';
import '../images/article-icon.svg'
import '../images/article-icon-hover.svg'
import '../images/article-icon-marked.svg'
import '../images/gh-icon.svg'
import '../images/fb.svg'
import '../images/close-black.svg'
import '../images/trash.svg'
import '../images/trash-hover.svg'
import '../images/hamburger.svg'
import '../images/hamburger-black.svg'
import '../images/favicon.svg'

import Article from '../js/components/Article';
import ArticlesListSaved from '../js/components/ArticlesListSaved';
import User from '../js/components/User';
import MainApi from '../js/api/MainApi';
import {tagsSort, tagsRender} from '../js/utils/utils'
import { config, serverMessages } from '../js/constants/constants';


const logoutButton = document.querySelector('.header__menu-button-logout');
const logoutButtonMobile = document.querySelector('.header__menu-mobile-button-logout');
const mobileMenu = document.querySelector('.header__menu-mobile');
const mobileMenuCloser = document.querySelector('.header__menu-mobile-closer');
const mobileMenuOpener = document.querySelector('.header__menu-mobile_button-opener');
const showMoreButton = document.querySelector('.button__showmore');
const articlesResults = document.querySelector('.saved-articles__wrapper');
const notFound = document.querySelector('.results__not-found');
const info = document.querySelector('.account-info__title');
const tags = document.querySelector('.account-info__tags');

const article = new Article();
const user = new User();
const articlesList = new ArticlesListSaved(document.querySelector('.articles'), article, [], showMoreButton,'', notFound, articlesResults, []);
const userApi = new MainApi({ baseUrl: config.baseUrl });

//отрисовка страницы при переходе
window.addEventListener('load', () => {
  userApi.getUser()
    .then((userData) => {
      if (userData.message === serverMessages.unauthorized || !userData) {
        //если куки нет, возвращаем на главную
        document.location.href = 'https://mastochka.github.io/news-explorer-frontend/';
        return Promise.reject(userData);
      }
      else {
        user.name = userData.data.name;
        logoutButton.textContent = user.name;
        logoutButtonMobile.textContent = user.name;
      };
    })
    .then(()=> {
      userApi.getSavedArticles()
      .then((articles) => {
        articlesList.articles = articles.data;
        //глубокое клонирование(?), массивы нужны для разных целей
        articlesList.articlesTotal =  JSON.parse(JSON.stringify(articles.data));
      })
      .then(()=> {
        info.textContent = `${user.name}, у вас ${articlesList.articlesTotal.length} статей`;
        articlesList.searchResults(articlesList.articlesTotal);
        articlesList.renderSavedResults('savedArticle');
        //сортируем и показываем таги
        tagsRender(tagsSort(articlesList.articlesTotal), tags);
      })
    })
    .catch(err => errorShow(errorBlock, err.message || err));
})

showMoreButton.addEventListener('click', ()=> {
  articlesList.renderSavedResults('savedArticle');
})

//удаление статьи
document.addEventListener('click', (event)=> {
  if(event.target.classList.contains('article__selector_trash')) {
    const selectedArticle = event.target.closest('.article');
    article.removeNewsArticle(selectedArticle, userApi)
    .then(()=>{
      //после удаления отсортировываем удаленное и перерисовываем количество и таги
      articlesList.articlesTotal = articlesList.articlesTotal.filter(item => item._id !== selectedArticle.dataset.articleId)
      info.textContent = `${user.name}, у вас ${articlesList.articlesTotal.length} статей`;
      tagsRender(tagsSort(articlesList.articlesTotal), tags);
      selectedArticle.remove();
      articlesList.searchResults(articlesList.articlesTotal);
    })
    .catch(err => errorShow(errorBlock, err.message || err))
  }
})

//мобильное меню
mobileMenuOpener.addEventListener('click', () => {
  mobileMenuOpener.classList.add('header__menu-item_hidden');
  mobileMenu.classList.remove('header__menu-item_hidden');
  mobileMenuCloser.classList.remove('header__menu-item_hidden');
})

mobileMenuCloser.addEventListener('click', ()=> {
  mobileMenu.classList.add('header__menu-item_hidden');
  mobileMenuCloser.classList.add('header__menu-item_hidden');
  mobileMenuOpener.classList.remove('header__menu-item_hidden');
})

logoutButton.addEventListener('click', ()=> {
  userApi.logout()
  .then((data)=> {
    if (data.message === serverMessages.logout)
    document.location.href = 'https://mastochka.github.io/news-explorer-frontend/';
    else Promise.reject(data);
  })
  .catch(err => errorShow(errorBlock, err.message || err))
})

logoutButtonMobile.addEventListener('click', ()=> {
  userApi.logout()
  .then((data)=> {
    if (data.message === serverMessages.logout)
    window.location.reload();
    else Promise.reject(data);
  })
  .catch(err => errorShow(errorBlock, err.message || err))
})
