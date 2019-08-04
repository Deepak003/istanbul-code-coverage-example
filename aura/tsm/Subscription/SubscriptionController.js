({
    doInit:function(component,event,helper){
        helper.fetchOriginSubscriptionOption(component);        
        helper.setOriginSubscriptions(component,event);        
        helper.setNucleusSubscriptions(component,event);
        helper.setEAAccessSubscriptions(component,event);
        helper.fetchAllBillingAccountsByUserHelper(component,event,helper);
    },
    setUpcomingSubscriptionOption: function(component){
        const activeSubscription = component.get('v.activeSubscription') || {};
        const originSubscriptionOptions = component.get('v.originSubscriptionOptions') || [];
        if(activeSubscription.upcomingSubsOfferId && !activeSubscription.upcomingSubscriptionOption && originSubscriptionOptions.length) {
            const upcomingSubscriptionOption = originSubscriptionOptions.find((oso)=>oso.offerId == activeSubscription.upcomingSubsOfferId);
            if(upcomingSubscriptionOption) {
                activeSubscription.upcomingSubscriptionOption = upcomingSubscriptionOption;
                component.set('v.activeSubscription', activeSubscription);    
            }            
        }
    },
    AddSubscription : function(component,event,helper){
        component.set('v.showAddSubscription',true);
    },
    closeModal : function(component,event,helper){
        component.set('v.showAddSubscription',false);
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