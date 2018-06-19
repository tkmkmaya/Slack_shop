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

  var product = (json.actions[0].value).split(",");
  var product_price = parseInt(product[0]);
  var product_add_user = product[1];
  
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  
  var sheet_id = PropertiesService.getScriptProperties().getProperty('sheet_id');
  if(sheet_id == null){
    sheet_id = create_spreadSheets();
  }
    
  var customerId = json.user.id;
  if(json.actions[0].name == "buy"){
    isdlPay.transMoney(product_add_user, customerId, product_price, slack_access_token, sheet_id)

    //num[1] = parseInt(num[1])-1;
  }
  /**
  else if(json.actions[0].name == "cancel"){
    isdlPay.addMoney(userId, price, slack_access_token, sheet_id);
    //num[1] = parseInt(num[1])+1;
  }
  **/
                    
  var replyMessage = {
    "replace_original": true,
    "response_type": "in_channel",
    "attachments": [{
      "title": json.original_message.attachments[0].title,
      "text": json.original_message.attachments[0].text,
      "fallback": "Sorry, no support for buttons.",
      "callback_id": "ButtonResponse",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [{
        "name": "buy",
        "text": product_price+"円",
        "type": "button",
        "value": product_price+","+product_add_user
      }/**キャンセルボタンを削除
      ,{
        "name": "cancel",
        "text": "注文をキャンセル",
        "type": "button",
        "value": price
        
      }**/
      ],
      "image_url":json.original_message.attachments[0].image_url
    }]
  };

  return ContentService.createTextOutput(JSON.stringify(replyMessage)).setMimeType(ContentService.MimeType.JSON);
}

//名簿を記録したスプレッドシードが無い場合、作成してpropertiesにも格納する。
function create_spreadSheets() {
  var sheet_id = SpreadsheetApp.create("members").getId();
 
  PropertiesService.getScriptProperties.setProperty("sheet_id",sheet_id);
  return sheet_id;
}


//デバッグ関数を作りたい
function doPostTest(){
  var e = {
    parameter :"test"
  }
}