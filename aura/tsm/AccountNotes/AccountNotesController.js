({
    init: function(component, event, helper) {
		  // Added below code for THOR-1069
        var lockScreen = window.lockscreen;
        if(lockScreen){
            $A.util.addClass(component.find("link"),"slds-hide");
        }								 
	},
    
    getAccountNotes: function(component, event, helper) {
		var accountId = component.get('v.targetAccountID'),
			permsList = window.permsList;
        component.set('v.accNotesList', []);
        if(accountId != undefined){
            component.set('v.hideNotes', false);
            helper.getAccountNotes(component,event,helper);
        } else {
            component.set('v.hideNotes', true);
        }
	},
    
	addAccNoteClick : function(component, event, helper) {
		component.set('v.addAccountFlag', true);
	},
    
    cancelAddNoteClick: function(component, event, helper) {
		component.set('v.addAccountFlag', false);
	},
    
    saveAddNoteClick: function(component, event, helper) {
        var action = component.get("c.createAccountNotes");
		var caseObj = component.get("v.caseObj");
        var caseId = component.get("v.caseId");
		var targetGamerAccountID = component.get("v.targetGamerAccountID");
        var note = !$A.util.isUndefined(component.find('accNote').get('v.value'))?component.find('accNote').get('v.value'):'',
        	sticky = component.find('accNoteSticky').get('v.value'),
            spinner = component.find("accountNSpinner"),
            accountId = component.get("v.targetAccountID"),
        	accountEmail = component.get("v.targetAccountEmail"),
            errorMessage = component.get("v.errorMsg");
        note = encodeURIComponent(note); //handling double byte characters
        var synergyId;var isNucleus = true; var gameID; var gameIDType; var userAccountType;
        if(caseObj)
        {
          synergyId = caseObj.Petition_Details__r.Target_Account__r.Synergy_ID__c;
          if(synergyId){
                isNucleus = false;
                synergyId = caseObj.Petition_Details__r.Target_Account__r.Synergy_ID__c.split(';'),
      		 	gameID = synergyId[0],
      	     	gameIDType = synergyId[1];
                accountId = gameID
            }
            userAccountType = caseObj.Petition_Details__r.Petition_Account_Type__c;
        }
        if(targetGamerAccountID){
            var gamerDetails = targetGamerAccountID.split(';');
            accountId = gamerDetails[0];
            userAccountType = gamerDetails[1];
            isNucleus = false;
        }
         
		if (!($A.util.isUndefined(note) ||$A.util.isEmpty(note))) {
            $A.util.toggleClass(spinner, "slds-hide");
            //To-Do set userId, userEmail for temp note 
            var tempNote = {noteText: note,
                            noteType: sticky ? 'ACCTSTICKYNOTE' : 'ACCTNOTE',
                            userId: accountId,
                            userAccountType : userAccountType,
                            userEmail: accountEmail
                      	};           
            component.set('v.addAccountFlag', false);
            action.setParams({ "strNotesVO" : JSON.stringify(tempNote),
                              	"strCaseId" : caseId,
                               "isNucleus" : isNucleus
                             });
            console.log(JSON.stringify(tempNote));
        	action.setCallback(this, function(response) {
                var state = response.getState();                
                if (state === "SUCCESS") {
                    var notes = helper.addRelativeDate(response.getReturnValue());                   
					notes.map(function(item) { 
                          	item.noteDate = $A.localizationService.formatDateTimeUTC(item.noteDate)+" "+ "UTC";
                        });
                    component.set("v.accNotesList", notes);
                    var appEvent = $A.get("e.c:AccountNotesAppEvent");
                    if (appEvent != undefined) {                
                        appEvent.fire();                        
                    }
                }
                else if(state === "ERROR"){
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            helper.displayErrorMsg('error', errorMessage);
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        helper.displayErrorMsg('error', errorMessage);
                    }
                }
                else{
                   helper.displayErrorMsg('error', errorMessage);
                }
                $A.util.toggleClass(spinner, "slds-hide");
            });
            $A.enqueueAction(action);           
        }       
	},
    
    changeStickyClick: function(component, event, helper) {
        var noteId = event.currentTarget.getAttribute('data-pk'),
            stickyFlag = !$A.util.hasClass(event.target, 'sticky'),
            noteType = stickyFlag ? 'ACCTSTICKYNOTE' : 'ACCTNOTE',
            action = component.get("c.updateStickyStatusofNote"),
            spinner = component.find("accountNSpinner"),
            accountId = component.get("v.targetAccountID"),
            accountEmail = component.get("v.targetAccountEmail"),
            errorMessage = component.get("v.errorMsg");
        $A.util.toggleClass(spinner, "slds-hide");
        action.setParams({ strNotesId : noteId, strNoteType: noteType, strUserId: accountId});            
        action.setCallback(this, function(response) {
            var state = response.getState();             
            if (state === "SUCCESS") {
                var notes = helper.addRelativeDate(response.getReturnValue());                
				notes.map(function(item) { 
                          	item.noteDate = $A.localizationService.formatDateTimeUTC(item.noteDate)+" "+ "UTC";
                        });
                component.set("v.accNotesList", notes); 
                var appEvent = $A.get("e.c:AccountNotesAppEvent");
                if (appEvent != undefined) {               
                    appEvent.fire();                     
                }
                $A.util.toggleClass(event.target, 'sticky');
            }
            else if(state === "ERROR"){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        helper.displayErrorMsg('error', errorMessage);
                        console.log("Error message: " + 
                                    errors[0].message);
                    }
                } else {
                    helper.displayErrorMsg('error', errorMessage);
                }
            }
            else{
                helper.displayErrorMsg('error', errorMessage);
            }
            $A.util.toggleClass(spinner, "slds-hide");
        });
        $A.enqueueAction(action);        
       
	},
	accountNotesHandler:function(component, event, helper) {
		var cmpName = event.getParam('cmpName');
		if ( cmpName == 'caseActionCmp') {
			helper.getAccountNotes(component);
		}        
    },
    
    keyPressController: function(component, event, helper) {
    	var saveButton = component.find('saveButton'),
        	note = component.find('accNote').get('v.value');
        note = note!=undefined?note.trim():"";
		//Added disabled variable code for THOR-840 
        //Commented the add/remove class											
        if(!note || note == "") {
			 saveButton.set("v.disabled","true");
            // $A.util.addClass(saveButton, 'disableButton');
        }
        else{
			saveButton.set("v.disabled","false");
            // $A.util.removeClass(saveButton, 'disableButton');
        }
    }
})