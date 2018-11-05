//Actionsコマンドを受け取った時の処理
function action(json) {
  var message = json.message;
  var ts = message.ts;
  
  if(json.callback_id=="change_image"){
    message.attachments[0].image_url = getGoogleCustomSearchImage(message.attachments[0].title);
    
  }else if(json.callback_id=="stock_decrement"){
    message.attachments[0].fields[0].value--;
    
  }else if(json.callback_id=="priority_display"){
    //何もしない
    
  }else if(json.callback_id=="product_delete"){
    //何もしない
    
  }
  
  //投稿
  if(json.callback_id!="product_delete"){
    var slackUrl = PropertiesService.getScriptProperties().getProperty('SLACK_INCOMMING_URL');
    // format for Slack
    var options = {
      'method': 'post',
      'contentType': 'application/json',
      // Convert the JavaScript object to a JSON string.
      'payload': JSON.stringify(message)
    };
    // post to Slack
    UrlFetchApp.fetch(slackUrl, options);
  }
  chatDelete(ts);
}

function chatDelete(ts){
  //get slack access token from properties.
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var channelId = PropertiesService.getScriptProperties().getProperty('SHOP_CHANNEL_ID');
  var slackUrl = "https://slack.com/api/chat.delete";
  
  var options = {
    method: 'post',
    payload: {
      "token": slack_access_token,
      "channel": channelId,
      "ts":ts
    }
  };
  
  // post to Slack
  UrlFetchApp.fetch(slackUrl, options);
}