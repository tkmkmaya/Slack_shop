function shop(json) {
  var originalMessage = json.original_message;
  
  if(json.actions[0].name == "buy"){
    //get seller and cusctomer information.
    var customerId = json.user.id;
    var sellerId = (originalMessage.attachments[0].fields[1].value).replace("<@","").replace(">","");
  
  　var price = parseInt(originalMessage.attachments[0].actions[0].value);
    
    //trans money from customer to seller
    transMoney(sellerId, customerId, price);
    
    //decrement stock num.
    originalMessage.attachments[0].fields[0].value--;
    
    /**
    //在庫が0になったら販売終了
    if(originalMessage.attachments[0].fields[0].value<=0){
      originalMessage = sold_out(originalMessage);
    }
    **/    
  }
  
  return originalMessage;
}

//名簿を記録したスプレッドシードが無い場合、作成してpropertiesにも格納する。
function create_spreadSheets() {
  var sheet_id = SpreadsheetApp.create("members").getId();
 
  PropertiesService.getScriptProperties.setProperty("sheet_id",sheet_id);
  return sheet_id;
}

/**
String.prototype.repeat = function(num) {
	return Array(num + 1).join(this);
};

function sold_out(originalMessage){
  originalMessage.attachments[0].actions[0].name = "restock";
  originalMessage.attachments[0].actions[0].text = "再入荷希望";
  originalMessage.attachments[0].actions[0].value =0;

  originalMessage.attachments[0].image_url = "https://qiita-image-store.s3.amazonaws.com/0/211225/1fc3d0ad-6200-9eb8-d901-b8f169da137c.png";
  delete originalMessage.attachments[0].fields[1];
  delete originalMessage.attachments[0].fields[0];
  return originalMessage;
}

function restock(demandNum, originalMessage){
  originalMessage.attachments[0].actions[0].value = (demandNum+1);
  originalMessage.attachments[0].actions[1].value = (demandNum+1);
  originalMessage.attachments[0].actions[1].text = "★".repeat(demandNum+1)+"☆".repeat(2-demandNum);
  if((demandNum+1)==3){
    originalMessage.attachments[0].image_url = "https://qiita-image-store.s3.amazonaws.com/0/211225/664e49d1-e9c8-fe78-3f79-16f95f872baf.png";
    delete originalMessage.attachments[0].actions[0];
    delete originalMessage.attachments[0].actions[1];
  }
  return originalMessage;
}
**/
