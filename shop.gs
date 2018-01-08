function doPost(e){
  //slackのtoken
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var verify_token = PropertiesService.getScriptProperties().getProperty('SLACK_EVENTS_TOKEN');
  var channel = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL_ID');
  var app = SlackApp.create(token); 
  
  //送信データが肝心の部分がjsonではなくstringのため，jsonデータに直している
  var jsonContent = (new Function("return " + e.postData.contents))();

  if (verify_token != jsonContent.token) {
    throw new Error("invalid token.");
  };
  
  if(jsonContent.event.item.channel == channel){
    var message = "";
    var text = tsToText(channel, jsonContent.event.item.ts).split(" ");
    
    var userId = jsonContent.event.user;
    var userName = isdlPay.getNameById(userId);
    if(parseInt(text[1]) > 0){
      isdlPay.subMoney(userId, parseInt(text[1]));
      var money = isdlPay.getMoney(userId);
      setLogSheet(userName,parseInt(text[1]));
                 
      postMessage(channel, tsToText(channel, jsonContent.event.item.ts));
      app.chatDelete(channel, jsonContent.event.item.ts); 
      var newMessage = app.channelsHistory(channel,{"count":1}).messages;
      addEmoji(token,channel,newMessage[0].ts);
    }
  }
}

//get slack message from timestamp information
function tsToText(channel, ts){
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var app = SlackApp.create(token); 
  var his = app.channelsHistory(channel,{"count":100}).messages;
  
  var text = "";
  for(var i in his){
    if(his[i].ts == ts){
      text = his[i].text;
    }
  }
  
  return text;
}

function postMessage(id,message){
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var bot_name = "ウィーゴ";
  var bot_icon = "http://www.hasegawa-model.co.jp/hsite/wp-content/uploads/2016/04/cw12p5.jpg";
  var app = SlackApp.create(token);   
  
  return app.postMessage(id, message, {
    username: bot_name,
    icon_url: bot_icon,
    link_names: 1
  });
}

function addEmoji(token, channel, timestamp){
  var method = "post";
  var url = "https://slack.com/api/reactions.add"
  
  //slackAppが対応していない制御用
  var payload = {
    'token'      : token,
    'channel'    : channel,
    'timestamp'  : timestamp,
    'name'       : "buy"
  };
 
  var params = {
    'method' : method,
    'payload' : payload
  };
  
  return UrlFetchApp.fetch(url, params);
}

function arrayParse(array){
  var parseArray = [];
  for(var i=0; i<array.length; i++){
    parseArray[i] = array[i][0]; 
  }
  
  return parseArray;
}

function setLogSheet(userName, value){
  //spreadsheetの読み込み
  var sheet = SpreadsheetApp.openById('1nVfofGTHTQR76cSLaYIA0p0BFjUyLgXFU22axxcBfv0');
  var lastrow = sheet.getLastRow()
  
  var date = "A"+(lastrow+1);
  var today = new Date();
  sheet.getRange(date).setValue(today);
  var user = "B"+(lastrow+1);
  sheet.getRange(user).setValue(userName);
  var valueAdd = "D"+(lastrow+1);
  sheet.getRange(valueAdd).setValue(value);
}