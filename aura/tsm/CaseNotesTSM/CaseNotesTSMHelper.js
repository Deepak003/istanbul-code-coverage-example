({    
    fetchNotes: function(component) {
        //call apex class method
        let action = component.get('c.fetchCaseNotesByCaseId');
        
        // for archive case
        if(component.get("v.isArchiveCase")){
            action = component.get('c.fetchArchivedCaseNotesByCaseId');
        }
        
        action.setParams({
            caseId: component.get("v.caseId"),
            caseNumber: component.get("v.caseNumber")
        });
        action.setCallback(this, function(response) {
            component.set('v.isLoading', false);
            //store state of response
            const state = response.getState();
            if (state === "SUCCESS") {
                //set response value in wrapperList attribute on component.
                component.set('v.responseResult', response.getReturnValue());
            }else {
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    }
})