({    
    init: function(component, event, helper) {      
		 // Added below code for THOR-1069
        var lockScreen = window.lockscreen;
        if(lockScreen){
            $A.util.addClass(component.find("accountStatussad"),"lockScreen");
            $A.util.addClass(component.find("personas"),"lockScreen");
            
        }								 
       
    },
    OnStrikesUpdated: function(component,event,helper){
      	component.set('v.TargetAccountSFID', event.getParam("targetAccountForStrikes")); 
    }, 
    petitionsNumberClick: function(component, event, helper) {
        //petitionTotalClick
        var petitionNoEvent = component.getEvent("petitionTotalClick");
        if (petitionNoEvent != undefined) {
            petitionNoEvent.fire();
        }
    },
    getSanctionDate: function(component, event, helper) {
        console.log("getting end date");
        helper.getSuspendDuration(component, event);
    },
    getAccountDetails: function(component, event, helper) {        
        var simpleCase = component.get('v.simpleCase'),
            playerAccData = component.get('v.playerAccData');
            //console.log('simpleCase :'+simpleCase);
        // THOR - 1458 - null check
		if(simpleCase){
			if (!playerAccData ||(playerAccData && simpleCase.Petition_Details__r && simpleCase.Petition_Details__r.Target_Account__r && playerAccData.id != simpleCase.Petition_Details__r.Target_Account__r.Nucleus_ID__c)) {
			    component.set("v.showSpinner", true);    
			    if(simpleCase && simpleCase.Petition_Details__r && simpleCase.Petition_Details__r.Target_Account__r && simpleCase.Petition_Details__r.Target_Account__r.Synergy_ID__c != null){
			        helper.getBasicGamerAccountDetails(component, event);
			    }else{
			        helper.getTargetAccountDetails(component, event);    
			    }
			}
		}
        
        var accStatusCmp = component.find('accStatusCmp');
        //playerAccData = component.get('playerAccData');//targetAccountSFId; //
        if (simpleCase) {
            component.set('v.targetAccountSFId', simpleCase.Petition_Details__r && simpleCase.Petition_Details__r.Target_Account__r? simpleCase.Petition_Details__r.Target_Account__r.Id : simpleCase.Account?simpleCase.Account.Id:'');
        }
        if (accStatusCmp && simpleCase) {
            //if (simpleCase && simpleCase.Petition_Details__r && simpleCase.Petition_Details__r.Target_Account__r) {            
            accStatusCmp.set('v.targetAccountSFId', simpleCase.Petition_Details__r &&simpleCase.Petition_Details__r.Target_Account__r? simpleCase.Petition_Details__r.Target_Account__r.Id : simpleCase.Account?simpleCase.Account.Id:'');
            //}//playerAccData
            accStatusCmp.getSrikesAcc();
        }
        
        // End of THOR-416
    },
	
	// THOR - 1395
    editNucleusPersona: function(component, event, helper) {
        var oldPersonaName = component.get("v.playerAccData.persona");
        component.set("v.oldPlayerAccDataPersona", oldPersonaName);
        component.set("v.editPersonaFlag", true);
    },    
    savePersona: function(component, event, helper) {
        var oldPersonaName =  component.get("v.oldPlayerAccDataPersona");
        var newPersonaName =  component.get("v.playerAccData.persona");
        if(newPersonaName){
            if(oldPersonaName != newPersonaName){
                component.set("v.showSpinner", true);
                var data = component.get("v.playerAccData.personas");
                //console.log(JSON.stringify(data));
                for(let i=0; i<data.length;i++) {
                    if (data[i]["namespaceName"].includes("cem_ea_id")) {
                        data[i].name = component.get("v.playerAccData.persona");
                        data[i].displayName = component.get("v.playerAccData.persona");
                        component.set("v.PersonaId", data[i].personaId);
                    }
                }
                component.set("v.playerAccData.personas",data);
                component.set("v.editPersonaFlag", false);
                helper.saveTargetAccountDetails(component, event);            
            }   
        }else{
            var toastEvent = $A.get("e.force:showToast");                
                toastEvent.setParams({                    
                            "message": 'Please enter a value for Nucleus Persona',
                            "type": 'error'
                            });                
                toastEvent.fire();
        }               
    },    
    doCancel: function(component, event, helper) {
        var oldData = component.get("v.oldPlayerAccDataPersona");
        component.set("v.playerAccData.persona", oldData);
        component.set("v.editPersonaFlag", false);
    }
    
})