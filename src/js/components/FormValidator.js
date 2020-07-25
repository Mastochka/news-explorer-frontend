export default class FormValidator {
  constructor(popup, errors) {
    this.popup = popup;
    this.errors = errors;
    ;
  }
  //функция проверки инпутов
  checkInputValidity(input, errorMsg) {
    errorMsg.textContent = '';
    if (input.value.length === 0)
      errorMsg.textContent = this.errors.required;
    else if (input.getAttribute('type') === 'email' && !input.validity.valid)
      errorMsg.textContent = this.errors.email;
    else if (!input.validity.valid)
      errorMsg.textContent = this.errors.length;
    else errorMsg.textContent = '';
  }

  //функция установки статуса кнопки
  setSubmitButtonState(form, button) {
    if (form.checkValidity())
      button.removeAttribute('disabled');
    else
      button.setAttribute('disabled', '');
  }

  setEventListeners() {
    const self = this;
    const form = this.popup.querySelector('.popup__form');
    const button = form.querySelector('.button__popup');
    function checkValidity(event) {
      self.checkInputValidity(event.target, event.target.closest('div').querySelector(`.popup__input-error`));
      self.setSubmitButtonState(form, button);
    }
    form.addEventListener('input', checkValidity);
    this.setSubmitButtonState(form, button);
  }
}
