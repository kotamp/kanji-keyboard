(function(){
  var db = null;
  var outputEl = null;
  var keyboardEl = null;
  var buttonEls = [];

  var handleInput, handleDeleteLast, handleClear, filter, handleKanji;

//   filter = function(str) {
//     var tokens = str.split(' ');
//     var mask = [];
// 
//     if (tokens.length === 0) return mask;
// 
//     for (var i = 0; i < db.length; i++) {
//       var flag = true;
//       var item = db[i];
// 
//       for (var j = 0; j < tokens.length; j++) {
//         if (item.jishoMeaning.indexOf(tokens[j]) !== -1 ||
//             item.rtkTag.indexOf(tokens[j]) !== -1 ||
//             item.unicode.indexOf(tokens[j]) !== -1) {
//           flag = false;
//           break;
//         }
//       }
// 
//       if (flag) {
//         mask[i] = true;
//       }
//     }
// 
//     return mask;
//   }

  filter = function(str) {
    var mask = [];

    if (str.length === 0) return mask;

    for (var i = 0; i < db.length; i++) {
      var item = db[i];

      if (item.jishoMeaning.indexOf(str) === -1 &&
          item.rtkTag.indexOf(str) === -1 &&
          item.unicode.indexOf(str) === -1)
        mask[i] = true;

    }

    return mask;
  }

  handleInput = function(e) {
    var value = e.target.value;
    var mask = filter(value);
    
    for (var i = 0; i < db.length; i++) {
      buttonEls[i].style.display = (mask[i] ? 'none' : 'initial');
    }
  };

  handleKanji = function(e) {
    outputEl.innerHTML += e.target.innerText
  };

  handleDeleteLast = function(e) {
    outputEl.innerHTML = outputEl.innerHTML.slice(0, -1);
  };

  handleClear = function(e) {
    outputEl.innerHTML = '';
  };

  var launch = function(json) {
    db = json;

    document.getElementById('input')
    .addEventListener('input', handleInput);

    document.getElementById('button-last')
    .addEventListener('click', handleDeleteLast);

    document.getElementById('button-clear')
    .addEventListener('click', handleClear);

    outputEl = document.getElementById('output');
    keyboardEl = document.getElementById('keyboard');

    for (var i = 0; i < db.length; i++) {
      var button = document.createElement('button');
      button.innerHTML = db[i].kanji;
      button.addEventListener('click', handleKanji);
      buttonEls.push(button);
      keyboardEl.appendChild(button)
    }

  }

  var init = function() {
    fetch('./db.json')
    .then(function(res) {return res.json()})
    .then(launch)
  };

  window.addEventListener('load', init);
})()