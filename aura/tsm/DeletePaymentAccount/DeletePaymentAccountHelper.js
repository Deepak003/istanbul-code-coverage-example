({
    closeModel : function(component) {
        component.find("overlayLib").notifyClose();
	},
    deleteAccount : function(component) {        
        const reason = component.get('v.reason'),
            paymentAccountId = component.get('v.paymentAccount').accountId,
            caseId = component.get('v.caseId'),
            accountId = component.get('v.accountId'),
            nucleusId = component.get('v.nucleusId'),
                action = component.get("c.deleteBillingAccount");
        var toastEvent = $A.get("e.force:showToast");
        action.setParams({ paymentAccountId, reason,caseId,nucleusId,accountId });
        
        component.set("v.showSpinner", true);
        action.setCallback(this, function(response) {
            component.set("v.showSpinner", false);
            const state = response.getState();   
            if (state === "SUCCESS") {
                Util.handleSuccess(component, "Payment account was removed successfully");
                
                // fire event for parent to notify account is deleted
                const evnt = $A.get("e.c:DeletePaymentAccountEvent");
        		evnt.setParams({"account": component.get('v.paymentAccount')});
                evnt.fire();
        
        		this.closeModel(component);
            }
            else {
                //Util.handleErrors(component, response);
                //Adding failure toast
                var errorMessage = response.getError();
                toastEvent.setParams({
                    message: errorMessage[0].message,
                    type: "error"
                });
                toastEvent.fire(); 
    			this.closeModel(component);
            }
        });
        $A.enqueueAction(action);        
    }    
})