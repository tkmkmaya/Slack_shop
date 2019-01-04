//資金処理のための関数群

//cacheにtransMoneyのキューを追加する.
function transMoney(recvId, sendId, productName, value){
  var data = getCache("transMoney");
  
  var newData = {
    "recvId": recvId,
    "sendId": sendId,
    "productName": productName,
    "value": value
  }
  
  //オブジェクトであるnewDataをstrに変換して配列に追加.
  data.push(JSON.stringify(newData));
  
  //配列を;で分割するstrに変換してcacheに格納
  cache = CacheService.getScriptCache();
  cache.put("transMoney", data.join(';'), 60*2); 
}

//定期実行でcacheを読みtransMoneyを実行する
function timeDrivenTransMoney(){
  //get slack access token from properties.
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  
  //cacheを取得
  var data = getCache("transMoney");
  
  //配列の中身をstrからjsonに戻し，postMessageExecに投げる.
  for(var i=0; i<data.length; i++){
    data[i] = JSON.parse(data[i]);
    transMoneyExec(data[i].recvId, data[i].sendId, data[i].productName, data[i].value);
  }
  return;
}

function transMoneyExec(recvId, sendId, productName, value) {  
  //出品者自身の商品を買った場合の例外処理
  if(recvId == sendId){
    postMessage("@"+recvId,"出品者自身の購入のため、処理は行いませんでした。["+value+"円]");
    return;
  } 
  
  var memberSheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  
  var recvInfo = arrayFormat(SpreadSheetsSQL.open(memberSheetId, "sheet1").select(['id', 'price', 'name']).filter("id = " + recvId).result());
  var sendInfo = arrayFormat(SpreadSheetsSQL.open(memberSheetId, "sheet1").select(['id', 'price', 'name']).filter("id = " + sendId).result());
  
  recvInfo.price = parseInt(recvInfo.price) + parseInt(value);
  sendInfo.price = parseInt(sendInfo.price) - parseInt(value);
 
  SpreadSheetsSQL.open(memberSheetId, "sheet1").updateRows({price: recvInfo.price}, "id = "+recvId);
  SpreadSheetsSQL.open(memberSheetId, "sheet1").updateRows({price: sendInfo.price}, "id = "+sendId);
      
  //Logに出力
  var logSheetId = PropertiesService.getScriptProperties().getProperty('LOG_SHEET_ID');
  var date = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd/HH/mm");
  
  SpreadSheetsSQL.open(logSheetId, "sheet1").insertRows([
      {date: date, productName: productName, recvId: recvInfo.name, sendId: sendInfo.name, price: value},
  ]);
  //Logここまで
 
  //Slackに投稿
  postMessage("@" + recvId, "[販売]" + productName + " / 残高:¥" + recvInfo.price + "(+" + value + ") <- <@" + sendId + ">");
  postMessage("@" + sendId, "[購入]" + productName + " / 残高:¥" + sendInfo.price + "(-" + value + ") -> <@" + recvId + ">");
  postMessage("#money_log","[送金]" + productName + " <@" + sendId + "> -> <@" + recvId + ">[¥" + value + "]");
  
  return;
}
    
function addMoney(recvId, value) {  

  var memberSheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID'); 
  var recvInfo = arrayFormat(SpreadSheetsSQL.open(memberSheetId, "sheet1").select(['id', 'price', 'name']).filter("id = " + recvId).result());
  
  recvInfo.price = parseInt(recvInfo.price) + parseInt(value);
  SpreadSheetsSQL.open(memberSheetId, "sheet1").updateRows({price: recvInfo.price}, "id = "+recvId);     
 
  //Slackに投稿
  postMessage("@" + recvId, "[入金] 残高:¥" + recvInfo.price + "(+" + value + ")");
  postMessage("#money_log","[入金] <@" + recvId + ">[¥" + value + "]");
  
  return;
}

function getCache(key){  
  cache = CacheService.getScriptCache();
  var data = cache.get(key);
  
  //cacheの競合が怖いのでなるべく早く消しておく
  cache.remove(key);
  
  //cacheの中身がnullならば空配列に，nullでないならstrを配列に変換する.
  if(data==null){
    data = [];
  }else{
    data = data.split(';');
  }
  
  return data;
}

//SlackのWebAPIを叩く.
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

function arrayFormat(array){
  return array[0]
}

function arrayParse(array) {
  var parseArray = [];
  for (var i = 0; i < array.length; i++) {
    parseArray[i] = array[i][0];
  }
  return parseArray;
}

