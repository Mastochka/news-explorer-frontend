//получаем инофрмацию о статье
function getArticleInfo(article){
    const link = article.querySelector('.article__link').getAttribute('href');
    const urlToImage = article.querySelector('.article__image').getAttribute('src');
    const title = article.querySelector('.article__title').textContent;
    const text = article.querySelector('.article__text').textContent;
    const date = article.querySelector('.article__date').textContent;
    const source = article.querySelector('.article__source').textContent;
    const tag = article.dataset.tag;
    return { 'link': link, 'image': urlToImage, 'title': title, 'text': text, 'date': date, 'source': source, 'keyword': tag }
}

//сортируем таги
function tagsSort(articles) {
  const arr = [];
  //закидываем таги в массив
  articles.forEach((item) => {
    return arr.push(item.keyword);
  });
  //пересчитываем их количество
  const tags = arr.reduce((prev, item) => {
    prev[item] = (prev[item] || 0) + 1;
    return prev;
  }, {})
  //сортируем по количеству от большего к меньшему
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
  return sortedTags;
}

//отрисовка тагов зависимости от их количества
function tagsRender(sortedTags, tagsElement) {
  let str;
  if (sortedTags.length > 3)
    str = `${sortedTags[0]}, ${sortedTags[1]} и ${sortedTags.length - 2} другим`;
  if (sortedTags.length === 3)
    str = `${sortedTags[0]}, ${sortedTags[1]} и ${sortedTags[2]}`;
  if (sortedTags.length === 2)
    str = `${sortedTags[0]} и ${sortedTags[1]}`;
  if (sortedTags.length === 1)
    str = `${sortedTags[0]}`;
  if (sortedTags.length === 0)
    str = ``;
  return tagsElement.textContent = str;
}

//форматирование даты до нужного формата
function dateEditor(date) {
  date = date.toString();
  if (date.length < 2)
    return `0${date}`
  else return date;
}

//получение даты для запроса новостей
function getDate() {
  const timestamp = Date.now();
  const now = new Date(timestamp);
  const weekAgo = new Date(now - 604800 * 1000); //вычитаем неделю
  const nowStr = `${now.getFullYear()}-${dateEditor((now.getMonth() + 1))}-${dateEditor(now.getDate())}`;
  const weekAgoStr = `${weekAgo.getFullYear()}-${dateEditor((weekAgo.getMonth() + 1))}-${dateEditor(weekAgo.getDate())}`;
  return { now: nowStr, weekAgo: weekAgoStr };
};

//редактирование полученной даты для отрисовки
function articleDate(publishedDate) {
  const dateYMD = publishedDate.slice(0, 10); //вырезаем год, месяц и число
  let month = {'01': 'Января', '02': 'Февраля', '03': 'Марта', '04': 'Апреля', '05': 'Мая', '06': 'Июня', '07': 'Июля', '08': 'Августа', '09': 'Сентября', '10': 'Октября', '11': 'Ноября', '12': 'Декабря'};
  const dateArr = dateYMD.split('-'); //год, месяц, число
  return `${dateArr[2]} ${month[dateArr[1]]}, ${dateArr[0]}`
}

//показываем ошибку в отедельном блоке
function errorShow(block, message){
  block.classList.remove('error-block_hidden');
  block.querySelector('.error-block__message').textContent = message;
  //удаляем ее через 4 секунды
  setTimeout(()=>  block.classList.add('error-block_hidden'), 4000)
}
export { getArticleInfo, tagsSort, tagsRender, getDate, articleDate, errorShow };
