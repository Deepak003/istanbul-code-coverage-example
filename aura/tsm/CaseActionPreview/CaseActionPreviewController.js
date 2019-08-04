({
	doInit : function(component, event, helper) {
		//helper.getCaseActionOptions(component);
		component.set('v.petitionActions', component.get('v.petitionActionsPrev'));
	},
    clickOpenCase: function(component, event, helper) {
        $A.util.addClass(event.currentTarget, 'slds-hide');
        component.set('v.petitionActionFlag', true);
        
        $A.util.toggleClass(component.find('appendActions'), 'slds-hide');
    },
    
    clearHideUnhieCheckboxes : function(component,evt,hlp){
     // handle checkboxes clear
     if(component.find('hideContent'))
    	 component.find('hideContent').set("v.value", false);
     
     if(component.find('unHideContent'))
    	 component.find('unHideContent').set("v.value", false);
    },
    
    handlePetitionActions: function(component, event, helper) { 
        var selectedOptionValue = event.getParam("value"),
            petitionCommitFlg = component.get('v.petitionCommitFlg'),
            petitionSection = component.find('petition-actions'),            
            tabViewFlag = component.get('v.tabViewFlag');
        component.set('v.petitionActionSelected',selectedOptionValue);
                
        var commitButton = component.find('commit_button');        
        var selectedQueue = component.find('queueSelect');
        if(selectedOptionValue == '' || (!selectedOptionValue.includes("Resolve") && (selectedQueue =='' || selectedQueue == undefined))){
            $A.util.addClass(commitButton, 'disableButton');            
        }        
        else{            
            $A.util.removeClass(commitButton, 'disableButton');
            //commitButton.set('v.disabled',false);  
        }
        //Scroll Bar Flag
        if (selectedOptionValue) {
            window.actionScrollFlag = true;        	
        }
        else {
            window.actionScrollFlag = false;
        }
        
                
        var  showHideQueueDrop = component.find('queueSelectDropdown');
        // Get caseNote to auto populate
        if(selectedOptionValue){
            petitionCommitFlg = true;
        }
        else{
            petitionCommitFlg = false;
        }                
        if(!selectedOptionValue.includes("Resolve") && selectedOptionValue != "" && !selectedOptionValue.includes("Create")){
            helper.getRoleBasedQueues(component,event);
            component.set('v.petitionCommitFlg', false);
        }
        else{
            if(!$A.util.hasClass(showHideQueueDrop, 'slds-hide')){
                $A.util.addClass(showHideQueueDrop, 'slds-hide');
            }
            component.set('v.petitionCommitFlg', petitionCommitFlg);
            helper.getAutoCaseNotes(component, 'noviolation');
        }
        
        
        if (petitionCommitFlg) {            
            window.scrollPetitionFlag = true;
        }
        else {                
            $A.util.removeClass(petitionSection, 'slds-is-fixed');
            component.set('v.createCase', false);                
        }        
            
        
        if(selectedOptionValue !== '' || component.get("v.caseNote")==null || component.get("v.caseNote")=='' ){
            if(!selectedOptionValue.includes("Resolve")){
                $A.util.addClass(commitButton, 'disableButton');
            }
        }
        else{
            $A.util.removeClass(commitButton, 'disableButton');
        }
        var makeCaseAccNotesBtn =component.find('makeCaseAccNotesBtn');
        
        if(selectedOptionValue == 'Resolve - No Violation Found' && (component.get("v.caseNote")==null || component.get("v.caseNote")==''))
        {
            $A.util.removeClass(makeCaseAccNotesBtn, 'disableButton');
        }else{$A.util.addClass(makeCaseAccNotesBtn, 'disableButton');}
    },
    
    handlePetitionClickActions: function(component, event, helper) {
        var petitionSection = document.getElementById('petition-actions'),
            pPreview = document.getElementById('preview-container');         
        if (pPreview !=null && pPreview != undefined && pPreview.clientWidth) {
            setTimeout(function() {            
                pPreview.scrollTop = pPreview.scrollHeight;
                petitionSection.setAttribute("style","width: "+pPreview.clientWidth+"px;");                 
            }, 400);   
        }        
    },
    handleQeueueSelectActions: function(component, event, helper) {   
            var queueIdSelected = event.getParam("value");
            var commitButton = component.find('commit_button');           
           
            if(queueIdSelected == null ||queueIdSelected == ''){                
                $A.util.addClass(commitButton, 'disableButton');
               // commitButton.set('v.disabled',true);
            }
            else{                
                $A.util.removeClass(commitButton, 'disableButton');
               // commitButton.set('v.disabled',false);
            }
            if(queueIdSelected != ""){                        
                component.set('v.petitionCommitFlg', true);
                var queueOptions = component.get('v.queueOptions'),
                    selectedQueue = {};
                
                for (var i=0; i<queueOptions.length; i++) {
                    if(queueOptions[i].value == queueIdSelected){
                        selectedQueue.Id = queueOptions[i].value;
                        selectedQueue.Name =  queueOptions[i].label;
                    }
                }
                component.set('v.selectedQueue',selectedQueue); 
                helper.getAutoCaseNotes(component, 'noviolation');
            }
            else{                
                component.set('v.petitionCommitFlg', false);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "message": 'Please select a valid queue',
                    "type": "warning"
                });
                toastEvent.fire();
                return;
            }
            if(!queueIdSelected || component.get("v.caseNote")==null || component.get("v.caseNote")==''){
                $A.util.addClass(commitButton, 'disableButton');                
            }
            else{
                $A.util.removeClass(commitButton, 'disableButton');                
            }
    },
    imageHidePermanent: function(component, event, helper) {
        var prodName = component.get('v.simpleCase').ProductLR__r.Url_Name__c,
            cpactBtn = component.find('cpactBtn'),
            chkVal = event.getSource().get('v.value'),
            strContentVO = {};
        var unHideButton;
        var synergyId = component.get('v.simpleCase').Petition_Details__r.Target_Account__r.Synergy_ID__c;
        var id; var idType; var contentId;
        if(synergyId){
            synergyId = component.get('v.simpleCase').Petition_Details__r.Target_Account__r.Synergy_ID__c.split(';'),
            id = synergyId[0]; 
            idType = component.get('v.simpleCase').Petition_Details__r.Petition_Account_Type__c;
            contentId = component.get('v.simpleCase').Petition_Details__r.ContentID__c;
        }
        if (chkVal) {
            /*if (cpactBtn) {
                $A.util.removeClass(cpactBtn, 'disabled-section');
            }*/
            
            if(component.find('unHideContent'))
            {
            	unHideButton = component.find('unHideContent').get('v.value');
            }
            
            //If Unhide button is not selected
            if(!unHideButton)
            {
		            strContentVO = {
		                "url": component.get('v.simpleCase').Petition_Details__r.Hide_Url__c,
		                "id" : id,
		                "idType": idType,
		                "contentId": contentId,
						"action": "hide",
		                "crmProductName":prodName,
		                "platform": component.get('v.simpleCase').PlatformLR__r.InternalName__c
		            };           
	         }
	         else
	         {
	        	 	strContentVO = {
		                "url": component.get('v.simpleCase').Petition_Details__r.Hide_Url__c,
		                "urlOther": component.get('v.simpleCase').Petition_Details__r.Unhide_Url__c,
		                "id" : id,
		                "idType": idType,
		                "contentId": contentId,
						"action": "hide",
						"actionOther": "unhide",
		                "crmProductName":prodName,
		                "platform": component.get('v.simpleCase').PlatformLR__r.InternalName__c
		            };    
	         } 
        }
        else {
            var reasonValDom = component.find('reasonCode'),
                reasonVal = '';        	
            if (reasonValDom) {
                reasonVal = reasonValDom.get('v.value');
            }
            if (reasonVal == '') {
                $A.util.addClass(cpactBtn, 'disabled-section');
            }
        }
        // Checks if the action is already populated and in preview
        var tabFlag = component.get('v.tabViewFlag'),
            petionAct = component.find('selectPetitionAction');            
        
        if (tabFlag != 'PetitionDetail' && petionAct && petionAct.get('v.value')) {
            var petitionAction = petionAct.get('v.value');
            petitionAction = petitionAction.replace(/ /g,'');
            petitionAction = petitionAction.toLocaleLowerCase();
            var actAction = petionAct.get('v.value') == 'resolve-violationfound' ? 'violation' : 'noviolation';
            helper.getAutoCaseNotes(component, actAction);
        }
        component.set('v.strContentVO', strContentVO);
        var commitButton = component.find('commit_button');
        if($A.util.hasClass(commitButton, 'disableButton')){
             $A.util.removeClass(commitButton, 'disableButton');
        }
    },
    imageUnHidePermanent: function(component, event, helper) {
        var prodName = component.get('v.simpleCase').ProductLR__r.Url_Name__c,  
            chkVal = event.getSource().get('v.value'),
            cpactBtn = component.find('cpactBtn'),
            strContentVO = {};
        var synergyId = component.get('v.simpleCase').Petition_Details__r.Target_Account__r.Synergy_ID__c;
        var id; var idType; var contentId;
        if(synergyId){
            synergyId = component.get('v.simpleCase').Petition_Details__r.Target_Account__r.Synergy_ID__c.split(';'),
            id = synergyId[0]; 
            idType = component.get('v.simpleCase').Petition_Details__r.Petition_Account_Type__c;
            contentId = component.get('v.simpleCase').Petition_Details__r.ContentID__c;
        }
        if (chkVal) {
            /*if (cpactBtn) {
                $A.util.removeClass(cpactBtn, 'disabled-section');
            }*/
            
            var hideButton = component.find('hideContent').get('v.value');
            
            //If hide button is not selected
            if(!hideButton)
            {
            
		            strContentVO = {
		                "url": component.get('v.simpleCase').Petition_Details__r.Unhide_Url__c,
		                "id" : id,
		                "idType": idType,
		                "contentId": contentId,
						"action": "unhide",
		                "crmProductName":prodName,
		                "platform": component.get('v.simpleCase').PlatformLR__r.InternalName__c
		            };
		      }
              else
              {
            	  	strContentVO = {
		                "url": component.get('v.simpleCase').Petition_Details__r.Unhide_Url__c,
		                "urlOther": component.get('v.simpleCase').Petition_Details__r.Hide_Url__c,
		                "id" : id,
		                "idType": idType,
		                "contentId": contentId,
						"action": "unhide",
						"actionOther": "hide",
		                "crmProductName":prodName,
		                "platform": component.get('v.simpleCase').PlatformLR__r.InternalName__c
		            };     
              }
        }
        else {        	
            var reasonValDom = component.find('reasonCode'),
                reasonVal = '';        	
            if (reasonValDom) {
                reasonVal = reasonValDom.get('v.value');
            }
            /*if (cpactBtn && reasonVal == '') {
                $A.util.addClass(cpactBtn, 'disabled-section');
            }*/
        }
        // Checks if the action is already populated and in preview
        var tabFlag = component.get('v.tabViewFlag'),
            petionAct = component.find('selectPetitionAction');
        if (tabFlag != 'PetitionDetail' && petionAct && petionAct.get('v.value')) {
            var petitionAction = petionAct.get('v.value');
            petitionAction = petitionAction.replace(/ /g,'');
            petitionAction = petitionAction.toLocaleLowerCase();
            var actAction = petionAct.get('v.value') == 'resolve-violationfound' ? 'violation' : 'noviolation';
            helper.getAutoCaseNotes(component, actAction);
        }
        component.set('v.strContentVO', strContentVO);
        var commitButton = component.find('commit_button');
        if($A.util.hasClass(commitButton, 'disableButton')){
             $A.util.removeClass(commitButton, 'disableButton');
        }
    },
    keyPressController: function(component, event, helper) {
        var keyCode = event.getParams ? event.getParams().keyCode : event.keyCode;
        var selectedQueue = component.get('v.queueSelect');
        var petitionSelected = component.get('v.petitionActionSelected');
        var commitButton = component.find('commit_button');
        
        if(keyCode!="9" && keyCode!="13"){
                if((selectedQueue && selectedQueue != 'select queue') || petitionSelected == 'Resolve - No Violation Found'){
                    if(component.get('v.caseNote') == '' || component.get("v.caseNote")==null){
                        	$A.util.addClass(commitButton, 'disableButton');
                    }else{
                        $A.util.removeClass(commitButton, 'disableButton');                        
                    }
            }
            else{
                $A.util.addClass(commitButton, 'disableButton');                
            }
        }
    },
    handlePetitionCommitNext: function(component, event, helper) {
		if($A.util.hasClass(component.find("commit_button"),"disableButton")){
           return;
           }
        if(component.get("v.caseNote")!=null && component.get("v.caseNote")!=''){            
            var petitionSection = component.find('petition-actions');
            try {
                if ($A.util.hasClass(petitionSection, "slds-is-fixed")) {
                    $A.util.removeClass(petitionSection, 'slds-is-fixed');
                    
                }
            }
            catch(error) {}            
            var reasonCode = helper.getReasonCode(component, component.get('v.petitionActionsPrev'), component.get('v.caseAction'));
            helper.closeAgentWork(component);
            helper.handlePetitionSave(component, event, true, reasonCode); 
        }
    },
    handlePetitionCommitCompleted: function(component, event, helper) {
        console.log('Completed case Commit clicked in petition preview');
        //TODO Completed Case in Preview
    },
    updatePetitionActions: function(component, event, helper) {
        var evType = event.getParam("eventType");
        if(evType=="clickback"){
            var queueOptions = component.get('v.petitionActions'); 
            if(queueOptions){
                for (var i=0; i<queueOptions.length; i++) {
                    var option = queueOptions[i].label; option = option.replace(/ /g,'');
                    option = option.toLocaleLowerCase();
                    if(option == "resolve-violationfound"){
                        queueOptions.splice(i,1);
                    }
                }
                window.caseActionOptions = queueOptions;
                component.set('v.petitionActions',queueOptions); 
            }
        }
        else if(evType=="caseDetailTabClick"){
            helper.getCaseActionOptions(component,event);
        }
            else{
                helper.getCaseActionOptions(component,event);
            }
    },
    handleRowClickAppEvent:function(component,event,helper){
        var showHideQueueDrop = component.find('queueSelectDropdown');
        if(!$A.util.hasClass(showHideQueueDrop, 'slds-hide')){
            $A.util.addClass(showHideQueueDrop, 'slds-hide');
        }
    },
    getNextRowClickEvent: function(component, event, helper) {
        var spinner = component.find("petitionSpinner");
        $A.util.addClass(spinner, "slds-hide");
    },

    //Violation selected Evt
    violationSelectEvent: function(component, event, helper) {
        var violationFlg = event.getParam("violationFlag"),
            listOfMsg = event.getParam("lstOfViolationMsg"),
            petitionActions = component.find('selectPetitionAction');
        if (violationFlg) {
            petitionActions.set('v.value', "Escalate - Violation Found");
        }
        else {
            petitionActions.set('v.value', "Resolve - No Violation Found");
        }
        if (listOfMsg) {
            component.set('v.listOfMsg', listOfMsg);
            var casenote = [];
            for(var i=0 ;i<listOfMsg.length;i++){
                casenote.push(listOfMsg[i]);                
            }
            component.set("v.selectedViolationChat", casenote.join(', '));
        }
        component.set('v.petitionCommitFlg', true); 
    },
    
})