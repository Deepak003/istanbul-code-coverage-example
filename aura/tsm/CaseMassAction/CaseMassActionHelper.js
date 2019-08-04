({ 
     getRoleBasedQueues: function(component, event) {
      		var actionSelected = event.getParam("value");
         	var queuesFromModal = component.get("v.queueNames");
         	component.set('v.massActionType',actionSelected);
             if(actionSelected.includes("Resolve")){
                 //If resolve action is selected no need to get queues
                 console.log('selected resolve');
                 //show the make notes section and commit button
                 var showQueueSelect = component.find('queueSelectDropdown');
                 if(!$A.util.hasClass(showQueueSelect, 'slds-hide')){
                     $A.util.addClass(showQueueSelect, 'slds-hide')
                 }
                 var massNoteSection = component.find('massNoteSection');
                 $A.util.removeClass(massNoteSection, 'slds-hide');
             }
        	 else{
                 var getRoleQueuesAction = component.get("c.getRoleWiseQueues");
                    getRoleQueuesAction.setParams({
                        "strCaseAction": actionSelected
                    });
            	getRoleQueuesAction.setCallback(this, function(response) {
                var state = response.getState();
                var showQueueSelect = component.find('queueSelectDropdown');
                if (state === "SUCCESS") {
                    var roleBasedQueues = JSON.parse(response.getReturnValue());
                    var queueNames = Object.keys(roleBasedQueues);
                    var setRoleBasedQueuesOptions =[];
                    for (var i=0; i<queueNames.length; i++) {
                        if(!queuesFromModal.includes(queueNames[i]))
                        {    
                            //alert(queueNames[i]);
                        	var option = {};
                            option.label = queueNames[i];
                            option.value = roleBasedQueues[queueNames[i]];
                            setRoleBasedQueuesOptions.push(option);
                        }
                    }
                    if(setRoleBasedQueuesOptions.length == 0)
                    {
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "message": 'You cannot perform mass action on same queue.',
                            "type": "error"
                        });
                        toastEvent.fire();
                    }
                    if(setRoleBasedQueuesOptions.length>=1){
                        $A.util.removeClass(showQueueSelect, 'slds-hide');
                    }
                   	component.set('v.queuesToSelect',setRoleBasedQueuesOptions);
                } 
                else{
                    if(!$A.util.hasClass(showQueueSelect, 'slds-hide')){
                        $A.util.addClass(showQueueSelect, 'slds-hide');
                    }
					var massNoteSection = component.find('massNoteSection');
                    if(!$A.util.hasClass(massNoteSection, 'slds-hide')){
                        $A.util.addClass(massNoteSection, 'slds-hide');
                    }
                    var errorMessage = response.getError()[0].message;
                    console.log('Error in getting mass action queues'+errorMessage);
                    var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "message": errorMessage,
                            "type": "error"
                        });
                        toastEvent.fire();
                }
            });
            $A.enqueueAction(getRoleQueuesAction);
         }  
    },
    
    performMassCommit: function(component, event) {
            var massCommitAction = component.get("c.doMassActions"),
                massCaseActionSpinner = component.find('massCaseActionSpinner'),
                selectedCaseIds = component.get('v.selectedCaseIdsForMassAction');
       		//$A.util.removeClass(massCaseActionSpinner, 'slds-hide');
            massCommitAction.setParams({
                "lstCaseIDs": component.get('v.selectedCaseIdsForMassAction'),
                "strAction": component.get('v.massActionType'),
                "strCaseNotes":component.get('v.massCaseNote'),
                "strQueueID":component.get('v.selectedQueue')
            });
            massCommitAction.setCallback(this, function(response) {
				var ahtModal = component.find("AHTModal");
        		$A.util.addClass(ahtModal, 'slds-hide');
               // $A.util.addClass(massCaseActionSpinner, 'slds-hide');
                var state = response.getState();
                var toastMessage,
                    appEvent,
                	toastType;
                if (state === "SUCCESS") {
                    var data=[],
                        listOfMassActionedCases = [],
                        countOfMassActionedCases,
                        actionTaken;
                    data = JSON.parse(response.getReturnValue());
                    if (data) {
                    	actionTaken = Object.keys(data);
	                    listOfMassActionedCases = data[actionTaken];
	                    countOfMassActionedCases =  listOfMassActionedCases.length;
	                    toastMessage = countOfMassActionedCases + " Cases " + actionTaken;
	                    toastType = "success";
	                    //App Event to delete the cases from queue list 
	                    var appEvent = $A.get("e.c:PetitionCommitApp");
	                    if (appEvent != undefined) {
	                        appEvent.setParams({
	                            pk : listOfMassActionedCases
	                        });                
	                        appEvent.fire();
	                    }
                    }                    
                } 
                else{
                    toastMessage = response.getError()[0].message;
                    toastType = "error";
                }
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "message": toastMessage,
                    "type": toastType
                });
                toastEvent.fire();
                //resetting selected case count
                appEvent = $A.get("e.c:CaseMassActionTrigger");
               	if (appEvent != undefined) {
                    appEvent.setParams({
                        eventType: "endMassAction"
                    });
                    appEvent.fire();// Application Event Fire to perform case mass action
                }
            });
            $A.enqueueAction(massCommitAction);
    },
    getCaseMassActionOptions: function(component) {
    	var getRolesAction = component.get("c.getRoleWiseCaseActions");
        getRolesAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {  
                var roleBasedOptions = response.getReturnValue();
                var setRoleBasedOptions =[];
                for (var i=0; i<roleBasedOptions.length; i++) {
                    var option = {};                    
                    
                    // Checking the permissions for Resolved
                    if (roleBasedOptions[i].toLowerCase().includes('resolve') && window.permsList.includes('mass resolve')) {
                    	option.value = roleBasedOptions[i];
                    	option.label = roleBasedOptions[i];
                    	//setRoleBasedOptions.push(option);
						 var checkViolationFound;
						 checkViolationFound = option.label.replace(/ /g,'');
						 checkViolationFound = checkViolationFound.toLocaleLowerCase();
						 if(checkViolationFound!="resolve-violationfound"){
							 setRoleBasedOptions.push(option);
							 }
					}
                    // Checking the permissions for Transfer
                    if (roleBasedOptions[i].toLowerCase().includes('transfer') && window.permsList.includes('mass transfer')) {
                    	option.value = roleBasedOptions[i];
                    	option.label = roleBasedOptions[i];
                    	setRoleBasedOptions.push(option);
                    }
                    // Checking the permissions for Escalate
                    if (roleBasedOptions[i].toLowerCase().includes('escalate') && window.permsList.includes('mass escalate')) {
                    	option.value = roleBasedOptions[i];
                    	option.label = roleBasedOptions[i];
                    	setRoleBasedOptions.push(option);
                    }
                    // Checking the permissions for Move
                    if (roleBasedOptions[i].toLowerCase().includes('move') && window.permsList.includes('mass move')) {
                    	option.value = roleBasedOptions[i];
                    	option.label = roleBasedOptions[i];
                    	setRoleBasedOptions.push(option);
                    }
                }
               component.set('v.massActionOptionsList',setRoleBasedOptions);
            } 
            else{
                console.log('Error in getting action roles for mass actions');
            }
        });
        $A.enqueueAction(getRolesAction);
    },
    
    acceptAgentWork: function(component, selectedCaseId) {        
        var omniAPI = component.find("omniToolkit");
        var self = this;
        omniAPI.getAgentWorks().then(function(result) {
            var works = JSON.parse(result.works);          
            var agentWorkId;
            var isEngaged;
            for(var i in works){  
			if(selectedCaseId){
					if(works[i].workItemId == selectedCaseId.substring(0, 15)){
						agentWorkId = works[i].workId;
						isEngaged = works[i].isEngaged;
						break;
					}
				}				
            }			            
            if(agentWorkId != undefined) {
                if(!isEngaged){                    
                    //change status of agent work to accepted  
                    var promise1 = self.acceptWork(component,agentWorkId); 
                }
				else{
                        self.closeAgentWork(component, agentWorkId);
                    }
            }                                             
        });
    },
    
    acceptWork: function(cmp,agentWorkId) {
        var omniAPI = cmp.find("omniToolkit");  
        var promise1 = new Promise(function(resolve, reject){
            resolve(omniAPI.acceptAgentWork({workId: agentWorkId}));            
        }).catch(function(error) {
            console.log(error);
        });
        return promise1;          
    },
    
    closeAgentWork: function(component, agentWorkId)
    {  
       	var counter = component.get('v.counter');
        counter = counter + 1;        
       // alert('close agentwork' + agentWorkId);
        var omniAPI = component.find("omniToolkit");  
        var promise1 = new Promise(function(resolve, reject){
            resolve(omniAPI.closeAgentWork({workId: agentWorkId}));            
        }).catch(function(error) {
            console.log(error);
        });
       component.set('v.counter', counter);
	},
})