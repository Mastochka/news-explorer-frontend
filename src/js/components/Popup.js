export default class Popup {
  constructor(container) {
    this.container = container;
  }
  open(){
    this.container.classList.remove('popup_hidden');
  }
  close(){
    this.container.classList.add('popup_hidden');
  }
}
