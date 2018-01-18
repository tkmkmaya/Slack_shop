function doPost(e) {
  // exploit JSON from payload
  //var data = contents.substr(8); //[payload={JSON}]
  var parameter = e.parameter;
  var data = parameter.payload;
  var json = JSON.parse(decodeURIComponent(data));
  var original_text = json.original_message.text;
  
  var text = original_text.split(" ");
  var userId = json.user.id;
  var userName = isdlPay.getNameById(userId);
  
  if (parseInt(text[1]) > 0) {
      isdlPay.subMoney(userId, parseInt(text[1]));
      var money = isdlPay.getMoney(userId);
      setLogSheet(userName, parseInt(text[1]));
  }
  
  var replyMessage = {
    "replace_original": true,
    "response_type": "in_channel",
    "text": original_text,
    "attachments": [{
      "fallback": "Sorry, no support for buttons.",
      "callback_id": "ButtonResponse",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [{
        "name": "購入",
        "text": "購入",
        "type": "button",
        "value": "chess"
      }]
    }]
  };
  //var originalMessage = (new Function("return " + e.parameter.))();
  return ContentService.createTextOutput(JSON.stringify(replyMessage)).setMimeType(ContentService.MimeType.JSON);
  //return ContentService.createTextOutput(JSON.parse(e)).setMimeType(ContentService.MimeType.JSON);
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