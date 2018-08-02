function menu(json){
  if(json.actions[0].name == "inputDialog"){
    sendInputDialog(json.trigger_id);
    
  }if(json.actions[0].name == "transDialog"){
    sendTransDialog(json.trigger_id);
    
  }if(json.actions[0].name == "addShopDialog"){
    sendAddShopDialog(json.trigger_id);
  }
  
  return json.original_message;
}

//menuを追加する
//これは直接実行する
function add_menu() {
  // slack channel url (where to send the message)
  var slackUrl = PropertiesService.getScriptProperties().getProperty('SLACK_INCOMMING_URL');

  // message text  
  var messageData = {
    "attachments": [{
      "title": "ISDL SHOP MENU",
      "fallback": "Sorry, no support for buttons.",
      "callback_id": "trigger_menu",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [{
        "name": "inputDialog",
        "text": "入金",
        "type": "button",
        "value": "inputDialog"
      },{
        "name": "transDialog",
        "text": "送金",
        "type": "button",
        "value": "transDialog",
      },{
        "name": "addShopDialog",
        "text": "商品追加",
        "type": "button",
        "value": "addShopDialog"
      }]
    }]
  }
  // format for Slack
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload': JSON.stringify(messageData)
  };
  // post to Slack
  var message = UrlFetchApp.fetch(slackUrl, options);
}