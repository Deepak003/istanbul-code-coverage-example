({
	// Your renderer method overrides go here
	rerender : function(component, helper){     
        component.set('v.userType', window.userType);
        var petitionOptions = component.get('v.petitionActions'),
            isAccount = component.get('v.isAccount'),
            tabViewFlag = component.get('v.tabViewFlag'),
            permsList = '';
        
    	if (window.permsList) {
    		 permsList = window.permsList;
    		 petitionOptions = [{ value: "", label: "Select an action" }];
    		// Check for Resolved Permission
    		if (permsList.includes('resolve')) {
    			petitionOptions.push({value: "Resolved", label: "Resolve - No violation Found"});
    		}
    		// Check for Transfer Permission
    		if (permsList.includes('transfer')) {
    			petitionOptions.push({value: "Transferred", label: "Transfer - Send to a Different Advisor"});
    		}
    		// Check for Escalate Permission
    		if (permsList.includes('escalate')) {
    			petitionOptions.push({value: "Escalated", label: "Escalate - Requires Emergency Action"});
    		}
    		// Check for Violation Permission
    		if (permsList.includes('violation') && tabViewFlag != 'Queued') {
    			petitionOptions.push({ value: "ViolationConfirmed", label: "Resolve - Violation Confirmed" });
    			component.set('v.violationPerms', true);
    		}
    		else {
    			component.set('v.violationPerms', false);
    		}
    		//Check for Message template selection Permission
    		if (permsList.includes('in game message')) {
    			component.set('v.sendMsgPerms', true);
    		} 
    		else {
    			component.set('v.sendMsgPerms', false);
    		}     			    		
    	}        
             
        /*}
        if (window.userType && window.userType == 'T1') {
            petitionOptions = [
                { value: "", label: "Select an action" },
                { value: "Resolved", label: "Resolve - No Violation Found" },
                { value: "Escalated", label: "Escalate - Send to T2 Advisor Queue" }                     
            ];
        }
        if (tabViewFlag == 'Queued') {
            petitionOptions = [
                { value: "", label: "Select an action" },
                { value: "Resolved", label: "Resolve - No Violation Found" },
                { value: "Escalated", label: "Escalate - Send to T2 Advisor Queue" }                     
            ];
            if (window.userType == 'T2') {
                petitionOptions = [
                    { value: "", label: "Select an action" },
                    { value: "Resolved", label: "Resolve - No Violation Found" },
                    { value: "Transfer", label: "Transfer - Send to a Different Advisor" },
                ];
            }
        }*/
        if (isAccount) {
        	petitionOptions = [{ value: "", label: "Select an action" }];
            // Check for Create Petition Permission
    		if (permsList.includes('create petition')) {
    			petitionOptions.push({ value: "create-petition", label: "Create Petition" });
    		}
    		// Check for Create Dispute Permission
    		if (permsList.includes('create dispute')) {
    			petitionOptions.push({ value: "create-dispute", label: "Create Dispute" });
    		}
			component.set("v.petitionActions", petitionOptions);													
        }
		else{
            component.set("v.petitionActions",  window.caseActionOptions);
        }
        //component.set("v.petitionActions", petitionOptions);
		//THOR-1104 START
		if(component.find("selectPetitionAction")){
        if(window.lockscreen){
            $A.util.addClass(component.find("selectPetitionAction"),"lockScreen");
        }
        else{
            $A.util.removeClass(component.find("selectPetitionAction"),"lockScreen");
        }
		}
         //THOR-1104 END
        this.superRerender();
        // do custom rerendering here
    }
})