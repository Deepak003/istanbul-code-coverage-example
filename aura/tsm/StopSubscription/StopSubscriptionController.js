({
    doInit : function(component, event, helper) {
        if(component.get("v.subscriptionType") == 'Nucleus')
            component.set("v.accordianType" , "Nucleus Subscriptions");
        else
            component.set("v.accordianType" , "Origin Access Membership");
        
        //helper.getStopSubscriptionDetails(component, event);  
    },
    closeModal: function(component, event, helper) {
        var appEvent1 = $A.get("e.c:ResetSubscriptionAccordian");
        appEvent1.fire();
        component.set('v.isOpen', false);
    },
    successModal: function(component, event, helper) {
        component.set("v.isSuccessDisable", true);
        component.set("v.isCancelDisable", true);
        if(component.get("v.stopOrCancel") == "Stop")
            helper.getStopSubscriptionDetails(component, event);
        else
            helper.getCancelSubscriptionDetails(component, event);
    }
})