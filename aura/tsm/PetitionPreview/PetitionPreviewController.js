({
    doInit : function(component, event, helper) {
        // Retrieve products during component initialization      
        helper.loadProducts(component);              
        // Scrolling of petition div
        window.lastScrollTop = 0;
        window.scrollPetitionFlag = false;
        window.getNextPetitionFlag = false;
    },
	handlePetitionDetailClick: function(component, event, helper) {
		/* var appEvent = $A.get("e.c:updatePetitionActionsEvt"); //updating actions in case detail page
        if (appEvent != undefined) {
            appEvent.setParams({
                eventType: "udpateActions"
            });  
            appEvent.fire();
        } */
        var caseActionComp = component.find('caseactioncomponent');
      	caseActionComp.updatePetitionActions();  
        var target = event.currentTarget,
        caseId = component.get("v.recordId"),
        casePetitionData = component.get("v.simpleCase");
        window.tabViewFlag = component.get("v.tabViewFlag");        
        component.set("v.tabViewFlag", 'Completed');
        helper.getCasePetitionDetail(component, event, casePetitionData, caseId, target, "petition");
	},
    
    handlePlayerDetailClick: function(component, event, helper) {
		helper.getCasePetitionPlayer(component, event);
	},
    
    handleProductSelected: function(component, event, helper) {        
        var selectedOptionValue = event.getParam("value");
        //get categories by Product
        helper.loadCategories(component, selectedOptionValue);
        helper.loadPlatforms(component, selectedOptionValue);
        console.log("This is a product select" + selectedOptionValue);
	},
    
    //Petition Actions
    handlePetitionActions: function(component, event, helper) {
        var selectedOptionValue = event.getParam("value"),
            petitionCommitFlg = component.get('v.petitionCommitFlg'),
            petitionSection = component.find('petition-actions');
        
        petitionCommitFlg = selectedOptionValue ? true : false;        
        component.set('v.petitionCommitFlg', petitionCommitFlg);
        if (petitionCommitFlg) {            
            window.scrollPetitionFlag = true;
            if (!$A.util.hasClass(petitionSection, "slds-is-fixed")) {
                $A.util.addClass(petitionSection, 'slds-is-fixed');
            }            
        }
        else {
            $A.util.removeClass(petitionSection, 'slds-is-fixed');
        }        
	},
    
    handleShowModal: function(component, event, helper) {
        var resourceURL = event.currentTarget.getAttribute('data-model'),
            modalBody = "";
            
        $A.createComponent("c:ModalContent", {},
                           function(content, status) {
                               if (status === "SUCCESS") {
                                   content.set('v.resourceURL', resourceURL);
                                   //modalBody = content;
                                   component.find('overlayLib').showCustomModal({
                                       header: "Reported Content",                                       
                                       body: modalBody,
                                       showCloseButton: true,
                                       cssClass: "mymodal",
                                       closeCallback: function() {
                                           //alert('You closed the alert!');
                                       }
                                   })
                                   
                               }
                               
                           });
    },
    
    // Handling Row click event
    rowClickPetitionEvent: function(component, event, helper) {
        helper.updatePetitionActions(component); //THOR-916 - Update actions on row click on petition preview section							   
		window.recordId = event.getParam("pk");
        var agentWorkId = event.getParam("agentWorkId");        
        component.set("v.workId", agentWorkId);
        var petitionSection = component.find('caseactioncomponent');
        try {
            if ($A.util.hasClass(petitionSection.find('petition-actions'), "slds-is-fixed")) {
                $A.util.removeClass(petitionSection.find('petition-actions'), 'slds-is-fixed');
            }
        }
        catch(err) {}
        $A.enqueueAction(component.get('c.loadPetitionRecord'));        
    },
    
    // Petition div Scroll
    petitionScroll: function(component, event, helper) {
        //        
        var petitionSection = component.find('petition-actions');
        if (petitionSection == undefined) {
            petitionSection = component.find('caseactioncomponent') == undefined ? '' : component.find('caseactioncomponent').find('petition-actions');
        }
        if ($A.util.hasClass(petitionSection, 'slds-is-fixed') && petitionSection != undefined && petitionSection != null) {
            $A.util.removeClass(petitionSection, 'slds-is-fixed');
        }
    },
    
    //
    handlePetitionCommitNext: function(component, event, helper) {        
        $A.enqueueAction(component.get('c.casePetitionCommitAction'));
        window.getNextPetitionFlag = true;        
    },
    
    handlePetitionCommit: function(component, event, helper) {
        $A.enqueueAction(component.get('c.casePetitionCommitAction'));
        window.getNextPetitionFlag = false;
        component.set("v.petitionMsg", false);
    },
    // Handles recored after commit
    handleRecordUpdated: function(componenet, event, helper) {
        //TODO for the handler after updating/coomit a record in SF
        var eventParams = event.getParams();
        if(eventParams.changeType === "CHANGED") {
            // get the fields that changed for this record
            var changedFields = eventParams.changedFields;
            console.log('Fields that are changed: ' + JSON.stringify(changedFields));
            // record is changed, so refresh the component (or other component logic)
            var resultsToast = $A.get("e.force:showToast");
            resultsToast.setParams({
                "title": "Saved",
                "message": "The record was updated."
            });
            resultsToast.fire();

        } else if(eventParams.changeType === "LOADED") {
            console.log("Record loaded");
        } else if(eventParams.changeType === "REMOVED") {
            console.log("Record removed");
        } else if(eventParams.changeType === "ERROR") {
            console.log("Record has an error");
        }
    },
    
    casePetitionCommitAction: function(component, event, helper) {
        var spinner = component.find("petitionSpinner");
        $A.util.toggleClass(spinner, "slds-hide");        
        component.find("caseRecordLoader").saveRecord($A.getCallback(function(saveResult) {
            // NOTE: If you want a specific behavior(an action or UI behavior) 
            // when this action is successful 
            // then handle that in a callback (generic logic when record is changed should be 
            // handled in recordUpdated event handler)
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                var spinner = component.find("petitionSpinner");
                $A.util.toggleClass(spinner, "slds-hide");
                component.set("v.petitionMsg", false);
                // Application Event Fire to delete row from Queued list
                var commitEvent = component.getEvent("petitionCommitEventApp");
                if (commitEvent != undefined) {
                    commitEvent.setParams({
                        pk : component.get("v.recordId"),
                        getNextPetition: window.getNextPetitionFlag
                    });
                    
                    commitEvent.fire();
                }
                // TODO for handle component related logic in event handler
                // Remove a petition in Queued tab and adding in Completed tab
            } else if (saveResult.state === "INCOMPLETE") {
                console.log("User is offline, device doesn't support drafts.");
            } else if (saveResult.state === "ERROR") {
                console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error));
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }
        }));
    },
    getNextRowClickEvent: function(component, event, helper) { 
        if (event.getParam("gNxtFlag")) {
            window.recordId = event.getParam("pk");            
        	$A.enqueueAction(component.get('c.loadPetitionRecord'));
        }
        else {
            component.set("v.petitionMsg", false);
        }
        var petitionSection = component.find('caseactioncomponent');
        try {
            if ($A.util.hasClass(petitionSection.find('petition-actions'), "slds-is-fixed")) {
                $A.util.removeClass(petitionSection.find('petition-actions'), 'slds-is-fixed');
            }
        }
        catch(error) {} 
    },
    // Load petition Record to display using LDS
    loadPetitionRecord: function(component, event, helper) {
        if (window.recordId) {
            component.set("v.petitionCommitFlg", false);        
            component.set("v.recordId", window.recordId);
            component.set("v.petitionMsg", true);            
            //component.find('caseRecordLoader').reloadRecord(true);
            var caseActionCmp = component.find('caseactioncomponent');
            
            
            if (caseActionCmp) {
				caseActionCmp.clearHideUnhieCheckboxes();

                var openCaseBtn = caseActionCmp.find('openCaseBtn'),
                	appendActions = caseActionCmp.find('appendActions');
            	//caseActionCmp.set("v.petitionActionFlag", false); 
                if ($A.util.hasClass(openCaseBtn, 'slds-hide')) {
                    $A.util.removeClass(openCaseBtn, 'slds-hide')
                }
                if (!$A.util.hasClass(appendActions, 'slds-hide')) {
                    $A.util.addClass(openCaseBtn, 'slds-hide')
                } 
            }                       
            helper.getCasePetition(component, event);            
        }
    },
    
    petitionLoadMethod: function(component, event, helper) {
        var recordId = event.getParam('arguments')[0];        
        if (recordId) {
            component.set("v.recordId", recordId);
            return helper.getCasePetition(component, event);
        }
    },
    
    tabViewClickEventHandler: function(component, event, helper) {
        var tabViewFlag = event.getParam('tabFlag'),
            el;
        component.set('v.tabViewFlag', tabViewFlag);
        window.tabFlag = tabViewFlag;
        component.set("v.petitionMsg", false);
        if (tabViewFlag == 'Queued') {
            el = document.getElementsByClassName('slds-is-selected')[0];
            if (el != undefined)
            	el.classList.remove("slds-is-selected");
            //if (el) el.click();
            //if (component.get("v.recordId") && el.getAttribute('data-pk')) {
            	//component.set("v.recordId", el.getAttribute('data-pk'));
            	//component.set("v.petitionMsg", true);
            	//helper.getCasePetition(component, event);            	
           // }
        }
    }
    
})