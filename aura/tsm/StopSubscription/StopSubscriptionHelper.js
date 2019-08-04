({
	getStopSubscriptionDetails: function(component, event) {
        var subsType = component.get("v.subscriptionType");
        if(subsType == 'Origin' || subsType == 'Stacked')
        	this.getOriginStopOrCancelSubscription(component, event, 'stopped', 'stopOriginSubscription');
        else if(subsType == 'Nucleus')
        	this.getNucleusStopSubscription(component, event, 'stopped', 'stopSubscription');
	},
    getCancelSubscriptionDetails: function(component, event) {
        var subsType = component.get("v.subscriptionType");
        if(subsType == 'Origin')
        	this.getOriginStopOrCancelSubscription(component, event, 'cancelled', 'cancelOriginSubscription');
        else if(subsType == 'Nucleus')
        	this.getNucleusStopSubscription(component, event, 'cancelled', 'cancelSubscription');
	},
	getOriginStopOrCancelSubscription: function(component, event, action, stopOrCancelAction) {
        let subscriptionObj = component.get("v.subscription");
        const stopDetailsAction = component.get("c.stopOrCancelOriginSubscriptions");	
        var requestMap = {};
        requestMap["subscriptionId"] = subscriptionObj.subscriptionId;
        requestMap["action"] = stopOrCancelAction;
        requestMap["caseId"] = component.get("v.caseId");
        requestMap["customerId"] = subscriptionObj.userId;
        requestMap["offerId"] = component.get("v.offerId");// TSM-2246
        requestMap["accountId"] = component.get("v.accountId");
        stopDetailsAction.setParams({ requestParams: requestMap });
        stopDetailsAction.setCallback(this,function(response){
            const state = response.getState();
            //if (state === "SUCCESS") {
                var appEvent = $A.get("e.c:RefreshSubscription");
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    type: 'success',
                    message: 'The subscription was '+action+' successfully.'
                });
                toastEvent.fire();
                appEvent.fire();
                component.set('v.isOpen', false);
            //}
        });
        $A.enqueueAction(stopDetailsAction);
    },
    getNucleusStopSubscription: function(component, event, action, stopOrCancelAction){
        let subscriptionObj = component.get("v.subscription");
        const stopDetailsAction = component.get("c.stopOrCancelSubscriptions");	
        var requestMap = {};
        requestMap["subscriptionId"] = subscriptionObj.subscriptionId;
        requestMap["action"] = stopOrCancelAction;
        requestMap["caseId"] = component.get("v.caseId");
        requestMap["customerId"] = subscriptionObj.userId;//TSM-2246
        requestMap["accountId"] = component.get("v.accountId");
        stopDetailsAction.setParams({ requestParams: requestMap });
        stopDetailsAction.setCallback(this,function(response){
            const state = response.getState();
            if (state === "SUCCESS") {
                var appEvent = $A.get("e.c:RefreshSubscription");
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    type: 'success',
                    message: 'The subscription was '+action+' successfully.'
                });
                toastEvent.fire();
                appEvent.fire();
                component.set('v.isOpen', false);
            }
        });
        $A.enqueueAction(stopDetailsAction);
    }
})