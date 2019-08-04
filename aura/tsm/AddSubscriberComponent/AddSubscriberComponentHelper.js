({
	createSubscriber : function(component, event, objSubscriber) {
        var type = "";
        var message = "";
		var action = component.get("c.insertGDPRSubscriber");
        component.set("v.spinner", true);
        action.setParams({
            "gdprSubscriber": objSubscriber
        })
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                this.hideSpinner(component);
                component.set("v.addSuccessful", true);
                component.set("v.type", 'success');
        		component.set("v.message", 'New subscriber is added successfully');
                component.set("v.newSubscriberFlag", false);
            } else if (state === "ERROR") {
                var errors = a.getError();
                this.hideSpinner(component);
                type = "error";
				message = "An error occured while processing request"
                component.set("v.type", type);
        		component.set("v.message", message);
                component.set("v.newSubscriberFlag", false);
            } else {
                this.handleErrors();
                this.hideSpinner(component);
            }
        });
        $A.enqueueAction(action);
	},
    hideSpinner: function(component) {
        component.set("v.spinner", false);
    },
    
    handleErrors : function(errors) {
        let toastParams = {
            title: "Error",
            message: "An error occured while processing request", // Default error message
            type: "error"
        };
        if (errors && Array.isArray(errors) && errors.length > 0) {
            toastParams.message = errors[0].message;
        }
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
        
    },
    showToast: function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");  
        toastEvent.setParams({  
            "type":"Error",
            "message": "Characters '<' and '>' are not allowed."  
        });  
        toastEvent.fire(); 
        
    },
})