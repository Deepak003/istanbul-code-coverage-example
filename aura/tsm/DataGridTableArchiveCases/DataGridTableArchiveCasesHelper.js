({
	getCaseDetailArchive : function(component, caseNumber) {
   		var casePetitionData,
         	casePetitionAction = component.get("c.getArchivedCaseFromOmicron");  
        
        casePetitionAction.setParams({"caseNumber": caseNumber});
        casePetitionAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                casePetitionData = response.getReturnValue();
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef : "c:PetitionDetail",
                    componentAttributes: {
                        simpleCase : casePetitionData,
                        searchCaseFlg : true,
                        readModeCase: true,
                        archiveCaseDetailFlg: true
                    }                        
                });
                evt.fire();
            }
        });
    	$A.enqueueAction(casePetitionAction);
    },
})