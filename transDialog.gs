function sendTransDialog(trigger_id) {
  // slack channel url (where to send the message)
  var slackUrl = "https://slack.com/api/dialog.open";
  
  //get slack access token from properties.
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  
  // message text  
  var messageData = {
    "callback_id": "trigger_trans",
    "title": "送金画面",
    "submit_label": "送金",
    "elements": [
      {
        "label": "送金価格",
        "name": "transPrice",
        "type": "text",
        "placeholder": "0",
        "subtype": "number"
      },{
        "label": "送金相手",
        "name": "recvId",
        "type": "select",
        "data_source": "users"
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

function trans(json) {
  var sendId = json.user.id;
  var price = parseInt(json.submission.transPrice);
  var recvId = json.submission.recvId;
  
  transMoney(recvId, sendId, price);
}