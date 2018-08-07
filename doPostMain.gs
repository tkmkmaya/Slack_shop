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
    var returnJson = {}
    if(json.callback_id=="trigger_addShop"){
      addShop(json);
      
    }else if(json.callback_id=="trigger_trans"){
      trans(json);
      
    }else if(json.callback_id=="trigger_input"){
      input(json);
      
    }
    
  //Button処理
  }else if(json.type=="interactive_message"){
    if(json.callback_id=="trigger_menu"){
      var returnJson = menu(json);
      
    }else if(json.callback_id=="trigger_shop"){
      var returnJson = shop(json);
      
    }
    //res_fetch(json.response_url, returnJson);
    
  //Actions処理
  }else if(json.type=="message_action"){
    var returnJson = {}
    action(json);
    
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

//デバッグ関数を作りたい
function doPostTest(){
  var e = {
    parameter :"test"
  }
}

function testFunction(){
  //cache = CacheService.getPublicCache();
  //cache.remove("U3QC336UR")
  var e = {
 "parameter": {
        "payload": "{\"type\":\"interactive_message\",\"actions\":[{\"name\":\"buy\",\"type\":\"button\",\"value\":\"0\"}],\"callback_id\":\"trigger_shop\",\"team\":{\"id\":\"T3QB93ZNU\",\"domain\":\"isdl-labo\"},\"channel\":{\"id\":\"C810A6QBF\",\"name\":\"shop\"},\"user\":{\"id\":\"U3R2MUQQJ\",\"name\":\"iwai\"},\"action_ts\":\"1533349033.609749\",\"message_ts\":\"1533349029.000009\",\"attachment_id\":\"1\",\"token\":\"9s4k3M8v3FwIppzQsKxDiEdL\",\"is_app_unfurl\":false,\"original_message\":{\"text\":\"\",\"bot_id\":\"BC1A1M8LR\",\"attachments\":[{\"fallback\":\"Sorry, no support for buttons.\",\"image_url\":\"https:\\/\\/www.el-aura.com\\/wp-content\\/uploads\\/2018\\/03\\/29d3bc99193cb0b837fb8cc53f050ae5-748x421.jpg\",\"image_width\":748,\"image_height\":421,\"image_bytes\":189655,\"callback_id\":\"trigger_shop\",\"title\":\"\\u5b87\\u5b99\",\"id\":1,\"color\":\"3AA3E3\",\"fields\":[{\"title\":\"\\u5728\\u5eab\\u6570\",\"value\":\"4\",\"short\":true},{\"title\":\"\\u51fa\\u54c1\\u8005\",\"value\":\"<@U3QC336UR>\",\"short\":true}],\"actions\":[{\"id\":\"1\",\"name\":\"buy\",\"text\":\"0\\u5186\",\"type\":\"button\",\"value\":\"0\",\"style\":\"\",\"confirm\":{\"text\":\"\\u5b87\\u5b99\\u3092\\u8cfc\\u5165\\u3057\\u307e\\u3059\\u304b\\uff1f\",\"title\":\"\\u8cfc\\u5165\\u753b\\u9762\",\"ok_text\":\"\\u8cfc\\u5165\",\"dismiss_text\":\"Cancel\"}}]}],\"type\":\"message\",\"subtype\":\"bot_message\",\"ts\":\"1533349029.000009\"},\"response_url\":\"https:\\/\\/hooks.slack.com\\/actions\\/T3QB93ZNU\\/410766861522\\/21p23Q3HWMMGEw1ht9OH9LHd\",\"trigger_id\":\"410766861554.126383135776.6a9a9f857819fb9d272486cb19eea8d2\"}"
    },
    "contextPath": "",
    "contentLength": 2168,
    "queryString": "",
    "parameters": {
        "payload": [
            "{\"type\":\"interactive_message\",\"actions\":[{\"name\":\"buy\",\"type\":\"button\",\"value\":\"0\"}],\"callback_id\":\"trigger_shop\",\"team\":{\"id\":\"T3QB93ZNU\",\"domain\":\"isdl-labo\"},\"channel\":{\"id\":\"C810A6QBF\",\"name\":\"shop\"},\"user\":{\"id\":\"U3R2MUQQJ\",\"name\":\"iwai\"},\"action_ts\":\"1533349033.609749\",\"message_ts\":\"1533349029.000009\",\"attachment_id\":\"1\",\"token\":\"9s4k3M8v3FwIppzQsKxDiEdL\",\"is_app_unfurl\":false,\"original_message\":{\"text\":\"\",\"bot_id\":\"BC1A1M8LR\",\"attachments\":[{\"fallback\":\"Sorry, no support for buttons.\",\"image_url\":\"https:\\/\\/www.el-aura.com\\/wp-content\\/uploads\\/2018\\/03\\/29d3bc99193cb0b837fb8cc53f050ae5-748x421.jpg\",\"image_width\":748,\"image_height\":421,\"image_bytes\":189655,\"callback_id\":\"trigger_shop\",\"title\":\"\\u5b87\\u5b99\",\"id\":1,\"color\":\"3AA3E3\",\"fields\":[{\"title\":\"\\u5728\\u5eab\\u6570\",\"value\":\"4\",\"short\":true},{\"title\":\"\\u51fa\\u54c1\\u8005\",\"value\":\"<@U3QC336UR>\",\"short\":true}],\"actions\":[{\"id\":\"1\",\"name\":\"buy\",\"text\":\"0\\u5186\",\"type\":\"button\",\"value\":\"0\",\"style\":\"\",\"confirm\":{\"text\":\"\\u5b87\\u5b99\\u3092\\u8cfc\\u5165\\u3057\\u307e\\u3059\\u304b\\uff1f\",\"title\":\"\\u8cfc\\u5165\\u753b\\u9762\",\"ok_text\":\"\\u8cfc\\u5165\",\"dismiss_text\":\"Cancel\"}}]}],\"type\":\"message\",\"subtype\":\"bot_message\",\"ts\":\"1533349029.000009\"},\"response_url\":\"https:\\/\\/hooks.slack.com\\/actions\\/T3QB93ZNU\\/410766861522\\/21p23Q3HWMMGEw1ht9OH9LHd\",\"trigger_id\":\"410766861554.126383135776.6a9a9f857819fb9d272486cb19eea8d2\"}"
        ]
    },
    "postData": {
        "type": "application/x-www-form-urlencoded",
        "length": 2168,
        "contents": "payload=%7B%22type%22%3A%22interactive_message%22%2C%22actions%22%3A%5B%7B%22name%22%3A%22buy%22%2C%22type%22%3A%22button%22%2C%22value%22%3A%220%22%7D%5D%2C%22callback_id%22%3A%22trigger_shop%22%2C%22team%22%3A%7B%22id%22%3A%22T3QB93ZNU%22%2C%22domain%22%3A%22isdl-labo%22%7D%2C%22channel%22%3A%7B%22id%22%3A%22C810A6QBF%22%2C%22name%22%3A%22shop%22%7D%2C%22user%22%3A%7B%22id%22%3A%22U3R2MUQQJ%22%2C%22name%22%3A%22iwai%22%7D%2C%22action_ts%22%3A%221533349033.609749%22%2C%22message_ts%22%3A%221533349029.000009%22%2C%22attachment_id%22%3A%221%22%2C%22token%22%3A%229s4k3M8v3FwIppzQsKxDiEdL%22%2C%22is_app_unfurl%22%3Afalse%2C%22original_message%22%3A%7B%22text%22%3A%22%22%2C%22bot_id%22%3A%22BC1A1M8LR%22%2C%22attachments%22%3A%5B%7B%22fallback%22%3A%22Sorry%2C+no+support+for+buttons.%22%2C%22image_url%22%3A%22https%3A%5C%2F%5C%2Fwww.el-aura.com%5C%2Fwp-content%5C%2Fuploads%5C%2F2018%5C%2F03%5C%2F29d3bc99193cb0b837fb8cc53f050ae5-748x421.jpg%22%2C%22image_width%22%3A748%2C%22image_height%22%3A421%2C%22image_bytes%22%3A189655%2C%22callback_id%22%3A%22trigger_shop%22%2C%22title%22%3A%22%5Cu5b87%5Cu5b99%22%2C%22id%22%3A1%2C%22color%22%3A%223AA3E3%22%2C%22fields%22%3A%5B%7B%22title%22%3A%22%5Cu5728%5Cu5eab%5Cu6570%22%2C%22value%22%3A%224%22%2C%22short%22%3Atrue%7D%2C%7B%22title%22%3A%22%5Cu51fa%5Cu54c1%5Cu8005%22%2C%22value%22%3A%22%3C%40U3QC336UR%3E%22%2C%22short%22%3Atrue%7D%5D%2C%22actions%22%3A%5B%7B%22id%22%3A%221%22%2C%22name%22%3A%22buy%22%2C%22text%22%3A%220%5Cu5186%22%2C%22type%22%3A%22button%22%2C%22value%22%3A%220%22%2C%22style%22%3A%22%22%2C%22confirm%22%3A%7B%22text%22%3A%22%5Cu5b87%5Cu5b99%5Cu3092%5Cu8cfc%5Cu5165%5Cu3057%5Cu307e%5Cu3059%5Cu304b%5Cuff1f%22%2C%22title%22%3A%22%5Cu8cfc%5Cu5165%5Cu753b%5Cu9762%22%2C%22ok_text%22%3A%22%5Cu8cfc%5Cu5165%22%2C%22dismiss_text%22%3A%22Cancel%22%7D%7D%5D%7D%5D%2C%22type%22%3A%22message%22%2C%22subtype%22%3A%22bot_message%22%2C%22ts%22%3A%221533349029.000009%22%7D%2C%22response_url%22%3A%22https%3A%5C%2F%5C%2Fhooks.slack.com%5C%2Factions%5C%2FT3QB93ZNU%5C%2F410766861522%5C%2F21p23Q3HWMMGEw1ht9OH9LHd%22%2C%22trigger_id%22%3A%22410766861554.126383135776.6a9a9f857819fb9d272486cb19eea8d2%22%7D",
        "name": "postData"
    }
}
  doPost(e); 
}

function testFunction2(){
  var e = {
    "parameter": {
        "payload": "{\"type\":\"dialog_submission\",\"token\":\"9s4k3M8v3FwIppzQsKxDiEdL\",\"action_ts\":\"1533354072.920587\",\"team\":{\"id\":\"T3QB93ZNU\",\"domain\":\"isdl-labo\"},\"user\":{\"id\":\"U3R2MUQQJ\",\"name\":\"iwai\"},\"channel\":{\"id\":\"C810A6QBF\",\"name\":\"shop\"},\"submission\":{\"product_name\":\"\\u5b87\\u5b99\\u4eba\",\"product_price\":\"0\",\"product_stock\":\"0\",\"product_imageurl\":null,\"seller\":\"isdl\"},\"callback_id\":\"trigger_addShop\",\"response_url\":\"https:\\/\\/hooks.slack.com\\/app\\/T3QB93ZNU\\/411813932199\\/jwFZUXPrZNtaMlKO0DkmrscP\"}"
    },
    "contextPath": "",
    "contentLength": 757,
    "queryString": "",
    "parameters": {
        "payload": [
            "{\"type\":\"dialog_submission\",\"token\":\"9s4k3M8v3FwIppzQsKxDiEdL\",\"action_ts\":\"1533354072.920587\",\"team\":{\"id\":\"T3QB93ZNU\",\"domain\":\"isdl-labo\"},\"user\":{\"id\":\"U3R2MUQQJ\",\"name\":\"iwai\"},\"channel\":{\"id\":\"C810A6QBF\",\"name\":\"shop\"},\"submission\":{\"product_name\":\"\\u5b87\\u5b99\\u4eba\",\"product_price\":\"0\",\"product_stock\":\"0\",\"product_imageurl\":null,\"seller\":\"isdl\"},\"callback_id\":\"trigger_addShop\",\"response_url\":\"https:\\/\\/hooks.slack.com\\/app\\/T3QB93ZNU\\/411813932199\\/jwFZUXPrZNtaMlKO0DkmrscP\"}"
        ]
    },
    "postData": {
        "type": "application/x-www-form-urlencoded",
        "length": 757,
        "contents": "payload=%7B%22type%22%3A%22dialog_submission%22%2C%22token%22%3A%229s4k3M8v3FwIppzQsKxDiEdL%22%2C%22action_ts%22%3A%221533354072.920587%22%2C%22team%22%3A%7B%22id%22%3A%22T3QB93ZNU%22%2C%22domain%22%3A%22isdl-labo%22%7D%2C%22user%22%3A%7B%22id%22%3A%22U3R2MUQQJ%22%2C%22name%22%3A%22iwai%22%7D%2C%22channel%22%3A%7B%22id%22%3A%22C810A6QBF%22%2C%22name%22%3A%22shop%22%7D%2C%22submission%22%3A%7B%22product_name%22%3A%22%5Cu5b87%5Cu5b99%5Cu4eba%22%2C%22product_price%22%3A%220%22%2C%22product_stock%22%3A%220%22%2C%22product_imageurl%22%3Anull%2C%22seller%22%3A%22isdl%22%7D%2C%22callback_id%22%3A%22trigger_addShop%22%2C%22response_url%22%3A%22https%3A%5C%2F%5C%2Fhooks.slack.com%5C%2Fapp%5C%2FT3QB93ZNU%5C%2F411813932199%5C%2FjwFZUXPrZNtaMlKO0DkmrscP%22%7D",
        "name": "postData"
    }
  }
  doPost(e); 
}