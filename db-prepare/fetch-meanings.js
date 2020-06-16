const async = require('async');
const got = require('got');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const list = require('./rtk-list.json');
let result = [];

const asyncLimit = 20;

const jisho = kanji => {
  return `https://jisho.org/search/${kanji} %23kanji`;
};

function send(item, cb) {
  got(jisho(item.kanji))
  .then(res => {
    console.log(item)
    let dom = new JSDOM(res.body);
    let meaning = dom.window.document.querySelector('.kanji-details__main-meanings');

    let text = '';
    let url = '';
    if (meaning != null) {
      text = meaning.innerHTML.trim();
      url = res.url;
    }

    item.jishoMeaning = text;
    item.jishoUrl = url;
    result.push(item);

    // cleaning
    dom = null
    meaning = null

    cb();
  })
  .catch((err) => {
    console.log('was requested!!! error')
    console.log(err);
    console.log(item)
    process.exit()
  })
}

async.eachLimit(list, asyncLimit, send)
.then(() => {
  fs.createWriteStream('./jisho.json').end(JSON.stringify(result));
})