//menuから商品追加ボタンを押された時の処理

function sendAddShopDialog(trigger_id) {
  // slack channel url (where to send the message)
  var slackUrl = "https://slack.com/api/dialog.open"
  var slack_access_token = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
  
  // message text  
  var messageData = {
    "callback_id": "trigger_addShop",
    "title": "商品追加画面",
    "submit_label": "追加",
    "elements": [
      {
        "label": "商品名",
        "name": "product_name",
        "type": "text",
        "placeholder": "じゃがりこ"
      },{
        "label": "価格",
        "name": "product_price",
        "type": "text",
        "placeholder": "0",
        "subtype": "number"
      },{
        "label": "在庫数",
        "name": "product_stock",
        "type": "text",
        "placeholder": "0",
        "subtype": "number"
      },{
        "label": "画像URL",
        "name": "product_imageurl",
        "type": "text",
        "subtype": "url",
        "placeholder": "http://",
        "optional": "true"
      },{
        "label": "出品者(基本はYouでOK)",
        "type": "select",
        "name": "seller",
        "value": "you",
        "options": [
          {
            "label": "You",
            "value": "you"
          },{
           "label": "研究室",
           "value": "isdl"
         }
        ]
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
  return UrlFetchApp.fetch(slackUrl, options);
}

function addShop(json){
  //出品者のチェック
  if(json.submission.seller=="you"){
    var user_name = json.user.name;
  }else if(json.submission.seller=="isdl"){
    var user_name = "isdl"; 
  }
  var product_name = json.submission.product_name;
  var product_price = json.submission.product_price;
  var product_stock = json.submission.product_stock;
  
  //画像URLが入力されていない場合はGoogle画像検索から持ってくる
  if (json.submission.product_imageurl == null) {
    var product_imageurl = "Google"
  } else {
    var product_imageurl = json.submission.product_imageurl;
  }
  
  addShopExec(user_name, product_name ,product_price ,product_stock ,product_imageurl);
}

/**
//cacheにtransMoneyのキューを追加する.
function addShop(json){
  //出品者のチェック
  if(json.submission.seller=="you"){
    var user_name = json.user.name;
  }else if(json.submission.seller=="isdl"){
    var user_name = "isdl"; 
  }
  var product_name = json.submission.product_name;
  var product_price = json.submission.product_price;
  var product_stock = json.submission.product_stock;
  
  //画像URLが入力されていない場合はGoogle画像検索から持ってくる
  if (json.submission.product_imageurl == null) {
    var product_imageurl = "Google"
  } else {
    var product_imageurl = json.submission.product_imageurl;
  }
  
  cache = CacheService.getPublicCache();
  var data = cache.get("addShop");
  
  //cacheの中身がnullならば空配列に，nullでないならstrを配列に変換する.
  if(data==null){
    data = [];
  }else{
    data = data.split(';');
  }
  
  var newData = {
    "user_name": user_name,
    "product_name": product_name,
    "product_price": product_price,
    "product_stock": product_stock,
    "product_imageurl": product_imageurl
  }
  
  //オブジェクトであるnewDataをstrに変換して配列に追加.
  data.push(JSON.stringify(newData));
  
  //配列を;で分割するstrに変換.
  cache.put("addShop", data.join(';'), 60*2); 
}

//定期実行でcacheを読みtransMoneyを実行する
function timeDrivenAddShop(){
  //cacheを取得しstrを配列に戻す.
  cache = CacheService.getPublicCache();
  
  var data = cache.get("addShop")
  
  if(data==null){
    return;
  }else{
    data = data.split(';');
  }
  
  //cacheの競合が怖いのでなるべく早く消しておく
  cache.remove("addShop");
  
  //配列の中身をstrからjsonに戻し，postMessageExecに投げる.
  for(var i=0; i<data.length; i++){
    data[i] = JSON.parse(data[i]);
    
    
    ;
  }
  return;
}
**/

//Dialogに返す
function addShopExec(user_name, product_name, product_price, product_stock, product_imageurl) {
  // slack channel url (where to send the message)
  var slackUrl = PropertiesService.getScriptProperties().getProperty('SLACK_INCOMMING_URL');
  
  //画像URLが入力されていない場合はGoogle画像検索から持ってくる
  if (product_imageurl == "Google") {
    var product_imageurl = getGoogleCustomSearchImage(product_name);
  }

  // message text  
  var messageData = {
    "attachments": [{
      "title": product_name,
      "fields": [{
        "title": "在庫数",
        "value": product_stock,
        "short": true
      }, {
        "title": "出品者",
        "value": "<@" + user_name + ">",
        "short": true
      }],
      "fallback": "Sorry, no support for buttons.",
      "callback_id": "trigger_shop",
      "color": "#3AA3E3",
      "attachment_type": "default",
      "actions": [{
        "name": "buy",
        "text": product_price + "円",
        "type": "button",
        "value": product_price,
        "confirm": {
          "title": "購入画面",
          "text": product_name+"を購入しますか？",
          "ok_text": "購入"
        }
      }],
      "image_url": product_imageurl,
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
  UrlFetchApp.fetch(slackUrl, options);
  
  return;
}

function getGoogleCustomSearchImage(keyword) {
  var API_KEY = PropertiesService.getScriptProperties().getProperty('GOOGLE_API_KEY');
  var CSE_ID = PropertiesService.getScriptProperties().getProperty('GOOGLE_CSE_ID');
  var uri = "https://www.googleapis.com/customsearch/v1?key=" + API_KEY + "&cx=" + CSE_ID + "&q=" + keyword + "&searchType=image" + "&imgsz=small"
  var response = UrlFetchApp.fetch(uri);
  var json = JSON.parse(response);
  var random_params = Math.floor(Math.random() * json["items"].length);
  var result = json["items"][random_params]["link"]
  return result
}