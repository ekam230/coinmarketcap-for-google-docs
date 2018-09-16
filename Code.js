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
  
  var debugMenu = SpreadsheetApp.getUi().createMenu('Debug');
  debugMenu.addItem('Get CMC', 'uiUpdateFromCMC');
  debugMenu.addItem('Add Bilaxy', 'uiUpdateFromBilaxy');

  var mainMenu = SpreadsheetApp.getUi().createMenu('Blockfolio');
  mainMenu.addItem('Update', 'uiUpdateAll');
  mainMenu.addSeparator();
  mainMenu.addSubMenu(debugMenu);

  mainMenu.addToUi();
}

function uiUpdateAll() {
  uiUpdateFromCMC();
  uiUpdateFromBilaxy();
}

function uiUpdateFromCMC() {
  getDataFromCMC();
}

function uiUpdateFromBilaxy() {
  addDataFromBilaxy();
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
  var notNumberKeys = ["symbol", "id", "name"]
  
  sheet.getRange(1, 1, 1, keys.length).setValues([keys]);
  
  var values = new Array();
  
  //patch dublicate
  var shitCoins = ["blazecoin", "hydro-protocol", "embercoin", 'davorcoin']
  var indexSymbol = keys.indexOf('symbol');
  var indexId = keys.indexOf('id');

  var needPatch = indexId != -1;
  
  for (var r = 0; r < raw.length; r++) {
    var row = new Array();
    for (var k = 0; k < keys.length; k++) {
      var v = raw[r][keys[k]];
      if (notNumberKeys.indexOf(keys[k]) == -1) {
        v = Number(v)
      }
      row.push(v);
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

  setNameOfRange(spreadSheet, getRangeNameCMC(), range);

}

function setNameOfRange(spreadSheet, name, range) {

  namedRange = spreadSheet.getRangeByName(name);

  if (namedRange == null) {
    spreadSheet.setNamedRange(name, range);
  } else {
    namedRanges = spreadSheet.getNamedRanges();
    for (var i = 0; i < namedRanges.length; i++) {
      if (namedRanges[i].getName() == name) {
        namedRanges[i].setRange(range);
        break;
      }
    }
  }

}

function getBilaxyPairs() {

  var data = {}; 

  data[16] = "EOS";
  data[17] = "RDN";
  data[19] = "ZRX";
  data[21] = "HOT";
  data[22] = "CVT";
  data[23] = "GET";
  data[24] = "LND";
  data[25] = "SS";
  data[26] = "BZNT";
  data[27] = "TAU";
  data[28] = "PAL";
  data[29] = "SKM";
  data[30] = "LBA";
  data[31] = "ELI";
  data[32] = "SNTR";
  data[33] = "PCH";
  data[34] = "HER";
  data[35] = "EXC";
  data[36] = "ICST";
  data[37] = "UBT";
  data[38] = "OMX";
  data[39] = "IOTX";
  data[40] = "HOLD";
  data[41] = "VNT";
  data[42] = "CAI";
  data[43] = "ALI";
  data[44] = "VITE";
  data[45] = "EDR";
  data[46] = "NKN";
  data[47] = "SOUL";
  data[48] = "Seele";
  data[49] = "NRVE";
  data[50] = "PAI";
  data[51] = "BQT";
  data[53] = "MT";
  data[54] = "LEMO";
  data[55] = "ABYSS";
  data[56] = "QKC";
  data[57] = "XPX";
  data[58] = "MVP";
  data[59] = "ATMI";
  data[60] = "PKC";
  data[61] = "GO";
  data[62] = "RMESH";
  data[63] = "UPP";
  data[64] = "YEED";
  data[65] = "FTM";
  data[66] = "OLT";
  data[67] = "DAG";
  data[68] = "MET";
  data[69] = "EGT";
  data[70] = "KNT";
  data[71] = "ZCN";
  data[72] = "ZXC";
  data[73] = "CARD";
  data[74] = "MFT";
  data[75] = "GOT";
  data[76] = "AION";
  data[77] = "ESS";
  data[78] = "ZP";
  data[80] = "BOX";
  data[82] = "RHOC";
  data[83] = "SPRK";
  data[84] = "SDS";
  data[86] = "ABL";
  data[87] = "HIT";
  data[88] = "PMA";
  data[89] = "ACAD";
  data[90] = "DX";
  data[91] = "AION";
  data[92] = "UST";
  data[93] = "FOAM";
  data[94] = "LX";
  data[92] = "USE";
  data[93] = "FOAM";
  data[94] = "LX";
  data[95] = "DAV";
  data[96] = "PATH";
  data[97] = "UBEX";
  data[98] = "UCN";
  data[99] = "ASA";
  data[100] = "EDN";

  return data;
}

function addDataFromBilaxy() {

  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  
  var rangeCMC = spreadSheet.getRangeByName(getRangeNameCMC());
  if (rangeCMC == null) {
    return;
  }

  var price_eth = null;

  var keys = getKeysCMC();
  var columnSymbol = keys.indexOf('symbol') + 1;
  var columnPriceUSD = keys.indexOf('price_usd') + 1;
  var columnName = keys.indexOf('name') + 1;

  var gotFromCMC = []

  dataCMC = rangeCMC.getValues();
  
  var symbol;
  for (var indexRow = 1; indexRow < dataCMC.length; indexRow++) {
    symbol = dataCMC[indexRow][columnSymbol - 1];
    gotFromCMC.push(symbol);
    if (price_eth == null && symbol == "ETH") {
      price_eth = dataCMC[indexRow][columnPriceUSD-1];
    }
  }

  if (price_eth == null) {
    return;
  }

  var bilaxyData = JSON.parse(UrlFetchApp.fetch("http://api.bilaxy.com/v1/tickers"))['data'];
  var bilaxyPairs = getBilaxyPairs();
  
  var sheetCMC = spreadSheet.getSheetByName(getSheetNameCMC());

  var symbol = null
  var price = 0;
  var added = 0;
  var shiftRow = rangeCMC.getLastRow();
  var shiftColumn = rangeCMC.getColumn() - 1;
  for (var k = 0; k < bilaxyData.length; k++) {
    symbol = bilaxyPairs[bilaxyData[k]['symbol']];
    price = Number(bilaxyData[k]['last']) * price_eth;
    if (price > 0 && gotFromCMC.indexOf(symbol) == -1) {
      added++
      sheetCMC.getRange(shiftRow + added, shiftColumn + columnSymbol).setValue(symbol);
      sheetCMC.getRange(shiftRow + added, shiftColumn + columnName).setValue('bilaxy-' + symbol);
      sheetCMC.getRange(shiftRow + added, shiftColumn + columnPriceUSD).setValue(price);
      for (var c = 1; c <= keys.length; c++) {
        if (!( c == columnSymbol || c == columnName || c == columnPriceUSD )) {
          sheetCMC.getRange(shiftRow + added, shiftColumn + c).setValue('None');  
        }  
      }
    }
  }

  if (added > 0) {
    firstRow = rangeCMC.getRow();
    firstColumn = rangeCMC.getColumn();
    lastRow = rangeCMC.getLastRow() + added;
    lactColumn = rangeCMC.getLastColumn();
    setNameOfRange(spreadSheet, getRangeNameCMC(), sheetCMC.getRange(firstRow, firstColumn, lastRow - firstRow + 1, lactColumn - firstColumn + 1));
  }
}
