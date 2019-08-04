({
	isFlowAlreadyCompletedForThisInteraction : function(component, event, helper) {
		// In that component, start your flow. Reference the flow's Unique Name.
        let checkFlowStatus = component.get("c.isSurveyAlreadyCompletedForThisInteraction");
        checkFlowStatus.setParams({caseId:component.get("v.caseId"), flowType:component.get("v.flowType")});
        checkFlowStatus.setCallback(this, function(response) {
            var state = response.getState();
			if (state === "SUCCESS") {
                var caseObj = response.getReturnValue();
                if(caseObj!=null){
                    if (component.get("v.flowType")=='Dynamic'){
                    	if (caseObj.IsDynamicflowCompleted__c=='TRUE'){
                        component.set("v.isDynamicFlowCompleted",'TRUE');
                    	} else {
                        helper.getAppropriateFlowForTheCase(component, event, helper);
                    	}    
                    }
                    if (component.get("v.flowType")=='Workflow'){
                    	if (caseObj.IsWorkflowCompleted__c=='TRUE'){
                        component.set("v.isWorkflowCompleted",'TRUE');
                    	} else {
                        helper.getAppropriateFlowForTheCase(component, event, helper);
                    	}    
                    }
                }
            }  
        });
        $A.enqueueAction(checkFlowStatus);        
	},
    
    getAppropriateFlowForTheCase : function(component, event, helper) {
		// In that component, start your flow. Reference the flow's Unique Name.
        let caseAction = component.get("c.getLightningFlowId");
        //Dynamic Flow is in the lower left of the screen, Workflow will be at top right
        caseAction.setParams({
            caseId: component.get("v.caseId"),
            flowType:component.get("v.flowType")
        }); 
        caseAction.setCallback(this, function(response) {
            var state = response.getState();
			if (state === "SUCCESS") {
                var LightningFlowMappingObj = response.getReturnValue();
                component.set("v.flowObject", LightningFlowMappingObj);
                //Launch the flow
                if(LightningFlowMappingObj!=null){
                	helper.launchTheflow(component, event, helper);
                }
            }  
        });
        $A.enqueueAction(caseAction);        
	},
    
    launchTheflow : function (component, event, helper) {
    var LightningFlowMappingObj = component.get("v.flowObject");
    let flow=component.find("StartFlow");            
        //If flow name is non null        
        if(LightningFlowMappingObj!=null){
            var inputVariables = [
                {name:'caseId', type:'String', value:component.get("v.caseId")}, 
                {name:'lightningFlowId', type:'String', value:LightningFlowMappingObj.Id}
            ];
            flow.startFlow(LightningFlowMappingObj.Flow_API_Name__c, inputVariables); 
        }                
    },
    
    updateCaseInteractionThatFlowIsComplete : function (component, event, helper) {
     let updateFlowStatus = component.get("c.markFlowCompleteForThisCaseInteraction");
     updateFlowStatus.setParams({caseId:component.get("v.caseId"),flowType:component.get("v.flowType")});
     $A.enqueueAction(updateFlowStatus);            
    }
})