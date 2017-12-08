function main() {
  //slackのtoken
  var token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var app = SlackApp.create(token); 
  
  //会計処理のログを投稿するチャンネルのID
  var channel = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL_ID');

  //購買チャンネルのログを取得
  var his = app.channelsHistory(channel,{"count":100}).messages;
  var message = "";
  
  for(var i in his){
    if(his[i].reactions.length==0){
      //ユーザーの入荷投稿にもreactionを付与する
      addEmoji(token,channel,his[i].ts);
    }
  }
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