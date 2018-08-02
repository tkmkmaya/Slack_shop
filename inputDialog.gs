function sendInputDialog(trigger_id) {
  // slack channel url (where to send the message)
  var slackUrl = "https://slack.com/api/dialog.open";
  
  //get slack access token from properties.
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  
  // message text  
  var messageData = {
    "callback_id": "trigger_input",
    "title": "入金画面",
    "submit_label": "入金",
    "elements": [
      {
        "label": "入金価格",
        "name": "input_price",
        "type": "text",
        "placeholder": "0",
        "subtype": "number"
      }
    ]
  }
  // format for Slack
  var options = {
    method: 'post',
    payload: {
      "token": slack_access_token,
      "trigger_id": trigger_id,
      "dialog": JSON.stringify(messageData)
    },
  };
  
  // post to Slack
  UrlFetchApp.fetch(slackUrl, options);
}

function input(json) {
  //get slack access token from properties.
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  
  //get sheet's ID from properties.
  var sheet_id = PropertiesService.getScriptProperties().getProperty('sheet_id');
  if(sheet_id == null){
    sheet_id = create_spreadSheets();
  }
  
  var customerId = json.user.id;
  var price = parseInt(json.submission.input_price);
  
  addMoney(customerId, price, slack_access_token, sheet_id);
}