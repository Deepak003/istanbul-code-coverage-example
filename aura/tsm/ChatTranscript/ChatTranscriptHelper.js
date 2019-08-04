({
    pullTranscripts: function(component) {
        //call apex class method
        let action = component.get('c.fetchChatTranscriptsByCaseId');
        
        // for archive case
        if(component.get("v.isArchiveCase")){
            action = component.get('c.fetchArchivedChatTranscriptsByCaseId');
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
                component.set('v.transcripts', response.getReturnValue());
            }else {
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    }
})