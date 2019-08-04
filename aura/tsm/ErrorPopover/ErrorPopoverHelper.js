({
    getDetails: function(component) {
        const action = component.get("c.fetchFailureReason");
        action.setParams({
            failureReason : component.get("v.code")
        });        
        action.setCallback(this, function(response) {
            component.set('v.isLoading', false);
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue() || {};
                component.set('v.description', storeResponse.Value__c || 'none');
                component.set('v.recommendation', storeResponse.Recommendation__c || 'none');
            }else{
                Util.handleErrors(component, response);
            }
        })
        $A.enqueueAction(action);
    }
})