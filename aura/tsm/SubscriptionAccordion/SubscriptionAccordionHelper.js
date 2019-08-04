({
    toggleSubscriptionRow: function(component, index) {
        const items = component.get("v.previousSubscriptions");
        if(Array.isArray(items) && items[index]){
            items[index].expanded = !items[index].expanded;
            component.set("v.previousSubscriptions", items);           
        }
    },
    fetchAllBillingAccountsByUserHelper: function(component, event, helper) {
        var action = component.get("c.fetchAllBillingAccountsByUser"); 
        action.setParams({
            'userId' : component.get('v.nucleusId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse = response.getReturnValue();
            if (state === "SUCCESS") {
                if(storeResponse == null || storeResponse.length==0){
                    component.set('v.showSubscriptionButton',false);
                }else{
                    component.set('v.showSubscriptionButton',true);
                    component.set('v.billingAccList',storeResponse)
                }
            }
        });
        $A.enqueueAction(action);
    }
})