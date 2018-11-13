//doPost()へのJSONが商品の購入によるものだった場合のファイル

function shop(json) {
  var originalMessage = json.original_message;
  var product_info = originalMessage.attachments[0];
  
  if(json.actions[0].name == "buy"){
    //get seller and cusctomer information.
    var customerId = json.user.id;
    var sellerId = (product_info.fields[1].value).replace("<@","").replace(">","");
    var price = parseInt(product_info.actions[0].value);
    
    //trans money from customer to seller
    transMoney(sellerId, customerId, price);
    
    //decrement stock num.
    product_info.fields[0].value--;
    if(product_info.fields[0].value == 0){
      product_info.image_url = "";
      product_info.actions[0].text = "販売終了";
      product_info.actions[0].value = 0;
    }
  }
  
  return originalMessage;
}


   