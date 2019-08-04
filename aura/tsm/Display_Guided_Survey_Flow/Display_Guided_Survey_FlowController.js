({
	startFlow : function(component, event, helper) {
        helper.isFlowAlreadyCompletedForThisInteraction(component, event, helper);
	},
    
    handleStatusChange:function(component, event, helper) {
		if(event.getParam("status") === "FINISHED") {
            if(component.get("v.flowType")=='Dynamic'){
          		component.set("v.isDynamicFlowCompleted",'TRUE');
            } else
            {
                component.set("v.isWorkflowCompleted",'TRUE');
            }
          helper.updateCaseInteractionThatFlowIsComplete(component, event, helper);
       }
	}
})