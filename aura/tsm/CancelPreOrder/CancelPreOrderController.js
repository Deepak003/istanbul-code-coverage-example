({
    doInit : function(component, event, helper) {      
        helper.getRefundReasonCodes(component);	
	}, 
    
    enableConfirmButton : function(component, event, helper){
        component.set('v.disableConfirmButton', false);
    },
    
    confirmCancelPreOrder : function (component, event, helper) {               
        helper.confirmCancelPreOrder(component);
    },
    
    closePreOrder : function (component, event, helper) {               
        component.set('v.openCancelPreOrder', false);
    }
})