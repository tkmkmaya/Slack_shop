//Requirement Library
//slackApp: M3W5Ut3Q39AaIwLquryEPMwV62A3znfOO

function transMoney(recvId, sendId, value) {  
  //出品者自身の商品を買った場合の例外処理
  if(recvId == sendId){
    postMessage("@"+recvId,"出品者自身の購入のため、処理は行いませんでした。["+value+"円]");
    postMessage("#money_log","出品者自身の購入のため、処理は行いませんでした。["+value+"円]");
    return;
  } 
   
  //get user information in JSON.
  var sheet_id = PropertiesService.getScriptProperties().getProperty('sheet_id');
  var sheet = SpreadsheetApp.openById(sheet_id);
  var lastrow = sheet.getLastRow();
  var userIdList = sheet.getSheetValues(1, 1, lastrow, 1);
  var moneyList = sheet.getSheetValues(1, 2, lastrow, 1);
  
  var recvInfo = getInfo(recvId, userIdList, moneyList);
  var sendInfo = getInfo(sendId, userIdList, moneyList);
  
  //spreadSheetに増減後の値を入力
  sheet.getRange(recvInfo.sheetMoneyAddress).setValue(parseInt(recvInfo.money) + value);
  sheet.getRange(sendInfo.sheetMoneyAddress).setValue(parseInt(sendInfo.money) - value);
  
  postMessage("@"+recvId,"残高:"+(parseInt(recvInfo.money) + value)+"[+"+value+"円]");
  postMessage("@"+sendId,"残高:"+(parseInt(sendInfo.money) - value)+"[-"+value+"円]");
  postMessage("#money_log","[送金]<@"+sendId+">-><@"+recvId+">["+value+"円]");
  
  return;
}

function addMoney(userId, value) {
  //get user information in JSON.
  var sheet_id = PropertiesService.getScriptProperties().getProperty('sheet_id');
  var sheet = SpreadsheetApp.openById(sheet_id);
  var lastrow = sheet.getLastRow();
  var userIdList = sheet.getSheetValues(1, 1, lastrow, 1);
  var moneyList = sheet.getSheetValues(1, 2, lastrow, 1);
  var userInfo = getInfo(userId, userIdList, moneyList);
  
  //spreadSheetに増額後の値を入力
  sheet.getRange(userInfo.sheetMoneyAddress).setValue(parseInt(userInfo.money) + value);
    
  postMessage("@"+userId,"残高:"+(parseInt(userInfo.money) + value)+"[+"+value+"]");
  postMessage("#money_log","[入金]<@"+userId+">残高:"+(parseInt(userInfo.money) + value)+"[+"+value+"]");
}

function subMoney(userId, value) {  
  //get user information in JSON.
  var sheet_id = PropertiesService.getScriptProperties().getProperty('sheet_id');
  var sheet = SpreadsheetApp.openById(sheet_id);
  var lastrow = sheet.getLastRow();
  var userIdList = sheet.getSheetValues(1, 1, lastrow, 1);
  var moneyList = sheet.getSheetValues(1, 2, lastrow, 1);
  var userInfo = getInfo(userId, userIdList, moneyList);
  
  //spreadSheetに増額後の値を入力
  sheet.getRange(userInfo.sheetMoneyAddress).setValue(parseInt(userInfo.money) - value);
    
  postMessage("@"+userId,"残高:"+(parseInt(userInfo.money) + value)+"[-"+value+"]");
  if(money < 0){
    postMessage("@"+userId,"残高がマイナスです。本システムは融資ではありません。");
  }
  postMessage("#money_log","[出金]"+userInfo.userName+"残高:"+(parseInt(userInfo.money) + value)+"[-"+value+"]");
}

function arrayParse(array) {
  var parseArray = [];
  for (var i = 0; i < array.length; i++) {
    parseArray[i] = array[i][0];
  }
  return parseArray;
}

function getInfo(userId, userIdList, moneyList){                  
  var indexNum = arrayParse(userIdList).indexOf(userId);
  var money = moneyList[indexNum];
  
  //JSONにして返す
  var info = {
    "userId": userId,
    "money": money,
    "indexNum": indexNum,
    "sheetMoneyAddress": "B"+(indexNum+1),
  }     
  
  return info;
}

function postMessage(id,message){
  //get slack access token from properties.
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var slackUrl = "https://slack.com/api/chat.postMessage"
  
  var options = {
    method: 'post',
    payload: {
      "token": slack_access_token,
      "channel": id,
      "text": message,
      "username": "ISDLのウィーゴ",
      "icon_url": "http://www.hasegawa-model.co.jp/hsite/wp-content/uploads/2016/04/cw12p5.jpg",
      "link_names": 1
    },
  };
  
  // post to Slack
  UrlFetchApp.fetch(slackUrl, options);
}