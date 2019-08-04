({
    validate: function(cmp, event, helper) {
        var maxMessageLength = 128000;
        if(!cmp.get("v.message")){
            cmp.set("v.validity", false);
            cmp.set("v.errorMessage", "You haven't composed anything yet."); 
        }
        else{
            var message = cmp.get("v.message");
            if (!isNaN(message.length) && message.length > maxMessageLength) {
				cmp.set("v.validity", false);
                cmp.set("v.errorMessage", "Message length exceeds administrative limit of 128k"); 
            } else {
                helper.sendEmail(cmp, event, helper);
                cmp.set("v.validity", true);
            	cmp.set("v.message", "");   
            }
        }
    }
  })