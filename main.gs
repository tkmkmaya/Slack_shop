//Project properties
//SLACK_ACCESS_TOKEN: Slack API Oath Access token
//SLACK_INCOMMING_URL: Your Slack incomming webhook's URL
//SHOP_CHANNEL_ID: shop channel's id
//sheet_id          : Google SpreadSheet ID for 残高リスト

//以下は商品追加でGoogle検索から持ってくる際のもの
//GOOGLE_API_KEY
//GOOGLE_CSE_ID


function doPost(e) {
 //MailApp.sendEmail('iwa.pc.sw.mo@gmail.com', '件名', JSON.stringify(e));
　//exploit JSON from payload
  var parameter = e.parameter;
  var data = parameter.payload;
  var json = JSON.parse(decodeURIComponent(data));
  
  //Dialog処理
  if(json.type=="dialog_submission"){
    if(json.callback_id=="trigger_addShop"){
      addShop(json); //addShopDialog.gs
      
    }else if(json.callback_id=="trigger_trans"){ 
      trans(json);   //transDialog.gs
      
    }else if(json.callback_id=="trigger_input"){
      input(json);   //inputDialog.gs
      
    }
    //Dialogの返答には空オブジェクトを返す.
    var returnJson = {}
  //Button処理
  }else if(json.type=="interactive_message"){
    if(json.callback_id=="trigger_menu"){
      var returnJson = menu(json); //menuProc.gs
      
    }else if(json.callback_id=="trigger_shop"){
      var returnJson = shop(json); //shopProc.gs
      
    }
    //res_fetch(json.response_url, returnJson);
    
  //Actions処理
  }else if(json.type=="message_action"){
    var returnJson = {}
    action(json);  //actionDialog.gs
    
  }
  
  return ContentService.createTextOutput(JSON.stringify(returnJson)).setMimeType(ContentService.MimeType.JSON);
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

