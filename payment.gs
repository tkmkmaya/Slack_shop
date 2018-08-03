function transMoney(recvId, sendId, value) {  
  //出品者自身の商品を買った場合の例外処理
  if(recvId == sendId){
    postMessage("@"+recvId,"出品者自身の購入のため、処理は行いませんでした。["+value+"円]");
    return;
  } 
  
  //ユーザー情報はキャッシュに残っていれば活用
  cache = CacheService.getPublicCache();
  //cache.remove(recvId);
  //cache.remove(sendId);
  var recvInfo = JSON.parse(cache.get(recvId));
  var sendInfo = JSON.parse(cache.get(sendId));
  
  //get user information in JSON.
  var sheet_id = PropertiesService.getScriptProperties().getProperty('sheet_id');
  var sheet = SpreadsheetApp.openById(sheet_id);
  
  if((recvInfo==null)||(sendInfo==null)){
    var lastrow = sheet.getLastRow();
    var userIdList = sheet.getSheetValues(1, 1, lastrow, 1);
    var moneyList = sheet.getSheetValues(1, 2, lastrow, 1);
  }
    
  if(recvInfo==null){
    var recvInfo = getInfo(recvId, userIdList, moneyList);
    recvInfo.money = parseInt(recvInfo.money) + value;
    cache.put(recvId, JSON.stringify(recvInfo), 60*60*24);
  }
  
  if(sendInfo==null){
    var sendInfo = getInfo(sendId, userIdList, moneyList);
    sendInfo.money = parseInt(sendInfo.money) - value;
    cache.put(sendId, JSON.stringify(sendInfo), 60*60*24);
  }
  
  //spreadSheetに増減後の値を入力
  sheet.getRange(recvInfo.sheetMoneyAddress).setValue(recvInfo.money);
  sheet.getRange(sendInfo.sheetMoneyAddress).setValue(sendInfo.money);
  
  if(recvId!="U3QC336UR"){
    postMessage("@"+recvId,"残高:"+recvInfo.money+"[+"+value+"円]");
  }
  postMessage("@"+sendId,"残高:"+sendInfo.money+"[-"+value+"円]");
  postMessage("#money_log","[送金]<@"+sendId+">-><@"+recvId+">["+value+"円]");
  
  return;
}

function addMoney(userId, value) {
  cache = CacheService.getPublicCache();
  var userInfo = JSON.parse(cache.get(userId));
  
  //get user information in JSON.
  var sheet_id = PropertiesService.getScriptProperties().getProperty('sheet_id');
  var sheet = SpreadsheetApp.openById(sheet_id);
  
  if(userInfo==null){
    var lastrow = sheet.getLastRow();
    var userIdList = sheet.getSheetValues(1, 1, lastrow, 1);
    var moneyList = sheet.getSheetValues(1, 2, lastrow, 1);
    var userInfo = getInfo(userId, userIdList, moneyList);
    userInfo.money = parseInt(userInfo.money) + value;
    cache.put(userId, JSON.stringify(userInfo), 60*60*24);
  }
  
  //spreadSheetに増額後の値を入力
  sheet.getRange(userInfo.sheetMoneyAddress).setValue(userInfo.money);
    
  postMessage("@"+userId,"残高:"+userInfo.money+"[+"+value+"]");
  postMessage("#money_log","[入金]<@"+userId+">残高:"+userInfo.money+"[+"+value+"]");
}

function subMoney(userId, value) {  
  cache = CacheService.getPublicCache();
  var userInfo = JSON.parse(cache.get(userId));
  
  //get user information in JSON.
  var sheet_id = PropertiesService.getScriptProperties().getProperty('sheet_id');
  var sheet = SpreadsheetApp.openById(sheet_id);
  
  if(userInfo==null){
    var lastrow = sheet.getLastRow();
    var userIdList = sheet.getSheetValues(1, 1, lastrow, 1);
    var moneyList = sheet.getSheetValues(1, 2, lastrow, 1);
    var userInfo = getInfo(userId, userIdList, moneyList);
    userInfo.money = parseInt(userInfo.money) - value;
    cache.put(userId, JSON.stringify(userInfo), 60*60*24);
  }
  
  //spreadSheetに増額後の値を入力
  sheet.getRange(userInfo.sheetMoneyAddress).setValue(parseInt(userInfo.money) - value);
    
  postMessage("@"+userId,"残高:"+userInfo.money+"[-"+value+"]");
  if(money < 0){
    postMessage("@"+userId,"残高がマイナスです。本システムは融資ではありません。");
  }
  postMessage("#money_log","[出金]"+userInfo.userName+"残高:"+userInfo.money+"[-"+value+"]");
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