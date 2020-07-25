import './style.css';
import './images/NewsExplorer-white.svg';
import './images/NewsExplorer-black.svg';
import './images/search-bg.jpg';
import './images/search-bg-mobile.jpg';
import './images/lapka.svg';
import './images/logout-white.svg';
import './images/logout-black.svg';
import './images/image_08.jpg';
import './images/article-icon.svg'
import './images/article-icon-hover.svg'
import './images/article-icon-marked.svg'
import './images/author-photo.jpg'
import './images/gh-icon.svg'
import './images/fb.svg'
import './images/notfound.svg'
import './images/close.svg'
import './images/close-black.svg'
import './images/trash.svg'
import './images/trash-hover.svg'
import './images/hamburger.svg'
import './images/hamburger-black.svg'
import './images/favicon.svg'

import Popup from './js/components/Popup';
import Header from './js/components/Header';
import User from './js/components/User';
import Article from './js/components/Article';
import ArticlesList from './js/components/ArticlesList';
import FormValidator from './js/components/FormValidator';
import MainApi from './js/api/MainApi';
import NewsApi from './js/api/NewsApi';
import { getArticleInfo, getDate, articleDate, errorShow } from './js/utils/utils';
import { config, validationErrors, serverMessages, searchError } from './js/constants/constants';



const authOpenButton = document.querySelector('.header__menu-button-login');
const logoutButton = document.querySelector('.header__menu-button-logout');
const savedArticlesButton = document.querySelector('.header__menu-item-saved-articles');
const loader = document.querySelector('.results__loader');
const showMoreButton = document.querySelector('.button__showmore');
const notFound = document.querySelector('.results__not-found');
const articlesResult = document.querySelector('.results__wrapper');
const errorBlock = document.querySelector('.error-block');
const formSignUp = document.forms.signup;
const formSignIn = document.forms.signin;
const formSearch = document.forms.search;
const searchButton = document.querySelector('.button__search');
const mobileMenu = document.querySelector('.header__menu-mobile');
const authOpenButtonMobile = document.querySelector('.header__menu-mobile-button-login');
const logoutButtonMobile = document.querySelector('.header__menu-mobile-button-logout');
const savedArticlesButtonMobile = document.querySelector('.header__menu-mobile-item-saved-articles');
const mobileMenuCloser = document.querySelector('.header__menu-mobile-closer');
const mobileMenuOpener = document.querySelector('.header__menu-mobile_button-opener');
let searchRequest = ''; //сохранем запрос, чтобы в дальнейшем раздать его статьям как keyword

const article = new Article();
const user = new User();
const header = new Header(authOpenButton, logoutButton, savedArticlesButton);
const headerMobile = new Header(authOpenButtonMobile, logoutButtonMobile, savedArticlesButtonMobile);
const articlesList = new ArticlesList(document.querySelector('.articles'), article, [], showMoreButton, loader, notFound, articlesResult)
const popupSignUp = new Popup(document.querySelector('.popup__signup'));
const popupSignIn = new Popup(document.querySelector('.popup__signin'));
const popupSuccess = new Popup(document.querySelector('.popup__success'));
const userApi = new MainApi({ baseUrl: config.baseUrl });
const newsApi = new NewsApi(config.newApiKey, getDate());
const formSignUpValidator = new FormValidator(popupSignUp.container, validationErrors);
const formSignInValidator = new FormValidator(popupSignIn.container, validationErrors);

/*функция автологина, если кука есть, то сразу получаем пользователя и отрисовываем хедер.
Здесь есть проблема в Хроме, что он кидает в консоль ошибку 401, если куки нет
В Фаерфоксе такого нет, эту ошибку нельзя пофиксить и можно только скрыть
В критериях есть пункт "Нет ошибок в консоли", надеюсь в этом месте можно сделать исключение*/
window.addEventListener('load', () => {
  userApi.getUser()
    .then((userData) => {
      if (userData.message === serverMessages.unauthorized || !userData.data) {
        user.status = 'notLoggedIn';
        header.buttonsHandler(user.status);
        headerMobile.buttonsHandler(user.status);
        return Promise.reject();
      }
      user.status = 'loggedIn';
      user.name = userData.data.name;
      header.buttonsHandler(user.status, user.name);
      headerMobile.buttonsHandler(user.status, user.name);
    })
    .catch(() => { }); //Здесь нет смысла выводить ошибку
})

//взаимодействие с мобильным меню
mobileMenuOpener.addEventListener('click', () => {
  mobileMenuOpener.classList.add('header__menu-item_hidden');
  mobileMenu.classList.remove('header__menu-item_hidden');
  mobileMenuCloser.classList.remove('header__menu-item_hidden');

})
mobileMenuCloser.addEventListener('click', () => {
  mobileMenu.classList.add('header__menu-item_hidden');
  mobileMenuCloser.classList.add('header__menu-item_hidden');
  mobileMenuOpener.classList.remove('header__menu-item_hidden');
})
authOpenButton.addEventListener('click', () => {
  popupSignIn.open();
  formSignInValidator.setEventListeners();
})

authOpenButtonMobile.addEventListener('click', () => {
  mobileMenu.classList.add('header__menu-item_hidden');
  mobileMenuCloser.classList.add('header__menu-item_hidden');
  mobileMenuOpener.classList.remove('header__menu-item_hidden');
  popupSignIn.open();
  formSignInValidator.setEventListeners();
})

//обработчики открытия и закрытия попатов с добавлением валидации
document.querySelector('.popup__form-signup-opener').addEventListener('click', () => {
  formSignUp.reset();
  popupSignIn.close();
  popupSignUp.open();
  formSignUpValidator.setEventListeners();
})

//аналогичные открытия попапа для входа из других попапов, задаем случашетей через forEach
document.querySelectorAll('.popup__form-signin-opener').forEach(item => {
  item.addEventListener('click', () => {
    popupSignUp.close();
    popupSuccess.close();
    popupSignIn.open();
    formSignInValidator.setEventListeners();
  })
})

document.querySelectorAll('.popup__close').forEach(item => {
  item.addEventListener('click', () => {
    popupSignIn.close();
    popupSignUp.close();
    popupSuccess.close();
  })
})

//слушатель закрытия попапа по ESC
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    popupSignIn.close();
    popupSignUp.close();
    popupSuccess.close();
  }
})

//слушатель закрытия попапа при клике вне формы
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('popup')) {
    popupSignIn.close();
    popupSignUp.close();
    popupSuccess.close();
  }
})

//регистрация пользователя
document.querySelector('.button__popup-signup').addEventListener('click', (event) => {
  event.preventDefault();
  userApi.signUp(formSignUp.name.value, formSignUp.email.value, formSignUp.password.value)
    .then(user => {
      if (!user.data)
        return Promise.reject(user);
    })
    .then(() => {
      popupSignUp.close();
      popupSuccess.open();
    })
    .catch((err) => {
      //вывод ошибки над кнопкой регистарации
      event.target.closest('.popup').querySelector('.popup__input-server-error').textContent = err.message;
    });
})

//логин
document.querySelector('.button__popup-signin').addEventListener('click', (event) => {
  event.preventDefault();
  userApi.signIn(formSignIn.email.value, formSignIn.password.value)
    .then((data) => {
      if (data.message !== serverMessages.loginSuccess) //если сообщение об успешном ответе не пришло - отклоняем
        return Promise.reject(data)
    })
    .then(() => userApi.getUser())
    .then((userData) => {
      popupSignIn.close();
      user.status = 'loggedIn';
      user.name = userData.data.name;
      header.buttonsHandler(user.status, user.name);
      headerMobile.buttonsHandler(user.status, user.name);
      //если у пользователя уже были отрисованы статьи, удаляем тултип что необходима авторизация
      document.querySelectorAll('.article__selector-text').forEach(item => item.remove());
    })
    .catch((err) => {
      //вывод ошибки над кнопкой регистарации
      event.target.closest('.popup').querySelector('.popup__input-server-error').textContent = err.message;
    });
})

//поиск и отрисовка новостей
searchButton.addEventListener('click', (event) => {
  searchRequest = formSearch.search.value;
  if (!searchRequest) //проверка запроса
    return errorShow(errorBlock, searchError.badRequest);
  event.preventDefault();
  articlesList.container.innerHTML = ''; //удалем новости если они уже были
  notFound.classList.add('results_hidden');
  articlesList.loaderHandler('show');
  formSearch.setAttribute('disabled', '');
  searchButton.setAttribute('disabled', '');
  newsApi.getArticles(searchRequest) //запрос новостей
    .then(data => {
      articlesList.articles = [];
      articlesList.articles = data.articles;
      //переводим дату в требуемый формат и пересохрание в массиве статей
      articlesList.articles.forEach(item => item.publishedAt = articleDate(item.publishedAt))
    })
    .then(() => {
      articlesList.loaderHandler('hide');
      formSearch.removeAttribute('disabled');
      searchButton.removeAttribute('disabled');
      //показываем либо блок notFound либо отрисовываем 3 новости
      articlesList.searchResults(articlesList.articles);
      articlesList.renderNewsResults(searchRequest, user.status);
      formSearch.reset();
    })
    //если ошибка или пустой запрос - выводим в сплывающем окне
    .catch(err => errorShow(errorBlock, err.message || err));
});

showMoreButton.addEventListener('click', () => {
  articlesList.renderNewsResults(searchRequest, user.status);
})

//сохранение новости
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('article__selector') && !(event.target.classList.contains('article__selector_marked'))) {
    if (user.status === 'notLoggedIn')
      //если запрос на сохранение без авторизации - показываем ошибку
      return errorShow(errorBlock, serverMessages.unauthorized);
    const article = event.target.closest('.article');
    //получаем данные о статье для сохранения
    userApi.saveArticle(getArticleInfo(article))
      .then((savedArticle) => {
        if (!savedArticle.data)
          return Promise.reject(savedArticle);
        //добавляем статье id для возможности удаления
        article.dataset.articleId = savedArticle.data._id;
        event.target.classList.toggle('article__selector_marked');
      })
      .catch(err => errorShow(errorBlock, err.message || err))
  }
})
//
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('article__selector_marked')) {
    const selectedArticle = event.target.closest('.article');
    article.removeNewsArticle(selectedArticle, userApi)
      .then(() => event.target.classList.toggle('article__selector_marked'))
      .catch(err => errorShow(errorBlock, err.message || err))
  }
})

logoutButton.addEventListener('click', () => {
  userApi.logout()
    .then((data) => {
      if (data.message === serverMessages.logout)
        window.location.reload();
      else Promise.reject(data);
    })
    .catch(err => errorShow(errorBlock, err.message || err))
})

logoutButtonMobile.addEventListener('click', () => {
  userApi.logout()
    .then((data) => {
      if (data.message === serverMessages.logout)
        window.location.reload();
      else Promise.reject(data);
    })
    .catch(err => errorShow(errorBlock, err.message || err))
})


