({
    loadLanguages : function(component, event) {
        var action = component.get("c.getAllLocales"); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();                 
                component.set("v.languageLocales",storeResponse); 
            }
        });
        $A.enqueueAction(action);       
    },
    //Funciton to record the helpfulness and feedback
    recordCallOutEvent: function(component, event, endpoint) {
        var action = component.get("c."+endpoint); //Setting the end point dynamically
        action.setParams({
            data : event.detail
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();                 
            }
        });
        $A.enqueueAction(action);       
    },
})