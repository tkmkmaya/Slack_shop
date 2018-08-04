/**
//cacheにpostMessageのキューを追加する.
function postMessage(id,message){
  cache = CacheService.getPublicCache();
  var data = cache.get("messages");
  
  //cacheの中身がnullならば空配列に，nullでないならstrを配列に変換する.
  if(data==null){
    data = [];
  }else{
    data = data.split(';');
  }
  
  var newData = {
    "id": id,
    "message": message
  }
  
  //オブジェクトであるnewDataをstrに変換して配列に追加.
  data.push(JSON.stringify(newData));
  
  //配列を;で分割するstrに変換.
  cache.put("messages", data.join(';'), 60*2); 
}

//定期実行でcacheを読みpostMessageを実行する
function timeDrivenPostMessage(){
  //get slack access token from properties.
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  
  //cacheを取得しstrを配列に戻す.
  cache = CacheService.getPublicCache();
  
  var data = cache.get("messages")
  
  if(data==null){
    return;
  }else{
    data = data.split(';');
  }
  
  var data = (cache.get("messages")).split(';');
  
  //cacheの競合が怖いのでなるべく早く消しておく
  cache.remove("messages");
  
  //配列の中身をstrからjsonに戻し，postMessageExecに投げる.
  for(var i=0; i<data.length; i++){
    data[i] = JSON.parse(data[i]);
    postMessageExec(data[i].id,data[i].message,slack_access_token);
  }
  return;
}
**/

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

function test(){
  postMessage("U3R2MUQQJ","test")
}

