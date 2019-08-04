({
    doInit : function(component, event, helper) {
        helper.fetchModifySubscriptionOptions(component, event, helper);
        helper.fetchBillingAccountOptions(component, event, helper);
    },
    handleSubscriptionChange: function(component, event, helper) {
        helper.onChangeActionHelper(component, event, helper);
        helper.handleSubscriptionChange(component, event);  
    },
    onClickModifySubscription: function(component, event, helper) {
        //component.set('v.isDisabled',true);
        component.set('v.enableNextButton',true);
        helper.onClickModifySubscription(component, event); 
    },
    closeModal: function(component, event, helper) {
        helper.closeModal(component);
    },
     copy : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        var holdtxt = document.getElementById("holdtext");
        holdtxt.select();
        document.queryCommandSupported('copy');
        document.execCommand('copy');
        toastEvent.setParams({
            type: 'success',
            message: 'Secure Purchase Link Copied'
        });
        toastEvent.fire();
    }
})