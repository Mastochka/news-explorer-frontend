export default class Header {
  constructor(authButton, logoutButton, savedArticlesButton){
    this.authButton = authButton;
    this.logoutButton = logoutButton;
    this.savedArticlesButton = savedArticlesButton;
  }
//в зависимости от статуса показываем нужные кнопки
  buttonsHandler(status, username){
    if (status === 'loggedIn') {
      this.logoutButton.textContent = username;
      this.logoutButton.classList.remove('header__menu-item_hidden');
      this.savedArticlesButton.classList.remove('header__menu-item_hidden');
      this.authButton.classList.add('header__menu-item_hidden');
    }
    if (status === 'notLoggedIn') {
      this.logoutButton.textContent ='';
      this.logoutButton.classList.add('header__menu-item_hidden');
      this.authButton.classList.remove('header__menu-item_hidden');
      this.savedArticlesButton.classList.add('header__menu-item_hidden');
    }
  }
}
