({
	getCaseNotes : function(component) {
		var caseId = component.get('v.caseId'),
            action = component.get("c.getCaseNotesByCaseId"),
            spinner = component.find("caseNoteSpinner");        
        
        $A.util.toggleClass(spinner, "slds-hide");
        action.setParams({ "caseId" : caseId });            
        action.setCallback(this, function(response) {
            var state = response.getState();
            $A.util.toggleClass(component.find("caseNoteSpinner"), "slds-hide");            
            if (state === "SUCCESS") {
                var caseNotes = response.getReturnValue();                
                component.set('v.caseNotes', caseNotes);
                if (component.get('v.tabViewFlag') == 'Completed') {
                    component.set('v.caseNotes', caseNotes.slice(caseNotes.length-1));
                }                
            }else{
                console.log("Failed with state: " + state);
            }
            //$A.util.removeClass(spinner, "slds-hide");
        });
        $A.enqueueAction(action);        
	}
})