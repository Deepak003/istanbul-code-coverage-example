({
	getCaseNotes : function(component) {
		component.set('v.viewAllFlag', false);
        component.set('v.viewCollapse', false);
          if(!$A.util.hasClass(actspinner, 'slds-hide'))
        {
            $A.util.addClass(actspinner, 'slds-hide');
        }
        var iconList = {'Petition created': 'standard:recent', 'Transferred': 'utility:forward', 'Resolved': 'utility:check', 'Notes Appended': 'utility:note', 'Escalated': 'utility:arrowup', 'Created': 'standard:recent'};
        
        var action = component.get("c.getCaseNotesByCaseId");
        var caseId = component.get('v.caseId'),
            actspinner = component.find('actspinner');
        action.setParams({ "strCaseId" : caseId }); 
        //$A.util.toggleClass(actspinner, 'slds-hide');
        $A.util.removeClass(actspinner, 'slds-hide');
        action.setCallback(this, function(response) {
            var state = response.getState();   
            //$A.util.toggleClass(actspinner, 'slds-hide');
             $A.util.addClass(actspinner, 'slds-hide');
            if (state === "SUCCESS") {
                var caseNotes = response.getReturnValue();
              
                for (var i=0; i<caseNotes.length; i++) {
                    caseNotes[i].className = '';
                    if (i > 1) {
                        caseNotes[i].className = 'slds-hide';
                    }
                    if(caseNotes[i].caseAction != 'undefined'){
                       caseNotes[i].iconType = iconList[caseNotes[i].strCaseAction];
                    }               
					// Added below strLastModifiedDate changes for THOR-708
                    if(caseNotes[i].strLastModifiedDate != 'undefined'){
                        caseNotes[i].strLastModifiedDate = $A.localizationService.formatDateUTC(caseNotes[i].strLastModifiedDate); 
                    } 
                }
				if (caseNotes.length > 2) {
                    component.set('v.viewAllFlag', true);
                }
                else{
                    component.set('v.viewAllFlag', false);
                    component.set('v.viewCollapse', false);
                }
                component.set("v.activity",caseNotes);                
            }else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
	}
})