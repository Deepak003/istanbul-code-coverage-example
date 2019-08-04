({
     searchCaseData : function(component,event,helper) {
            var action = component.get("c.searchCaseDetailsByTranscriptId");
            action.setParams({
                transcriptId : component.get("v.recordId")
               });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue(); 
                component.set("v.currentCase", storeResponse);
            }
        });
        $A.enqueueAction(action);
    }
})