({
    //gets account data from apex controller 
    getToSVoilationCount: function (component, event, helper) {
        var action = component.get("c.getToSVoilationCaseCount");
        action.setParams({strAccountId : component.get("v.accountId")});
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {           
                component.set("v.tosVoliationCount", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
    }
})