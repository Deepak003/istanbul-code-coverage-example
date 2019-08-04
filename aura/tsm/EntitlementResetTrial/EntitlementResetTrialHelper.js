({    
    resetFreeTrail : function(component, event, helper) {
        component.set("v.isLoading", true);
        var action = component.get("c.resetFreeTrial");        
        var caseId = component.get('v.caseId'),
            nucleusId = component.get('v.nucleusId'),
            accountId = component.get('v.accountId'),
            selectedEntitlement = component.get('v.selectedEntitlement'),
        	requestArray = [],
            reqParameters ={},
        	payload = {};           
        reqParameters["entitlementId"] = component.get("v.selectedEntitlement").entitlementId;
        reqParameters["contentId"] = component.get("v.selectedEntitlement").contentId;
        requestArray.push(reqParameters);
		payload["resetTrials"] = requestArray;           
        action.setParams({ "strUserId" : nucleusId,
                          "strPayload" : JSON.stringify(payload),
                          "strCaseId" : caseId,
                          "strAccountId" : accountId }); 
        console.log(JSON.stringify(payload));
        action.setCallback(this, function(response) {
            var state = response.getState(),
                result = response.getReturnValue();
            component.set("v.isLoading", false); 
             var toastEvent = $A.get("e.force:showToast");
            if (state === "SUCCESS") {
                //component.set("v.isLoading", false);                              
                toastEvent.setParams({                   
                    "message": "The selected trial was reset successfully.",
                    "type": "success"
                });            
            }
            else{              
                //component.set("v.isLoading", false);
                 toastEvent.setParams({
                    "message": "The selected trial was not reset. Please try again",
                     "type" : "error"
                });  
                console.log("Failed with state: " + state);
            }
            toastEvent.fire();
            var appEvent = $A.get("e.c:EntitlementRefreshEvent");
            appEvent.fire();
            component.set('v.isOpen', false);
        });
       $A.enqueueAction(action);		
    }
})