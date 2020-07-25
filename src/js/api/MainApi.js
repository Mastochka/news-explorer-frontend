export default class MainApi {
  constructor(options) {
    this.options = options;
  }

  signUp(name, email, password) {
    return fetch(this.options.baseUrl + '/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
      })
    })
      .then(res => res.json());
  }

  signIn(email, password) {
    return fetch(this.options.baseUrl + '/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email,
        password: password,
      })
    })
    .then((res) => res.json())

  }

  getUser() {
    return fetch(this.options.baseUrl + '/users/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json());
  }

  saveArticle(data) {
    return fetch(this.options.baseUrl + '/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        link: data.link,
        image: data.image,
        date: data.date,
        title: data.title,
        text: data.text,
        source: data.source,
        keyword: data.keyword
      })
    })
      .then(res => res.json());
  }

  logout() {
    return fetch(this.options.baseUrl + '/logout', {
      method: 'GET',
      credentials: 'include'
    }
    )
      .then(res => res.json())
  }

  removeArticle(id) {
    return fetch(this.options.baseUrl + '/articles/' + id, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then(res =>res.json())

  }
  getSavedArticles() {
    return fetch(this.options.baseUrl + '/articles/', {
      method: 'GET',
      credentials: 'include'
    }
    )
    .then(res => res.json())
  }
}
