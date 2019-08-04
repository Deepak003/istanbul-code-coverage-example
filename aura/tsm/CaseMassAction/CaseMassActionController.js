({
	init : function(component, event, helper) {		
        helper.getCaseMassActionOptions(component);
	},
    
    handleMassActionSelect: function(component, event, helper) {
        //Get the queues corresponding to this advisor to which he/she can escalate to
        helper.getRoleBasedQueues(component,event);
        var massCommitButton = component.find('mass_commit_button');
        if(component.get('v.massCaseNote')){
            component.set('v.massCaseNote','');
            $A.util.addClass(massCommitButton, 'disableButton');
        }
	},
      
    handleQueueSelect: function(component, event, helper) {
       //After selecting the queue display the mass case note 
       var massNoteSection = component.find('massNoteSection');
       $A.util.removeClass(massNoteSection, 'slds-hide');
        var queueSelected = event.getParam("value");
         	component.set('v.selectedQueue',queueSelected);
	},
    
    keyPressController: function(component, event, helper) {
        //Enable disable commit button for mass case note here
        var massCommitButton = component.find('mass_commit_button');
        if(!component.get('v.massCaseNote') || component.get('v.massCaseNote') == "") {
             $A.util.addClass(massCommitButton, 'disableButton');
        }
        else{
            $A.util.removeClass(massCommitButton, 'disableButton');
        }
	},
    
    handleMassCaseActionCommit: function(component, event, helper) {
		//Commit mass action once the fields selected/filled
        //accept and close agentwork
        if(component.get("v.massCaseNote")!=null && component.get("v.massCaseNote")!=''){
        var selectedCaseIds = component.get('v.selectedCaseIdsForMassAction');
       	var i = 0;
        component.set('v.counter', 0); 
        //var workerAgentSpinner = component.find('workerAgentSpinner');
        //$A.util.removeClass(workerAgentSpinner, 'slds-hide');
        var ahtModal = component.find("AHTModal");
        if($A.util.hasClass(ahtModal, 'slds-hide')){
            $A.util.removeClass(ahtModal, 'slds-hide');
        }
        //helper.performMassCommit(component,event);
        helper.acceptAgentWork(component, selectedCaseIds[i]);
        setTimeout(function(){
            var ahtModal = component.find("AHTModal");
            if(!$A.util.hasClass(ahtModal, 'slds-hide')){
                $A.util.addClass(ahtModal, 'slds-hide');
            }
        }, 50000); 
    }
	},
    
    cancelMassCaseAction: function(component, event, helper) {
        //Cancel mass action
        var appEvent = $A.get("e.c:CaseMassActionTrigger");
        if (appEvent != undefined) {
            appEvent.setParams({
                eventType: "cancelMassAction"
            });
            appEvent.fire();// Application Event Fire to cancel case mass action
        }
	},
    
    onWorkAccepted : function(component, event, helper) {
        var workItemId = event.getParam('workItemId');
        var workId = event.getParam('workId');
        helper.closeAgentWork(component, workId); 
    }, 
    
    onWorkClosed : function(component, event, helper) {
        var counter = component.get('v.counter');                 
        var selectedCaseIds = component.get('v.selectedCaseIdsForMassAction');
        if(counter <  selectedCaseIds.length) {                  
            helper.acceptAgentWork(component, selectedCaseIds[counter]);            
        }
        else{
			//var workerAgentSpinner = component.find('workerAgentSpinner');
        	//$A.util.addClass(workerAgentSpinner, 'slds-hide');
            helper.performMassCommit(component,event);
        }
    },
})