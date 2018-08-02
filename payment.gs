//Requirement Library
//slackApp: M3W5Ut3Q39AaIwLquryEPMwV62A3znfOO

function transMoney(recvId, sendId, value, slack_access_token, sheet_id) {
  var app = SlackApp.create(slack_access_token);  
  
  //出品者自身の商品を買った場合の例外処理
  if(recvId == sendId){
    postMessage(app, "@"+recvId,"出品者自身の購入のため、処理は行いませんでした。["+value+"円]");
    postMessage(app, "#money_log","出品者自身の購入のため、処理は行いませんでした。["+value+"円]");
    return;
  }
   
  //get user information in JSON.
  var sheet = SpreadsheetApp.openById(sheet_id);
  var lastrow = sheet.getLastRow();
  var userIdList = sheet.getSheetValues(1, 1, lastrow, 1);
  var moneyList = sheet.getSheetValues(1, 2, lastrow, 1);
  
  var recvInfo = getInfo(app, recvId, sheet, userIdList, moneyList);
  var sendInfo = getInfo(app, sendId, sheet, userIdList, moneyList);
  
  //どちらかが新規ユーザーであった場合はsheetを再読込
  if(recvInfo.newUserCheck || sendInfo.newUserCheck){
    sheet = SpreadsheetApp.openById(sheet_id);
  }
  
  //spreadSheetに増減後の値を入力
  sheet.getRange(recvInfo.sheetMoneyAddress).setValue(parseInt(recvInfo.money) + value);
  sheet.getRange(sendInfo.sheetMoneyAddress).setValue(parseInt(sendInfo.money) - value);
  
  
  postMessage(app, "@"+recvId,"残高:"+(parseInt(recvInfo.money) + value)+"[+"+value+"円]");
  postMessage(app, "@"+sendId,"残高:"+(parseInt(sendInfo.money) - value)+"[-"+value+"円]");
  postMessage(app, "#money_log","[送金]<@"+sendId+">-><@"+recvId+">["+value+"円]");
}

function addMoney(userId, value, slack_access_token, sheet_id) {
  var app = SlackApp.create(slack_access_token);
  
  //get user information in JSON.
  var sheet = SpreadsheetApp.openById(sheet_id);
  var lastrow = sheet.getLastRow();
  var userIdList = sheet.getSheetValues(1, 1, lastrow, 1);
  var moneyList = sheet.getSheetValues(1, 2, lastrow, 1);
  var userInfo = getInfo(app, userId, sheet, userIdList, moneyList);
  
  //新規ユーザーであった場合はsheetを再読込
  if(userInfo.newUserCheck){
    sheet = SpreadsheetApp.openById(sheet_id);
  }
  
  //spreadSheetに増額後の値を入力
  sheet.getRange(userInfo.sheetMoneyAddress).setValue(parseInt(userInfo.money) + value);
    
  
  postMessage(app, "@"+userId,"残高:"+(parseInt(userInfo.money) + value)+"[+"+value+"]");
  postMessage(app, "#money_log","[入金]<@"+userId+">残高:"+(parseInt(userInfo.money) + value)+"[+"+value+"]");
}

function subMoney(userId, value, slack_access_token, sheet_id) {
  var app = SlackApp.create(slack_access_token);
  
  //get user information in JSON.
  var sheet = SpreadsheetApp.openById(sheet_id);
  var lastrow = sheet.getLastRow();
  var userIdList = sheet.getSheetValues(1, 1, lastrow, 1);
  var moneyList = sheet.getSheetValues(1, 2, lastrow, 1);
  var userInfo = getInfo(app, userId, sheet, userIdList, moneyList);
  
  //新規ユーザーであった場合はsheetを再読込
  if(userInfo.newUserCheck){
    sheet = SpreadsheetApp.openById(sheet_id);
  }
  
  //spreadSheetに増額後の値を入力
  sheet.getRange(userInfo.sheetMoneyAddress).setValue(parseInt(userInfo.money) - value);
    

  postMessage(app, "@"+userId,"残高:"+(parseInt(userInfo.money) + value)+"[-"+value+"]");
  if(money < 0){
    postMessage(app, "@"+userId,"残高がマイナスです。本システムは融資ではありません。");
  }
  postMessage(app, "#money_log","[出金]"+userInfo.userName+"残高:"+(parseInt(userInfo.money) + value)+"[-"+value+"]");
}

function arrayParse(array) {
  var parseArray = [];
  for (var i = 0; i < array.length; i++) {
    parseArray[i] = array[i][0];
  }
  return parseArray;
}

function getInfo(app, userId, sheet, userIdList, moneyList){                  

  var indexNum = arrayParse(userIdList).indexOf(userId);
  
  //新規ユーザーの検出
  var newUserCheck = false; //新規ユーザーか否かのフラグ
  if(indexNum >= 0){
    var money = moneyList[indexNum];
  }else{
    //新規ユーザーを仮追加
    var lastrow = userIdList.length;
    sheet.getRange("A"+(lastrow+1)).setValue(userId);
    sheet.getRange("B"+(lastrow+1)).setValue("0");
    
    //SlackのWeb APIでユーザーIDから各種情報を取得
    var userInfo = app.usersInfo(userId);
    var userRealName = userInfo.user.profile.real_name;
    var userName = userInfo.user.name;
    
    sheet.getRange("C"+(lastrow+1)).setValue(userRealName);
    sheet.getRange("D"+(lastrow+1)).setValue("@"+userName);
    
    //例: Excelのn行目に新規ユーザーを追加した場合、lastrowには(n-1)が入っており、新規ユーザーは配列的には(n-1)に追加されたことにななる。
    indexNum = lastrow;
    
    var money = "0";
    var userName = userRealName;
    newUserCheck = true;
  }
  
  //JSONにして返す
  var info = {
    "userId": userId,
    "money": money,
    "indexNum": indexNum,
    "sheetMoneyAddress": "B"+(indexNum+1),
    "newUserCheck": newUserCheck
  }     
  
  return info;
}

function postMessage(app, id, message) {
  var bot_name = "ウィーゴ";
  var bot_icon = "http://www.hasegawa-model.co.jp/hsite/wp-content/uploads/2016/04/cw12p5.jpg";
  return app.postMessage(id, message, {
    username: bot_name,
    icon_url: bot_icon,
    link_names: 1
  });
}