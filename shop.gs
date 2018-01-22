function doPost(e) {
  // exploit JSON from payload
  //var data = contents.substr(8); //[payload={JSON}]
  var parameter = e.parameter;
  var data = parameter.payload;
  var json = JSON.parse(decodeURIComponent(data));
  var num = (json.original_message.attachments[0].text).split(": ");
  var title = json.original_message.attachments[0].title;
  var price = parseInt(json.actions[0].value);
  var image_url = json.original_message.attachments[0].image_url;
    
  var userId = json.user.id;
  var userName = isdlPay.getNameById(userId);
  
  if (parseInt(price) > 0) {
    if(json.actions[0].name == "buy"){
      isdlPay.subMoney(userId, price);
      setLogSheet(userName, price);
      num[1] = parseInt(num[1])-1;
    }else if(json.actions[0].name == "cancel"){
      isdlPay.addMoney(userId, price);
      num[1] = parseInt(num[1])+1;
    }
  }
                    
  var replyMessage = {
    "replace_original": true,
    "response_type": "in_channel",
    "attachments": [{
      "title": title,
      "text": "在庫: "+num[1],
      "fallback": "Sorry, no support for buttons.",
      "callback_id": "ButtonResponse",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [{
        "name": "buy",
        "text": price+"円",
        "type": "button",
        "value": price
      },{
        "name": "cancel",
        "text": "キャンセル",
        "type": "button",
        "value": price
      }],
      "image_url":image_url
    }]
  };

  return ContentService.createTextOutput(JSON.stringify(replyMessage)).setMimeType(ContentService.MimeType.JSON);
}

function setLogSheet(userName, value){
  //spreadsheetの読み込み
  var SS = SpreadsheetApp.openById('1nVfofGTHTQR76cSLaYIA0p0BFjUyLgXFU22axxcBfv0');
  var sheet=SS.getSheetByName("当月");
  var lastrow=sheet.getDataRange().getLastRow();
  
  var today = new Date();
  var data = [[today,userName,"",value]];
  sheet.getRange(lastrow+1,1,1,4).setValues(data);
}