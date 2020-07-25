export default class NewsApi {
  constructor(apiKey, date){
    this.apiKey = apiKey;
    this.date = date;
  }
  _checkResponse(res) {
    if (res.ok)
        return res.json();
    else return Promise.reject(res);
  }

  getArticles(tag){
    return fetch(`https://praktikum.tk/news/v2/everything?q=${tag}&from=${this.date.weekAgo}&to=${this.date.now}&pageSize=100&apiKey=8b5645e09f854074b8033456e30afcdb`, {
      method: 'GET'
    })
    .then(res => this._checkResponse(res))
  }
}
