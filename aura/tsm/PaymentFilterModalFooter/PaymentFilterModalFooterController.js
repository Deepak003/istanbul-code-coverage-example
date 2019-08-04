module.exports = ({    doInit: function(component, event, helper) {
	},
	closeModal : function(component, event, helper) {
        component.find("overlayModal").notifyClose();
	},
    goBack : function(component, event, helper) {
         helper.hideBackDoneButtons(component, event);
         component.set("v.enableSearch",true);
		 let clearSearch = $A.get("e.c:SendPaymentOptionEvt");
         clearSearch.setParams({
            "clearSearch" : true });
         clearSearch.fire();
	},
    handleDone : function(component, event, helper) {
		component.find("overlayModal").notifyClose();
	},
    handleEnableSearch:function(component, event, helper){
        let isEnableSearch = event.getParam("enableSearch");
        if(isEnableSearch){
            component.set("v.enableSearch", false);
            component.set("v.paymentType",event.getParam("paymentType"));
            component.set("v.lastName",event.getParam("lastName"));
            component.set("v.fourDigits",event.getParam("fourDigits"));
            component.set("v.cardType",event.getParam("cardType"));
            component.set("v.billingEmail",event.getParam("billingEmail"));
            component.set("v.retailNumber",event.getParam("retailNumber"));
        }else{
            component.set("v.enableSearch", true);
        }
        event.stopPropagation();
    },
    searchPaymentOptions:function(component, event, helper){
    	helper.searchPaymentOptions(component, event);   
    },
    handlePaymentOptionEvt: function(component, event, helper){
    	helper.hideBackDoneButtons(component, event);
	},
    doReverse: function(component, event, helper){
        helper.doReverse(component);
    },
    doRedeem: function(component, event, helper){
        helper.doRedeem(component);
    }
})
