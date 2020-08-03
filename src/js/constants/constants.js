const config = {
  'baseUrl': 'https://api.mesto-project.ru',
  'newApiKey': '8b5645e09f854074b8033456e30afcdb'
}

const validationErrors = {
  'required': 'Это обязательное поле',
  'length': 'Должно быть от 2 до 30 символов',
  'email': 'Неправильный формат email'
}

const serverMessages = {
  'unauthorized': 'Необходима авторизация',
  'loginSuccess': 'Успешная авторизация',
  'logout': 'Пользователь вышел'
}
const searchError = {
  'badRequest': 'Введите корректный запрос'
}

export { config, validationErrors, serverMessages, searchError };
