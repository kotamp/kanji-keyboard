const async = require('async');
const got = require('got');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const list = require('./jisho.json');
let result = [];

const asyncLimit = 20;

function send(item, cb) {
  got(item.rtkUrl)
  .then(res => {
    console.log(item)
    let dom = new JSDOM(res.body);
    let el = dom.window.document.querySelector('code');

    if (el == null) {
      console.log('dont have code tag')
      console.log(item)
      process.exit()
    }

    let content = el.innerHTML.trim();
    item.rtkTag = content;
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
  fs.createWriteStream('./db.json').end(JSON.stringify(result));
})