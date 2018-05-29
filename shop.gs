//Requirement Library
//isdlPay  MF69OVvcBvkymVokVsE1aHeaMJ5Q-zlzu

//Project properties
//SLACK_ACCESS_TOKEN: Slack API Oath Access token
//sheet_id          : Google SpreadSheet ID for 残高リスト

function doPost(e) {
  //exploit JSON from payload
  var parameter = e.parameter;
  var data = parameter.payload;
  var json = JSON.parse(decodeURIComponent(data));
  //var num = (json.original_message.attachments[0].text).split(": ");
  var name = json.original_message.attachments[0].title;
  var price = parseInt(json.actions[0].value);
  var image_url = json.original_message.attachments[0].image_url;
  
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  var sheet_id = PropertiesService.getScriptProperties().getProperty('sheet_id');
    
  var userId = json.user.id;
  var userName = isdlPay.getNameById(userId, sheet_id);
  
  if(json.actions[0].name == "buy"){
    isdlPay.subMoney(userId, price, slack_access_token, sheet_id);
    //num[1] = parseInt(num[1])-1;
  }else if(json.actions[0].name == "cancel"){
    isdlPay.addMoney(userId, price, slack_access_token, sheet_id);
    //num[1] = parseInt(num[1])+1;
  }
                    
  var replyMessage = {
    "replace_original": true,
    "response_type": "in_channel",
    "attachments": [{
      "title": name,
      //"text": "在庫: "+num[1],
      "fallback": "Sorry, no support for buttons.",
      "callback_id": "ButtonResponse",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [{
        "name": "buy",
        "text": price+"円",
        "type": "button",
        "value": price
      }/**キャンセルボタンを削除
      ,{
        "name": "cancel",
        "text": "キャンセル",
        "type": "button",
        "value": price
      }**/
      ],
      "image_url":image_url
    }]
  };

  return ContentService.createTextOutput(JSON.stringify(replyMessage)).setMimeType(ContentService.MimeType.JSON);
}