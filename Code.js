/*
Copyright 2017-2018, Dmitry Klimenko, All right reserved

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// UI

function onOpen() {
  var mainMenu = SpreadsheetApp.getUi().createMenu('Blockfolio');
  mainMenu.addItem('Update', 'uiUpdateAll');
  mainMenu.addToUi();
}

function uiUpdateAll() {
  uiUpdateFromCMC();
}

function uiUpdateFromCMC() {
  getDataFromCMC();
}

// DATA MODEL

function getSheetNameCMC() {
  return "CMC";
}

function getRangeNameCMC() {
  return "CMC";
}

function getKeysCMC() {
  
  /* https://api.coinmarketcap.com/v1/ticker/?limit=0
  "id": "bitcoin",
  "name": "Bitcoin",
  "symbol": "BTC",
  "rank": "1",
  "price_usd": "573.137",
  "price_btc": "1.0",
  "24h_volume_usd": "72855700.0",
  "market_cap_usd": "9080883500.0",
  "available_supply": "15844176.0",
  "total_supply": "15844176.0",
  "percent_change_1h": "0.04",
  "percent_change_24h": "-0.3",
  "percent_change_7d": "-0.57",
  "last_updated": "1472762067"
  */

  // first is primary key
  return ["symbol", "id", "name", "rank", "price_usd", "price_btc", "percent_change_1h", "percent_change_24h", "percent_change_7d", "market_cap_usd", "available_supply", "total_supply"];
}

function getDataFromCMC() {
  
  var raw = JSON.parse(UrlFetchApp.fetch("https://api.coinmarketcap.com/v1/ticker/?limit=0"));
  var source = 'CMC';
  
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  
  var sheet = spreadSheet.getSheetByName(getSheetNameCMC());
  if (sheet == null) {
    sheet = spreadSheet.insertSheet(getSheetNameCMC());
  }
  sheet.clearContents();
  
  var keys = getKeysCMC();
  
  sheet.getRange(1, 1, 1, keys.length).setValues([keys]);
  
  var values = new Array();
  
  var price_eth = 0;
  
  //patch dublicate
  var shitCoins = ["blazecoin", "hydro-protocol", "embercoin", 'davorcoin']
  var indexSymbol = 0;
  var indexId = keys.indexOf('id');

  var needPatch = indexId != -1;
  
  for (var r = 0; r < raw.length; r++) {
    var row = new Array();
    for (var k = 0; k < keys.length; k++) {
      row.push(raw[r][keys[k]]);
    }
    
    if (needPatch) {
      if (shitCoins.indexOf(row[indexId]) >= 0) {
        row[indexSymbol] += "-shit";
        shitCoins.splice(shitCoins.indexOf(row[indexId]), 1);
        needPatch = shitCoins.length > 0;
      }
    }
    
    values.push(row);
  }
  
  var range = sheet.getRange(2, 1, values.length, keys.length)
  range.setValues(values);
  
  var rangeName = getRangeNameCMC();
  
  namedRange = spreadSheet.getRangeByName(rangeName);
  if (namedRange == null) {
    spreadSheet.setNamedRange(rangeName, range);
  } else {
    namedRanges = spreadSheet.getNamedRanges();
    for (var i = 0; i < namedRanges.length; i++) {
      if (namedRanges[i].getName() == rangeName) {
        namedRanges[i].setRange(range);
        break;
      }
    }
  }

}
