({
    handleConfirmation : function(component,event) {
        const action = component.get("c.deleteCaseAttachment");
        action.setParams({
            caseId: component.get("v.caseId"), 
            contentDocumentId: component.get("v.contentDocumentId")
        });

        action.setCallback(this, function(response) {
            component.set("v.confirmStatus", "FALSE");
            const state = response.getState();
            if (state === "SUCCESS") {
           		var refreshAttachments = component.getEvent("refreshAttachment"); 
                refreshAttachments.setParams({showSpinner:false });
                refreshAttachments.fire();
            }
            else {
                // TODO
                
            }
        });
        $A.enqueueAction(action);
    }
})