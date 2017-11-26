function main() {
  //slackのtoken
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var app = SlackApp.create(token); 
  
  //会計処理のログを投稿するチャンネルのID
  var channel = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL_ID');

  //購買チャンネルのログを取得
  var his = app.channelsHistory(channel,{"count":100}).messages;
  
  var message = "";
  
  //spreadsheetの読み込み
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastrow = sheet.getLastRow();
　var member = sheet.getSheetValues(1, 1, lastrow, 1);  //データ行のみを取得する
  var member_name = sheet.getSheetValues(1,3,lastrow,1);
　var money = sheet.getSheetValues(1, 2, lastrow, 1); //データ行のみを取得する
  var money_old = money.slice(0, money.length);
  
  //各商品の投稿に対して、付けられたreactionをチェック
  var messagesNum = his.length;
  
  for(var i in his){
    var price = (his[i].text).split(" ");
    if(his[i].reactions != null){
      for(var j in his[i].reactions){
        for(var l in his[i].reactions[j].users){
          //reactionを付けたユーザーの残高を引く
          var indexNum = arrayParse(member).indexOf(his[i].reactions[j].users[l]);
          
          //bot自身のreactionはindexOfが-1なので除外
          if(indexNum>=0){
            money[indexNum] = money[indexNum] - price[1];
            postMessage("@"+member[indexNum],"残高:"+money[indexNum]+"[-"+price[1]+"]");
            postMessage("#money_log","[購入]"+member_name[indexNum]+"[-"+price[1]+"]");
          
            sheet.getRange(indexNum+1,2).setValue(money[indexNum]);
          }
        }
      }
      //必ずbotが1つreactionを付けているので、それを無視するようにして購入があった投稿を再投稿
      if((his[i].reactions.length!=1)||(his[i].reactions[j].users.length!=1)){        
        var messageCache = his[i].text;
        app.chatDelete(channel, his[i].ts); 
        postMessage(channel, messageCache);
        var newMessage = app.channelsHistory(channel,{"count":1}).messages;
        addEmoji(token,channel,newMessage[0].ts);
      }
    }
  }
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
