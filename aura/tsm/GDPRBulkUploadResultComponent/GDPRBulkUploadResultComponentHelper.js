({
	downloadErrorRequests: function(component, event){
        component.set("v.spinner", true);
		var action = component.get("c.downloadErrorGDPRRequests");
        var batchId = component.get("v.batchId");
        action.setParams({
            batchId: batchId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                component.set("v.spinner", false);
                var hiddenElement = document.createElement('a');
                  hiddenElement.href = result;
                  hiddenElement.target = '_self'; // 
                  hiddenElement.download = 'ExportData';  // CSV file Name
                  document.body.appendChild(hiddenElement); // Required for FireFox browser
                  hiddenElement.click();
                
            } else if (state === "ERROR") {
                let errors = response.getError();
                component.set("v.spinner", false);
                this.handleErrors();
            } else {
                component.set("v.spinner", false);
                this.handleErrors();
            }
        });
        $A.enqueueAction(action);
    },
    
    processSuccessBulkRequest: function(component, event){
        component.set("v.spinner", true);
		var action = component.get("c.processSuccessBulkRequests");
        var batchId = component.get("v.batchId");
        action.setParams({
            batchId: batchId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.spinner", false);
                component.set("v.isProcessRequets", false);
                var toastParams = {
                    message: "Requests processed successfully", 
                    type: "success"
                };
                let toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams(toastParams);
                toastEvent.fire();
                component.set("v.processDisable", true);
                
            } else if (state === "ERROR") {
                let errors = response.getError();
                component.set("v.spinner", false);
                this.handleErrors();
            } else {
                component.set("v.spinner", false);
                this.handleErrors();
            }
        });
        $A.enqueueAction(action);
    },
    handleErrors : function(errors) {
        let toastParams = {
            title: "Error",
            message: "An error occurred while processing request", // Default error message
            type: "error"
        };
        if (errors && Array.isArray(errors) && errors.length > 0) {
            toastParams.message = errors[0].message;
        }
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
        
    }
})