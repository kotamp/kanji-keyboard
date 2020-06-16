const fs = require('fs');
const db = require('./db.json');

db.sort(function(a, b){
  return a.index - b.index;
})

for (let i = 0; i < db.length; i++) {
  const kanji = db[i].kanji;
  db[i].unicode = kanji.codePointAt(0).toString(16);
}

fs.createWriteStream('db.json').end(JSON.stringify(db));