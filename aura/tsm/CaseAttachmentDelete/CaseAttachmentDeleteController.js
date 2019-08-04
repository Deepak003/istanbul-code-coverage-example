({
    handleConfirmation : function(component, event, helper) {
        if(component.get("v.confirmStatus") == "TRUE"){
        	//debugger;
        	var refreshAttachments = component.getEvent("refreshAttachment"); 
            refreshAttachments.setParams({showSpinner:true });
            refreshAttachments.fire();
            helper.handleConfirmation(component);
        }
    },
    openConfirmModal : function(component, event, helper) {
        component.set("v.isOpen", true);
    }
})