({
    switchPresenseStatus: function(component, event, eventType, statusValue) {
        var action = component.get('c.logAdvisorEvent'); 
        var oldValue = "";  
        //Recording the old value for Auxcode
        if(eventType == "Auxcode"){
            oldValue = component.get("v.oldStatus");
            component.set("v.oldStatus", statusValue); //Increasing the pointer for old value
        }else{
            component.set("v.oldStatus", ""); //Removing the old value for login and logout
        }
        // Set up the callback
        action.setParams({
            strEventType : eventType,
            strOldPresenceStatus: oldValue,
            strNewPresenceStatus: statusValue
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