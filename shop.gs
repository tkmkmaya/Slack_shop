//Requirement Library
//slackApp  M3W5Ut3Q39AaIwLquryEPMwV62A3znfOO

//Project properties
//SLACK_ACCESS_TOKEN: Slack API Oath Access token
//sheet_id          : Google SpreadSheet ID for 残高リスト

function doPost(e) {
　//exploit JSON from payload
  var parameter = e.parameter;
  var data = parameter.payload;
  var json = JSON.parse(decodeURIComponent(data));

  var product = (json.actions[0].value).split(",");
  var product_price = parseInt(product[0]);
  var product_add_user = product[1];
  
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  
  var sheet_id = PropertiesService.getScriptProperties().getProperty('sheet_id');
  if(sheet_id == null){
    sheet_id = create_spreadSheets();
  }
    
  var customerId = json.user.id;
  var replyMessage = json.original_message;
  
  if(json.actions[0].name == "buy"){
    transMoney(product_add_user, customerId, product_price, slack_access_token, sheet_id);
    replyMessage.attachments[0].fields[0].value -= 1;
  }else if(json.actions[0].name == "cancel"){
    transMoney(customerId, product_add_user, product_price, slack_access_token, sheet_id);
    replyMessage.attachments[0].fields[0].value += 1;
  }else if(json.actions[0].name == "input"){
    addMoney(customerId, product_price, slack_access_token, sheet_id);
  }

  res_fetch(json.response_url, replyMessage);
  return ContentService.createTextOutput(JSON.stringify(replyMessage)).setMimeType(ContentService.MimeType.JSON);
}

//名簿を記録したスプレッドシードが無い場合、作成してpropertiesにも格納する。
function create_spreadSheets() {
  var sheet_id = SpreadsheetApp.create("members").getId();
 
  PropertiesService.getScriptProperties.setProperty("sheet_id",sheet_id);
  return sheet_id;
}

//responce_urlに直接返す
function res_fetch(res_url, message){
  // format for Slack
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload': JSON.stringify(message)
  };
  // post to Slack
  UrlFetchApp.fetch(res_url, options);
}

//デバッグ関数を作りたい
function doPostTest(){
  var e = {
    parameter :"test"
  }
}