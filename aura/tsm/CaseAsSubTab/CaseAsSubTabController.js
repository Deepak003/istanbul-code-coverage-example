({
    openSubTab : function(component, event, helper) {
        const caseId = component.get("v.caseId");
        
        if(caseId) {
            return helper.open(component);
        }
        
        const caseNumber = component.get("v.caseNumber");        
        
        const action = component.get("c.caseIdSearch");
        action.setParams({strCaseNumber:caseNumber});
        
        component.set('v.isLoading', true);
        
        action.setCallback(this,function(response){
            component.set('v.isLoading', false);
            
            const state = response.getState();
            if (state === "SUCCESS") {
                let object = response.getReturnValue();                
                component.set("v.caseId", object.id);                
                helper.open(component);
            }
            else {
                Util.handleErrors(component, response);
            }    
        });
        $A.enqueueAction(action);
    }    
})