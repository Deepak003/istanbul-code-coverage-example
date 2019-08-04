({
	getFraudState : function(component, event) {        
        var action = component.get("c.getFraudState");
        var caseId = component.get('v.caseId');
        action.setParams({ "CaseId" : caseId }); 
        action.setCallback(this, function(response) {
            var state = response.getState(),
                result = response.getReturnValue();                
            console.log(result);
            if (state === "SUCCESS") {
                if(result != ""){
                    component.set('v.fraudState', result);
					component.set('v.fraudStateCss', result);
                }
                else{
                    component.set('v.fraudState', "N/A");
                    component.set('v.fraudStateCss', "NA");
                }
            }
            else if(state === "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                        toastEvent.setParams({
                            "message":  errors[0].message,
                            "type" : "error"
                        });  
                        console.log("Failed with state: " + state);
                    }
                    toastEvent.fire(); 
                    component.set('v.fraudState', "N/A");
                    component.set('v.fraudStateCss', "NA");
                }   
            }
            else{
                component.set('v.fraudState', "N/A");
                    component.set('v.fraudStateCss', "NA");
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action); 		
	},
    
    activateCooldown : function(component, event) { 
        component.set("v.isLoading", true);
        var action = component.get("c.searchAccount");
        var accountId = component.get('v.accountId');
		var caseId = component.get('v.caseId');
        var nucleusId = component.get('v.nucleusId');
        action.setParams({ "accountId" : accountId, "caseId" : caseId, "nucleusId" : nucleusId }); 
        action.setCallback(this, function(response) {
            var state = response.getState(),
                result = response.getReturnValue();                
            console.log(result);
            component.set("v.isLoading", false);
            var toastEvent = $A.get("e.force:showToast");
            if (state === "SUCCESS") {
                toastEvent.setParams({                   
                    "message": "Fraud state cooldown initiated",
                    "type": "success"
                });
            }
            else if(state === "ERROR"){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                        toastEvent.setParams({
                            "message":  errors[0].message,
                            "type" : "error"
                        });  
                        console.log("Failed with state: " + state);
                    }                    
                }   
            }            
            else{
                 toastEvent.setParams({
                            "message":  "Error Occured",
                            "type" : "error"
                        }); 
                console.log("Failed with state: " + state);
            }
            toastEvent.fire(); 
           component.set('v.isOpen', false);
        });
        $A.enqueueAction(action); 		
	}
})