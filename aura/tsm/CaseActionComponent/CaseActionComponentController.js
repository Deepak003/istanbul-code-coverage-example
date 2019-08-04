({
    doInit : function(component, event, helper) {        
        var petitionOptions = component.get('v.petitionActions'),
            isAccount = component.get('v.isAccount'),
            commitButton = component.find('commit_button'),
            queueSelectDropdown = component.find('queueSelectDropdown');					
        //thor-492 start
		if(!$A.util.hasClass(commitButton, "disableButton")){
            $A.util.addClass(commitButton, "disableButton");
        }
        if(!$A.util.hasClass(queueSelectDropdown, 'slds-hide')){
            $A.util.addClass(queueSelectDropdown, 'slds-hide');
        }
        helper.getAvailableStatusId(component);
        helper.getReasonCodes(component);
        if (helper.getMsgLanguages) {
            helper.getMsgLanguages(component);
        }
        component.set('v.userType', window.userType);
        component.set('v.selectedPetitionAction',null);
        
        var selectedItems = {};
        component.set('v.selectedItems',selectedItems); 
        //component.set('v.targetAccount', {'status':'ACTIVE'}); // Hardcoded for now as Target Player section is not implemented.
        component.set('v.franchiseObj', {'status': 'ACTIVE', 'name': 'FIFA'}); // Hardcoded for now as Target Player section is not implemented.
        component.set('v.productObj', {'status': 'ACTIVE', 'name': ''}); // Hardcoded for now as Target Player section is not implemented.
        component.set('v.entitlementObj', {});
        
        var selectedviolationOptions = {};
        selectedviolationOptions = {  
               "strType":  null, 
               "strIDType": null,
               "strAction": null,
               "strParentId":null,
               "strComment":null,
               "strStatusReasonCode":null, 
               "lstIDInfo" : null,
               "strProduct": null,
               "strDurationUnit": null,
               "strDuration": null,
               "strNewFranchiseBan":null,
               "strNucleusId": null
            };
		component.set('v.violationSelectedOptionList',selectedviolationOptions);
        if (!petitionOptions) {
            if (isAccount) {
                petitionOptions = [
                    { value: "", label: "Select an action" },
                    { value: "create-petition", label: "Create Petition" },
                    { value: "create-dispute", label: "Create Dispute" }
                ];                
                component.set('v.petitionActionFlag', false);	
                helper.getProducts(component);
				component.set("v.petitionActions", petitionOptions);													 
            } else{
                 var strikeLevelsObj = [
                        { value: "thirdMinorStrike", label: "3rd Minor Strike" },
                        { value: "fourthMinorStrike", label: "4th Minor Strike" },
                        { value: "fifthMinorStrike", label: "5th Minor Strike" } ,
                        { value: "secondMajorStrike", label: "2nd Major Strike" },
                        { value: "thirdMajorStrike", label: "3rd Major Strike" },
                        { value: "fourthMajorStrike", label: "4th Major Strike" },
                        { value: "fifthMajorStrike", label: "5th Major Strike" } 
                        
                    ];
                    component.set("v.strikeLevels", strikeLevelsObj);
                    var penaltyLevelsObj = [
                        { value: "account", label: "Account" },
                        { value: "franchise", label: "Franchise" },
                        { value: "product", label: "Product" } ,
                        { value: "entitlement", label: "Entitlement" }
                    ];
                    //component.set("v.penaltyLevels", penaltyLevelsObj);
                    var disciplinaryActionsObj = [
                        { value: "warn", label: "Warn" },
                        { value: "suspend", label: "Suspend" },
                        { value: "squelch", label: "Squelch" } ,
                        { value: "banned", label: "Ban" }
                    ];
                    //component.set("v.disciplinaryActions", disciplinaryActionsObj);
                    var durationListObj = [
                        { value: "1", label: "1 day" },
                        { value: "3", label: "3 days" },
                        { value: "7", label: "7 days" } ,
                        { value: "30", label: "30 days" },
                        { value: "customDuration", label: "Custom Duration" }
                    ];
                    component.set("v.durationList", durationListObj);
                	var customDurationUnits = [
                        { value: "hours", label: "Hour(s)" },
                        { value: "days", label: "Days" },
                        { value: "weeks", label: "Weeks" } ,
                        { value: "months", label: "Months" },
                        { value: "years", label: "Years" }
                    ];    
                	component.set("v.customDurationUnits", customDurationUnits);
					helper.getCaseActionOptions(component);
            }            
            
            var contentPenaltyEventsParam = {
                "strEntitlementId": "",
                "strEntitlementSource": "",
                "strEntitlementTag": "",
                "strEntitlementType": "",                
                "strCrmProductName" : "",
                "strStatus": "",                
                "strFranchiseName" : "",                
                //"personaId": ""
            };
			component.set('v.contentPenaltyActionEventParam', contentPenaltyEventsParam);
            var aditionalActions = [
                		{ value: "", label: "Select aditional action" },
                        { value: "Transfer", label: "Transfer Petition" },
                        { value: "Escalate", label: "Escalate Petition" } 
            ];
            component.set('v.aditionalActions', aditionalActions);
          //thor-492 end
        }         
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
        else{
           helper.getCaseActionOptions(component,event);
        }
    },
	
	handleQeueueSelectActions: function(component, event, helper) {
        var queueIdSelected = event.getParam("value");
        var commitButton = component.find('commit_button');
        var commitButtonCase = component.find('commit_button_casedetail');
		var makeCaseAccNotesBtn =component.find('makeCaseAccNotesBtn');
        if(queueIdSelected == null || queueIdSelected == ''){
            $A.util.addClass(commitButtonCase, 'disableButton');
            $A.util.addClass(commitButton, 'disableButton');           
        }
        else{
           $A.util.removeClass(commitButtonCase, 'disableButton');
            $A.util.removeClass(commitButton, 'disableButton');
        }
        if(queueIdSelected != ""){
            $A.util.removeClass(makeCaseAccNotesBtn, 'disableButton');	
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
        	$A.util.addClass(makeCaseAccNotesBtn, 'disableButton');
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
    handlePetitionActions: function(component, event, helper) {  
        var selectedOptionValue = event.getParam("value"),
            petitionCommitFlg = component.get('v.petitionCommitFlg'),
            petitionSection = component.find('petition-actions'),
            createCase = component.get('v.createCase'),
            tabViewFlag = component.get('v.tabViewFlag'),
            makeNotesSection = component.find('makeNotesCD'),
            petitionMakenotes = component.find('petition-makenotes'),
            violationConfirmedDropdown = component.find('violationConfirmedOptions'),
            petitionContentPenalties = component.find('petition-content-penalties');
          component.set('v.petitionActionSelected',selectedOptionValue);
        var commitButton = component.find('commit_button');
        var commitButtonCase = component.find('commit_button_casedetail');
        var selectedQueue = component.find('queueSelect');
          if(selectedOptionValue == '' || (!selectedOptionValue.includes("Resolve") && (selectedQueue =='' || selectedQueue == undefined))){
                $A.util.addClass(commitButtonCase, 'disableButton');
                $A.util.addClass(commitButton, 'disableButton');  
            }

        else{
                $A.util.removeClass(commitButtonCase, 'disableButton');  
                $A.util.removeClass(commitButton, 'disableButton');  
            }
        //Scroll Bar Flag
        if (selectedOptionValue) {
            window.actionScrollFlag = true;        	
        }
        else {
            window.actionScrollFlag = false;
        }
        var checkViolationFound,
            checkViolationFoundNxt;
        checkViolationFound = selectedOptionValue.replace(/ /g,'');
        checkViolationFound = checkViolationFound.toLocaleLowerCase();
        if(checkViolationFound == "resolve-violationfound"){
          	checkViolationFoundNxt = true;
        }  
        else{
            checkViolationFoundNxt = false;
        }
        //THOR-1197
		var penaltySectionVln = component.find('penaltySectionVln');
		if (penaltySectionVln) {
			$A.util.removeClass(penaltySectionVln, 'slds-hide'); 
		}
        //Checking for Content Hide & Unhide Perms
        var  caseObj = component.get("v.simpleCase");
        //Checking for Content Hide & Unhide Perms
            if(caseObj && caseObj.Petition_Details__r != null){
            var chkCTAct = caseObj.Petition_Details__r.Content_Action__c ? true : false,
                contentActPermsHide = false,
                contentActPermsShow = false;
            // THOR 1141
             if (!chkCTAct) {
                if ( caseObj.Petition_Details__r.Content_Action__c  != 'hide'  &&
                      caseObj.Petition_Details__r.Content_Action__c  != 'unhide' 
                    	&& caseObj.Petition_Details__r.ContentID__c) 
                {
                    contentActPermsHide = true
                }
            } 
            if (chkCTAct) {
                if (caseObj.Petition_Details__r.Content_Action__c.toLowerCase() == 'hide' && caseObj.Petition_Details__r.ContentID__c) {
                    contentActPermsShow = true
                }
            }
                
           if (chkCTAct) {
           		if (caseObj.Petition_Details__r.Content_Action__c.toLowerCase() == 'unhide' && caseObj.Petition_Details__r.ContentID__c) {
                    contentActPermsHide = true
                }
           }
          // End of THOR 1141
			
			if (chkCTAct) {
                if (caseObj.Petition_Details__r.Content_Action__c.toLowerCase() != 'hide' && caseObj.Petition_Details__r.Unhide_Url__c) {
                    contentActPermsHide = true
                }
            }
            if (!chkCTAct && caseObj.Petition_Details__r.Hide_Url__c) {
                contentActPermsHide = true;
            }
            if (!contentActPermsHide) {
                if (caseObj.Petition_Details__r.Content_Action__c && caseObj.Petition_Details__r.Content_Action__c.toLowerCase() == 'hide' && caseObj.Petition_Details__r.Unhide_Url__c) {
                    contentActPermsShow = true
                }
            }
       	    }
            if (contentActPermsHide && window.permsList) {
            	contentActPermsHide = window.permsList.includes('content hide');
            }
            if (contentActPermsShow && window.permsList) {
            	contentActPermsShow = window.permsList.includes('content unhide');
            } 
        component.set('v.contentActPermsHide', contentActPermsHide);
        component.set('v.contentActPermsShow', contentActPermsShow);
        // Acc Notes  accountNotes
        var accountNotes = component.find('accountNotes');
        if (caseObj && caseObj.Petition_Details__r && !caseObj.Petition_Details__r.Target_Account__r && caseObj.RecordType.Name == 'Petition') {
            if (accountNotes) {
                $A.util.addClass(accountNotes, 'slds-hide');
            }
        }
        else if(caseObj) {
            if (accountNotes) {
                $A.util.removeClass(accountNotes, 'slds-hide');
            }
        }
        // Code Refactor END for THOR-1197
        //Checking for Content Hide & Unhide Perms END
        if (selectedOptionValue == 'create-petition' || selectedOptionValue == 'create-dispute') {
            window.createCaseOption = selectedOptionValue;
            component.set('v.petitionCaseFlag', selectedOptionValue == 'create-petition' ? true : false);
            component.set('v.createCase', true);
            component.find('createCaseProduct').set('v.SearchKeyWord', '');
            component.find('createCasePlatform').set('v.SearchKeyWord', '');
            component.find('createCasePlatform').set('v.listOfSearchRecords', []);
            component.find('createCasePlatform').set('v.listOfSearchRecordsLast', []);
            component.find('createCaseCategory').set('v.SearchKeyWord', '');
            component.find('createCaseCategory').set('v.listOfSearchRecords', []);
            component.find('createCaseCategory').set('v.listOfSearchRecordsLast', []);
            if (selectedOptionValue == 'create-petition') {
                component.find('createCaseContentType').set('v.SearchKeyWord', '');                
            } 
            // Get Tos Categories
            var createCaseCategory = component.find('createCaseCategory');
            if (createCaseCategory && selectedOptionValue == 'create-dispute') {
                createCaseCategory.set('v.objectAPIName', 'getDisputeCategories');
            }
            else if(createCaseCategory){
                createCaseCategory.set('v.objectAPIName', 'getTosCategoriesByProduct');
            }
            
            /*THOR-1459*/ 
	        $A.util.removeClass(component.find('cancelCreateCaseClick'), 'disableButton');
	        $A.util.removeClass(component.find('createCaseClick'), 'disableButton');
	        component.find('createCaseSubject').set('v.value', '');
	        component.find('createCaseNotes').set('v.value', '');
	        
            // END
        } 
        else if(checkViolationFoundNxt) {
            var  showHideQueueDrop = component.find('queueSelectDropdown');
            if(!$A.util.hasClass(showHideQueueDrop, 'slds-hide')){
                $A.util.addClass(showHideQueueDrop, 'slds-hide');
            }
        	// Penalty Drop Downs Options ,
        	//var penaltyLevelsObj = component.get("v.penaltyLevels"),
			helper.getPenaltyOptions(component);
	        
	         // THOR 490
        	helper.getStrikes(component); 	
        	/*
			if (caseObj && caseObj.ProductLR__r) {
        		var inGameMsgFld = caseObj.ProductLR__r ? caseObj.ProductLR__r.Message_Type__c: '',
		        	gameLabel = caseObj.ProductLR__r.Name,
		        	thorSpeFranSupport = 'Fifa'; //TODO Get the value from Custom Label
		       
        		penaltyLevelsObj = [{ value: "account", label: "Account" }];
        
		        if (thorSpeFranSupport) {
		        	thorSpeFranSupport = thorSpeFranSupport.toLowerCase();
		        	if (gameLabel && gameLabel.toLowerCase().includes(thorSpeFranSupport)) {
		        		penaltyLevelsObj.push({ value: "franchise", label: "Franchise" });
		        	}
		        }	
		        if (inGameMsgFld && inGameMsgFld.includes('In-Game')) {
		        	penaltyLevelsObj.push({ value: "product", label: "Product" });                        
		        }
		        else {
		        	penaltyLevelsObj.push({ value: "entitlement", label: "Entitlement" });
		        }
		        component.set("v.penaltyLevels", penaltyLevelsObj);
        	}
			*/
            component.set('v.selectedPetitionAction',selectedOptionValue);            
            
            $A.util.removeClass(violationConfirmedDropdown, 'slds-hide');
            $A.util.addClass(violationConfirmedDropdown, 'slds-show');
            $A.util.removeClass(petitionContentPenalties, 'disabled-section');
			if(makeNotesSection) {
                 $A.util.addClass(petitionMakenotes, 'disabled-section');
                 $A.util.addClass(makeNotesSection, 'slds-hide');
            }
            //Check for THOR-1197
            if (penaltySectionVln && !caseObj.Petition_Details__r.Target_Account__r) {
                $A.util.addClass(penaltySectionVln, 'slds-hide'); 
                if(makeNotesSection) {
                    helper.cpsectionReset(component);
                    if (selectedOptionValue) {
                        setTimeout(function(){
                            $A.util.removeClass(petitionMakenotes, 'disabled-section');
                            $A.util.removeClass(makeNotesSection, 'slds-hide');
                        }, 100);
                    }
                    else {
                        $A.util.addClass(makeNotesSection, 'slds-hide');
                    }
                    //Getting the auto notes
                    helper.getAutoCaseNotes(component, 'violation');	
                    var  showHideQueueDrop = component.find('queueSelectDropdown');
                    if(showHideQueueDrop && !$A.util.hasClass(showHideQueueDrop, 'slds-hide')){
                        $A.util.addClass(showHideQueueDrop, 'slds-hide');
                    }
                }
            }
            
            helper.cpsectionReset(component);
        }
        else if(checkViolationFound == 'resolve-noviolationfound') { //Unhide - hide content section for THOR-1197
            $A.util.removeClass(violationConfirmedDropdown, 'slds-hide');
            $A.util.removeClass(petitionContentPenalties, 'disabled-section');
            $A.util.addClass(penaltySectionVln, 'slds-hide');
            if(makeNotesSection) {
                helper.cpsectionReset(component);
                if (selectedOptionValue) {
                    setTimeout(function(){
                        $A.util.removeClass(petitionMakenotes, 'disabled-section');
                        $A.util.removeClass(makeNotesSection, 'slds-hide');
                    }, 100);
                }
                else {
                    $A.util.addClass(makeNotesSection, 'slds-hide');
                }
                //Getting the auto notes
                helper.getAutoCaseNotes(component, 'noviolation');	
                var  showHideQueueDrop = component.find('queueSelectDropdown');
                if(showHideQueueDrop && !$A.util.hasClass(showHideQueueDrop, 'slds-hide')){
                    $A.util.addClass(showHideQueueDrop, 'slds-hide');
                }
            }
		}
        else { 
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
                if (petitionContentPenalties) {
                    $A.util.addClass(violationConfirmedDropdown, 'slds-hide');
                    $A.util.addClass(petitionContentPenalties, 'disabled-section');
							   
                }
                if (petitionCommitFlg) {            
                    window.scrollPetitionFlag = true;
                }
                else {                
                    $A.util.removeClass(petitionSection, 'slds-is-fixed');
                    component.set('v.createCase', false);                
                }
            if(makeNotesSection) {
				helper.cpsectionReset(component);
				if (selectedOptionValue) {
					setTimeout(function(){
	                    $A.util.removeClass(petitionMakenotes, 'disabled-section');
	                	$A.util.removeClass(makeNotesSection, 'slds-hide');
	                }, 100);
				}
				else {
					$A.util.addClass(makeNotesSection, 'slds-hide');
            }														 
        }
		}

        if(selectedOptionValue !== '' || component.get("v.caseNote")==null || component.get("v.caseNote")=='' ){
            $A.util.addClass(commitButton, 'disableButton'); 
        }
        else{
            $A.util.removeClass(commitButton, 'disableButton');
        }

        var makeCaseAccNotesBtn =component.find('makeCaseAccNotesBtn');
        $A.util.addClass(makeCaseAccNotesBtn, 'disableButton');
        if(selectedOptionValue == 'Resolve - No Violation Found' && (component.get("v.caseNote")==null || component.get("v.caseNote")==''))
        {
            $A.util.removeClass(makeCaseAccNotesBtn, 'disableButton');
        }
    },

	handleRowClickAppEvent:function(component,event,helper){
       var showHideQueueDrop = component.find('queueSelectDropdown');
        if(!$A.util.hasClass(showHideQueueDrop, 'slds-hide')){
            $A.util.addClass(showHideQueueDrop, 'slds-hide');
        }
    },
	
    //THOR 490
    selectStrikeType:function(component,event,helper){
        helper.selectStrike(component);
    },
                          
    //thor-492 start
    strikeLevelsAction: function(component, event, helper) {
        var selectedOptionValue = event.getParam("value");
        helper.cpsectionReset(component, 'hide,strike');
        
    },

     EntitlementAction : function(component,event,helper){
        console.log('calling==method==');
        helper.getProductEntitlements(component);
    },
    
    penaltyLevelsAction: function(component, event, helper) {
        var selectedOptionValue = event.getParam("value"),
            entitlementSection = component.find("productEntitlementsSection"),
            updatePenalityAction  = component.get("v.violationSelectedOptionList"),
            petitionCaseObj = component.get('v.simpleCase').Petition_Details__r,
            contentPenaltyEventsParam = component.get('v.contentPenaltyActionEventParam'),
            caseObj = component.get('v.simpleCase'),
        	selectedItems = component.get('v.selectedItems'),
            targetAccount = component.get('v.targetAccount'),
            franchiseObj = component.get('v.franchiseObj'),
            productObj = component.get('v.productObj');
        	
        
        updatePenalityAction.strType = selectedOptionValue.toUpperCase();
        updatePenalityAction.strIDType = null;
        updatePenalityAction.strDurationUnit = null;
        updatePenalityAction.strDuration = null;
        helper.enableDisable(component, event);
        helper.cpsectionReset(component, 'hide,strike,penalty');
        if(selectedOptionValue == "Account"){
            selectedItems = {};
            selectedItems.strCurrenStatus = targetAccount.status;
            //updatePenalityAction.idType="NucleusId";
            if(!$A.util.hasClass(entitlementSection, "slds-hide")){
                $A.util.addClass(entitlementSection, "slds-hide");
            }
            delete updatePenalityAction.strParentId;
            delete updatePenalityAction.strProduct;
            delete updatePenalityAction.strNewFranchiseBan;
            delete updatePenalityAction.strNucleusId;
            
            updatePenalityAction.lstIDInfo = [{"id": petitionCaseObj && petitionCaseObj.Target_Account__r ? petitionCaseObj.Target_Account__r.Nucleus_ID__c : ''}];
            var setAcctReasonCodes = {};
            setAcctReasonCodes = component.get('v.accountReasonCodes');
            component.set('v.reasonCodesList',setAcctReasonCodes);
            
        }
        else if(selectedOptionValue == "Franchise"){
            //updatePenalityAction.idType="FIFA";
            selectedItems = {};
            selectedItems.strCurrenStatus = franchiseObj.status;
            selectedItems.strFranchiseName = franchiseObj.name;
            updatePenalityAction.strType = 'FRANCHISE_BAN';
            contentPenaltyEventsParam.franchiseName = "FIFA";
            //updatePenalityAction.newFranchiseBan = true;
            delete updatePenalityAction.strParentId;
            updatePenalityAction.strNucleusId = petitionCaseObj && petitionCaseObj.Target_Account__r ? petitionCaseObj.Target_Account__r.Nucleus_ID__c : '';
			updatePenalityAction.lstIDInfo = [{"id": petitionCaseObj && petitionCaseObj.Target_Account__r ? petitionCaseObj.Target_Account__r.Nucleus_ID__c : ''}];
            //updatePenalityAction.lstIDInfo = [{"id": caseObj.ProductLR__r ? caseObj.ProductLR__r.Id : ''}];
            if(!$A.util.hasClass(entitlementSection, "slds-hide")){
                $A.util.addClass(entitlementSection, "slds-hide");
            }
            var setFranchiseReasonCodes = {};
            setFranchiseReasonCodes = component.get('v.franchiseReasonCodes');
            component.set('v.reasonCodesList',setFranchiseReasonCodes);            
        }
         else if(selectedOptionValue == "Entitlement") {
             selectedItems = {};
             selectedItems.entitlements = [];
             delete updatePenalityAction.strNewFranchiseBan;
             delete updatePenalityAction.strNucleusId;
             delete updatePenalityAction.strproduct;
             
             //updatePenalityAction.idType="EntitlementId";             
             $A.util.removeClass(component.find("violationActionSpinner"), "slds-hide");
             helper.getProductEntitlements(component);
             var setEntReasonCodes = {};
             setEntReasonCodes = component.get('v.entReasonCodes');
             component.set('v.reasonCodesList',setEntReasonCodes);            
        }
        else { // THis is Product Ban/Sus
            
            delete updatePenalityAction.strParentId;
            delete updatePenalityAction.strNewFranchiseBan;
            delete updatePenalityAction.strNucleusId;
            selectedItems = {};
            selectedItems.strCurrenStatus = productObj.status;
            
                var productName = caseObj.ProductLR__r ? caseObj.ProductLR__r.Name.split(' ').join(''):'';
                selectedItems.strCrmProductName = productName;
                
                updatePenalityAction.strIDType = caseObj.ProductLR__r ? caseObj.ProductLR__r.Name.split(' ').join('')+'Id':'';
                updatePenalityAction.lstIDInfo = [{"id": petitionCaseObj && petitionCaseObj.Target_Account__r ? petitionCaseObj.Target_Account__r.Nucleus_ID__c : ''}];
                //updatePenalityAction.lstIDInfo = [{"id": caseObj.ProductLR__r ? caseObj.ProductLR__r.Id : ''}];
                updatePenalityAction.strProduct = caseObj.ProductLR__r.Url_Name__c;
                contentPenaltyEventsParam.crmProductName = component.get('v.simpleCase').ProductLR__r.Name;
            
            if(!$A.util.hasClass(entitlementSection, "slds-hide")) {
                $A.util.addClass(entitlementSection, "slds-hide");
            }
            var setEntReasonCodes = component.get('v.entReasonCodes');
             component.set('v.reasonCodesList',setEntReasonCodes);
        }
        var durationValCmp = component.find('durationBan'),
            durationVal = '',
            durationUnit = 'days';
        if (durationValCmp && durationValCmp.get('v.value')) {
            durationVal = durationValCmp.get('v.value');
            if (durationVal == 'customDuration') {
                durationVal = component.find('custDurationVal') ? component.find('custDurationVal').get('v.value'):'';
                durationUnit = component.find('customDurationUnit') ? component.find('customDurationUnit').get('v.value'):'days';                
            }
            durationVal = helper.convertCustomToDays(component, durationVal, durationUnit);
            helper.durationForPenaltyAction(component, durationVal);
        }
        component.set('v.selectedItems',selectedItems);
        //contentPenaltyEventsParam.NucleusId = petitionCaseObj && petitionCaseObj.Target_Account__r ? petitionCaseObj.Target_Account__r.Nucleus_ID__c : '';
        //alert('updatePenalityAction >>>> '+ JSON.stringify(updatePenalityAction));
        component.set('v.violationSelectedOptionList',updatePenalityAction);
        component.set('v.contentPenaltyActionEventParam',contentPenaltyEventsParam);
    },
    // Start THOR 490 
    strikeActions : function(component,event, helper){
        helper.selectedStrikeAction(component);
    },
    // End THOR 490
    disciplinaryActions: function(component, event, helper) {
        var updateDisciplinaryAction = component.get('v.violationSelectedOptionList');
        var selectedOptionValue = event.getParam("value");
        var disciplinarySection = component.find("selectedDisciplinarySection");
        helper.enableDisable(component, event);
        if (selectedOptionValue == 'Warn' || selectedOptionValue == 'Ban'){
            if(!$A.util.hasClass(disciplinarySection, "slds-hide")) {
                $A.util.addClass(disciplinarySection, "slds-hide");
            }
        }
        else{
            if($A.util.hasClass(disciplinarySection, "slds-hide")) {
                $A.util.removeClass(disciplinarySection, "slds-hide");
            }
        }
        updateDisciplinaryAction.strAction = selectedOptionValue.toUpperCase();        
        component.set('v.violationSelectedOptionList',updateDisciplinaryAction);
        helper.cpsectionReset(component, 'hide,strike,penalty,displact');
    },
    
    durationActions: function(component, event, helper) {
        var selectedOptionValue = event.getParam("value"),
            customDurationDropdown = component.find("customDurationSection");
        helper.cpsectionReset(component, 'hide,strike,penalty,displact,duration');
        helper.enableDisable(component, event);
        if(selectedOptionValue && selectedOptionValue == "customDuration") {            
        	$A.util.removeClass(customDurationDropdown, "slds-hide");
        }
        else {
            $A.util.addClass(customDurationDropdown, "slds-hide");
            helper.durationForPenaltyAction(component, selectedOptionValue);
        }
    },
    
    reasonCodesAction: function(component, event, helper) {
        var selectedOptionValue = event.getParam("value");
       	var updateReasonCode= component.get('v.violationSelectedOptionList');
       	helper.enableDisable(component, event);
        /*var cpactBtn = component.find('cpactBtn');
        if (cpactBtn) {
            $A.util.removeClass(cpactBtn, 'disabled-section');
        }*/      
        updateReasonCode.strStatusReasonCode = selectedOptionValue;
        //helper.cpsectionReset(component, 'strike,penalty,displact,duration,reason');
        component.set('v.violationSelectedOptionList',updateReasonCode);
    },
    
    customDurationActions: function(component, event, helper) {         
        var durationUnit = event.getParam("value"),
        	durationNumber = component.get('v.durationNumber');
        helper.enableDisable(component, event);
        if (isNaN(durationNumber) && durationNumber < 0) {
            alert('enter valid duration');
            return;
        } 
        //conversion to days        
        durationNumber = helper.convertCustomToDays(component, durationNumber, durationUnit);
        helper.durationForPenaltyAction(component, durationNumber, durationUnit); 
    },
    
    saveContinueContentPenalties: function(component, event, helper) {
            if (!window.agentStatus || (window.agentStatus && window.agentStatus == 'Offline')) {
                helper.displayErrorMsg('error', 'Please changes the status to available in Omni Widget');
                return;
            }
        
            //console.log('commit action clickedddddd');
            //display the consolidated violation action list
            //If the button is disabled then return from here
            if ($A.util.hasClass(event.currentTarget, 'disabled-section')) {
                return;
            }
            
            var violationConfirmedDropdown = component.find('violationConfirmedOptions');
            var violationActionSelectedList = component.find('violationActionSelectedList');
            $A.util.removeClass(violationConfirmedDropdown, 'slds-show');
            $A.util.addClass(violationConfirmedDropdown, 'slds-hide');
            $A.util.removeClass(violationActionSelectedList, 'slds-hide');
            $A.util.addClass(violationActionSelectedList, 'slds-show');
        helper.updateViolationActionOptions(component);
        helper.getAutoCaseNotes(component, 'violation');
        var msgDisplay = helper.getValuestoDisplay(component, 'strikeLevelAdjust', 'value', 'strikeLevels'),
            penaltyVal = helper.getValuestoDisplay(component, 'penaltyLevel', 'value', 'penaltyLevels'),
            prodVal = component.get('v.simpleCase').ProductLR__r.Name,
            displAction = helper.getValuestoDisplay(component, 'disciplinaryAction', 'value', 'disciplinaryActions'),
            displDuran = helper.getValuestoDisplay(component, 'durationBan', 'value', 'durationList'),
            dispReason = helper.getValuestoDisplay(component, 'reasonCode', 'value', 'reasonCodesList'),
            hideContChbox = component.find('hideContent'),
            unHideCntChbox = component.find('unHideContent'),
            strikeType = component.get('v.selectedStrikeType'),
            strikeSelected = component.get('v.selectedStrike');
        if (component.find('durationBan').get('v.value') == 'customDuration') {
            displDuran = component.find('custDurationVal').get('v.value') + ' ' + component.find('customDurationUnit').get('v.value');
        }
        if (hideContChbox && hideContChbox.get('v.value')) {
            msgDisplay = msgDisplay + "\n " + 'Hide Image Content Permanently\n';
        }
        if (unHideCntChbox && unHideCntChbox.get('v.value')) {
            msgDisplay = 'Un Hide Image Content \n' + msgDisplay;
        }
        if(strikeType && strikeSelected){
            if(component.get('v.selectedStrikeMsgName') != null){
            	msgDisplay = component.get('v.selectedStrikeMsgName')+ '  \n'  + msgDisplay;
            }
            //strikeType+': '+ strikeSelected+ ' \n' + msgDisplay;
        }
        if (penaltyVal) {
            if (penaltyVal == 'Entitlement') {
                var ents = component.find('productEntitlementsLookup').get('v.listOfSelectedRecords'),
                	i = 0,
                    entsName = [];
                for(i in ents) {
                    entsName.push(ents[i].Name);
                }
                prodVal = entsName.join(', ');
            }
            if (penaltyVal == 'Account') {                
                prodVal = '';
            }
            if (prodVal) {
                prodVal = ' - ' + prodVal;
            }
            msgDisplay = msgDisplay + "\n " + "Penalty: " + penaltyVal + prodVal;
            msgDisplay = msgDisplay + "\n" + penaltyVal + ' ' +displAction + ' applied: ' + displDuran;
            msgDisplay = msgDisplay + "\n" + 'Reason: ' + dispReason;
        }        
        //console.log(msgDisplay);
        var cpamsgSection = component.find('cpamsgSection'),
            makeNotesSection = component.find('makeNotesCD'),
            petitionMakenotes = component.find('petition-makenotes'),
            editPCAClick = component.find('editPCAClick');
        $A.util.removeClass(cpamsgSection, 'slds-hide');
        $A.util.removeClass(editPCAClick, 'slds-hide');
        cpamsgSection.getElement().innerText = msgDisplay;
        if(makeNotesSection) {                
            $A.util.removeClass(petitionMakenotes, 'disabled-section');
            $A.util.removeClass(makeNotesSection, 'slds-hide');
        }
        var makeCaseAccNotesBtn =component.find('makeCaseAccNotesBtn');
        if(component.get('v.caseNote') || component.get("v.caseNote")==null || component.get("v.caseNote")=='' ){
            $A.util.removeClass(makeCaseAccNotesBtn, 'disableButton');
        }
        else{
        	$A.util.addClass(makeCaseAccNotesBtn, 'disableButton');
        }
    },
    
    selectEntitlementEventTrigger: function(component, event, helper) {
       console.log('selected entitlement');
        JSON.stringify(event.getParams());
       //add the selected pill with name to the pill container section
       //<lightning:pill label="With isolated remove handler" onremove="{! c.handleRemoveOnly }" onclick="{! c.handleClick }"/>
		
    },

	//thor-492 end
    
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
            catch(error) {console.log(erroe);}        
            helper.closeAgentWork(component);
            var reasonCode = helper.getReasonCode(component, component.get('v.petitionActions'), component.get('v.caseAction'));
            helper.handlePetitionSave(component, event, true, reasonCode); 
        }
    },
    
    handlePetitionCommit: function(component, event, helper) {
        if(component.get("v.caseNote")!=null && component.get("v.caseNote")!=''){  
            //TODO for saving a petition record        
            helper.closeAgentWork(component);
            var reasonCode = helper.getReasonCode(component, component.get('v.petitionActions'), component.get('v.caseAction'));
            helper.handlePetitionSave(component, event, true, reasonCode);
        }
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
        
        //component.set("v.caseNote", casenote);
    },
    
    createCaseClick: function(component, event, helper) {
        if (!window.agentStatus || (window.agentStatus && window.agentStatus == 'Offline')) {
            helper.displayErrorMsg('error', 'Please changes the status to available in Omni Widget');
            return;
        }
        helper.createCase(component, event);
        
       
                
    },
    
    getNextRowClickEvent: function(component, event, helper) {
        var spinner = component.find("petitionSpinner");
        $A.util.addClass(spinner, "slds-hide");
    },
    
    cancelCaseClick: function(component, event, helper) {
        var petitionActions = component.find('selectPetitionAction');
        petitionActions.set('v.value', '');
        component.set('v.createCase', false);
    },
    handlePetitionCancel: function(component, event, helper) {
        component.find('selectPetitionAction').set("v.value", '');
        component.set('v.petitionCommitFlg', false);
    },
    
    clickOpenCase: function(component, event, helper) {
        $A.util.addClass(event.currentTarget, 'slds-hide');
        component.set('v.petitionActionFlag', true);
        //component.set('v.tabViewFlag', 'Queued');
        //component.find('selectPetitionAction').set("v.value", '');
        $A.util.toggleClass(component.find('appendActions'), 'slds-hide');
    },
    
    updateCaseObjEvent: function(component, event, helper) {
        var caseObj = event.getParam("caseObj");
        component.set('v.caseObj', caseObj);    
           
    },
    
    
    
    appendActions: function(component, event, helper) {
        component.set('v.petitionActionFlag', false);
    },
    
    makeNotesCommit: function(component, event, helper) {
        if($A.util.hasClass(component.find("commit_button_casedetail"),"disableButton")){
           return;
           }
        if(component.get("v.caseNote")!=null && component.get("v.caseNote")!=''){
            var tabViewFlag = component.get('v.tabViewFlag');  
            try {
                if (tabViewFlag == 'PetitionDetail') {            
                    $A.util.toggleClass(component.find('makeNotesCD'), 'slds-hide');
                    helper.closeAgentWork(component);
                    var reasonCode = helper.getReasonCode(component, component.get('v.petitionActions'), component.get('v.caseAction'));
                    
                    helper.handlePetitionSave(component, event, true, reasonCode);
                    
                }            
                
            }
            catch(err) {}
        } 
        
        /*THOR-THOR-1254 :
        Requirement : Clicking "Commit" to resolve a case does not bring us back to the Queue. The case is closed in the background, but the view stays in the case details.
        For Tier 1 petitions, on click of 'Commit' button, this method - makeNotesCommit gets called and hence, make below call to bring the advisor back to Queue view after case is resolved.*/	
		$A.enqueueAction(component.get('c.clickBack'));

    },
    
    imageHidePermanent: function(component, event, helper) {
        var prodName = component.get('v.simpleCase').ProductLR__r.Url_Name__c,
            cpactBtn = component.find('cpactBtn'),
            chkVal = event.getSource().get('v.value'),
            strContentVO = {};
            var unHideButton;
        var synergyId = component.get('v.simpleCase').Petition_Details__r.Target_Account__r?component.get('v.simpleCase').Petition_Details__r.Target_Account__r.Synergy_ID__c:'';
        var id; var idType; var contentId;
        if(synergyId){
            synergyId = synergyId.split(';'),
            id = synergyId[0]; 
            idType = component.get('v.simpleCase').Petition_Details__r.Petition_Account_Type__c;            
        } 
        if (component.get('v.simpleCase').Petition_Details__r.ContentID__c) {
			contentId = component.get('v.simpleCase').Petition_Details__r.ContentID__c;            
        }
        if (chkVal) {
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
        }
        // Checks if the action is already populated and in preview
        var tabFlag = component.get('v.tabViewFlag'),
        	petionAct = component.find('selectPetitionAction');            
        
        if (petionAct && petionAct.get('v.value')) {
			var petitionAction = petionAct.get('v.value');
            petitionAction = petitionAction.replace(/ /g,'');
            petitionAction = petitionAction.toLocaleLowerCase();
            var actAction = petitionAction == 'resolve-violationfound' ? 'violation' : 'noviolation';
            helper.getAutoCaseNotes(component, actAction);
        }
        component.set('v.strContentVO', strContentVO);
    },
    imageUnHidePermanent: function(component, event, helper) {
        var prodName = component.get('v.simpleCase').ProductLR__r.Url_Name__c,  
            chkVal = event.getSource().get('v.value'),
            cpactBtn = component.find('cpactBtn'),
			strContentVO = {};
        var synergyId = component.get('v.simpleCase').Petition_Details__r.Target_Account__r?component.get('v.simpleCase').Petition_Details__r.Target_Account__r.Synergy_ID__c:'';
        var id; var idType; var contentId;
        if(synergyId){
            synergyId = synergyId.split(';'),
            id = synergyId[0]; 
            idType = component.get('v.simpleCase').Petition_Details__r.Petition_Account_Type__c;            
        }
        if (component.get('v.simpleCase').Petition_Details__r.ContentID__c) {
            contentId = component.get('v.simpleCase').Petition_Details__r.ContentID__c;
        }
        if (chkVal) {
            if (cpactBtn) {
                $A.util.removeClass(cpactBtn, 'disabled-section');
            }
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
            if (cpactBtn && reasonVal == '') {
                $A.util.addClass(cpactBtn, 'disabled-section');
            }
        }
        // Checks if the action is already populated and in preview
        var tabFlag = component.get('v.tabViewFlag'),
        	petionAct = component.find('selectPetitionAction');
        if (petionAct && petionAct.get('v.value')) {
			var petitionAction = petionAct.get('v.value');
            petitionAction = petitionAction.replace(/ /g,'');
            petitionAction = petitionAction.toLocaleLowerCase();
            var actAction = petitionAction == 'resolve-violationfound' ? 'violation' : 'noviolation';
			helper.getAutoCaseNotes(component, actAction);	
        }
        component.set('v.strContentVO', strContentVO);
    },
    //Make Notes Save And Continue for Send Msg Section
    makeNotesSaveContinue: function(component, event, helper) {
        var selectedQueue = component.get('v.queueSelect'),
			petitionActSelected = component.get('v.petitionActionSelected');
        if((!selectedQueue || selectedQueue.includes('select')) && !petitionActSelected.includes('Resolve'))
        {
            return;
        }
        if(component.get("v.caseNote")!=null && component.get("v.caseNote")!=''){
            var petitionMsgSec = component.find('petition-message'),
                sendMsg = component.find('sendMsg'),
                makeNotesSection = component.find('makeNotesCD'),
                makeNotesMsgSection = component.find('makeNotesMsgSection'),
                mnmsgCase = component.find('mnmsgCase'),
                mnmsgAcc = component.find('mnmsgAcc'),
                dateToday = new Date(),
                notesDisplay = (dateToday.getMonth()+1).toLocaleString().padStart(2,0) + '/' +dateToday.getDate().toLocaleString().padStart(2,0)+'/' +dateToday.getFullYear() + ': ',
                editMknoteClick = component.find('editMknoteClick'),
                caseObj = component.get("v.simpleCase");
            
            ///Send MsG section will be disable for target account Null
            var supportMsg = component.get('v.supportedMsgType');
            if (caseObj && !caseObj.Petition_Details__r.Target_Account__r) {
                supportMsg = null;
            }
            else {
                helper.getSuprtMessageType(component);
            }                 
            if (petitionMsgSec) {                
                if (supportMsg && (supportMsg.isEmail || supportMsg.isInGame)) {
                    /*THOR-1343 : SUS : If condition added to add disabled CSS when Petition action is selected as 'Resolve - No Violation Found', in order to hide 'Send Message' panel*/
                    if(petitionActSelected != 'Resolve - No Violation Found' )
                    {
                    	$A.util.removeClass(petitionMsgSec, 'disabled-section');
                    	$A.util.removeClass(sendMsg, 'slds-hide');
                    }
                    else if(petitionActSelected == 'Resolve - No Violation Found' )
                    {
                    	$A.util.addClass(petitionMsgSec, 'disabled-section');
                    	$A.util.addClass(sendMsg, 'slds-hide');
                    	
                    }
                }
                else {
                    var petitionAddSec = component.find('petition-aditional-actions'),
                        addAction = component.find('addlnActnSec');
                    $A.util.removeClass(petitionAddSec, 'disabled-section');
                    $A.util.removeClass(addAction, 'slds-hide');
                }
            }
            
            $A.util.addClass(makeNotesSection, 'slds-hide');
            $A.util.removeClass(makeNotesMsgSection, 'slds-hide');
            mnmsgCase.getElement().innerText = '';
            mnmsgAcc.getElement().innerText = '';
            if (component.get('v.caseNote'))
                mnmsgCase.getElement().innerText = notesDisplay + component.get('v.caseNote');
            if (component.get('v.accNote'))
                mnmsgAcc.getElement().innerText = notesDisplay + component.get('v.accNote');
            // Load the Templates for user TODO for Strikes 
            var strikeVal = component.find('strikeLevelAdjust') ? component.find('strikeLevelAdjust').get('v.value'): '';
            /*if (strikeVal) {
            helper.getTemplateMessage(component, '', 'Email');
        }
        else {
            var emailTemplateOptions = component.get('v.emailTemplateOptions');
            if (emailTemplateOptions && emailTemplateOptions[0]) {
                if (component.find('emailMsgTemplateCMB')) 
                	component.find('emailMsgTemplateCMB').set('v.value', emailTemplateOptions[0].value);
            	helper.getTemplateMessage(component, emailTemplateOptions[0].value, 'Email');
            }
        }*/
        
        // Enable the Commit button
        var commitButton = component.find('commit_button'),
        	commitActionSection = component.find('commitActionSection'),
        	caseNote = component.get('v.caseNote');
        if (caseNote && caseNote.trim()) {
        	$A.util.removeClass(commitButton, 'disableButton');
        	$A.util.removeClass(commitActionSection, 'disabled-section');
        }
        $A.util.removeClass(editMknoteClick, 'slds-hide');
    }
    },
    // Send Msg Section action
    sendMsgSaveContinue: function(component, event, helper) {
        // THOR-1221 Starts -->
        var sendMsgpopUpCmp = component.find('sendMsgpopUpCmp'),
            emailMsgCont = component.get('v.emailMsgTmpl'),
            inGameMsgCont = component.get('v.inGameMsgTmpl'),
            popUpContentArr = [];
        
        if (emailMsgCont) {
			popUpContentArr.push(emailMsgCont);           
        }
        if (inGameMsgCont) {
			popUpContentArr.push(inGameMsgCont);           
        }
        sendMsgpopUpCmp.set('v.header', 'Send Message');
        sendMsgpopUpCmp.set('v.emailMsgTmpl', emailMsgCont);
        sendMsgpopUpCmp.set('v.inGameMsgTmpl', inGameMsgCont);
        sendMsgpopUpCmp.set('v.isPopUp', true);
    },
    sendMsgPrevSaveContinue : function(component, event, helper) {        
        var petitionAddSec = component.find('petition-aditional-actions'),
            addAction = component.find('addlnActnSec'),
            emailingMsgSection = component.find('emailingMsgSection'),
            snmsgLan = component.find('snmsgLan'),
            sendMsg = component.find('sendMsg'),
            snmsgEmailTempl = component.find('snmsgEmailTempl'),
            snmsgInGameTempl = component.find('snmsgInGameTempl'),
            editMsgClick = component.find('editMsgClick');
        if (petitionAddSec) {
            $A.util.removeClass(petitionAddSec, 'disabled-section');
            $A.util.removeClass(addAction, 'slds-hide');
        }
        //
        $A.util.removeClass(emailingMsgSection, 'slds-hide');
        $A.util.addClass(sendMsg, 'slds-hide');
        var langMsgLabel = helper.getValuestoDisplay(component, 'msgLanguage', 'value', 'msgLanguageOptions'),
            emailMsgLabel = helper.getValuestoDisplay(component, 'emailMsgTemplateCMB', 'value', 'emailTemplateOptions'),
            inGameMsgLabel = helper.getValuestoDisplay(component, 'inGameMsgTemplate', 'value', 'emailTemplateOptions');
        if (snmsgLan) {
            snmsgLan.getElement().innerText = langMsgLabel;
        }
        
        if (snmsgEmailTempl) {
            snmsgEmailTempl.getElement().innerText = '';
            snmsgEmailTempl.getElement().innerText = emailMsgLabel;
        }
        if (snmsgInGameTempl) {
            snmsgInGameTempl.getElement().innerText = inGameMsgLabel;
        }
        $A.util.removeClass(editMsgClick, 'slds-hide');
        var commitButton = component.find('commit_button'),
        	commitActionSection = component.find('commitActionSection');
        if ($A.util.hasClass(commitButton, 'disableButton')) {
        	$A.util.removeClass(commitButton, 'disableButton')
        }
        if ($A.util.hasClass(commitActionSection, 'disabled-section')) {
        	$A.util.removeClass(commitActionSection, 'disabled-section')
        }
    },
    expandEmailMsgClick : function(component, event, helper) {
        //TODO   thor-expan-editor
        var emailMessageMain = component.find('emailMessageMain'),
            expandEmailMsgClick = component.find('expandEmailMsgClick'),
            contractEmailMsgClick = component.find('contractEmailMsgClick'),
            emailPopContainer = component.find('emailPopContainer'),
            emailPopHeader = component.find('emailPopHeader'),
            emailPopContent = component.find('emailPopContent');
        if (emailMessageMain) {
           $A.util.toggleClass(emailMessageMain, 'thor-expan-editor');
            $A.util.toggleClass(contractEmailMsgClick, 'thor-expan-icon-clicked');
           $A.util.toggleClass(contractEmailMsgClick, 'slds-hide');
            $A.util.toggleClass(emailPopContainer, 'slds-modal__container');
            $A.util.toggleClass(emailPopHeader, 'slds-modal__header');
            $A.util.toggleClass(emailPopContent, 'slds-modal__content');
        }
    },
    expandIngameMsgClick : function(component, event, helper) {
      //TODO 
      	var ingameMessageMain = component.find('ingameMessageMain'),
            contractIngameMsgClick = component.find('contractIngameMsgClick'),
            ingamePopContainer = component.find('ingamePopContainer'),
            ingamePopHeader = component.find('ingamePopHeader'),
            ingamePopContent = component.find('ingamePopContent');
        if (ingameMessageMain) {
            $A.util.toggleClass(ingameMessageMain, 'thor-expan-editor');
            $A.util.toggleClass(contractIngameMsgClick, 'thor-expan-icon-clicked');
            $A.util.toggleClass(contractIngameMsgClick, 'slds-hide');
             $A.util.toggleClass(ingamePopContainer, 'slds-modal__container');
            $A.util.toggleClass(ingamePopHeader, 'slds-modal__header');
            $A.util.toggleClass(ingamePopContent, 'slds-modal__content');
        } 
    },
    contractEmailMsgClick: function(component, event, helper) {
        var emailMessageMain = component.find('emailMessageMain'),
            expandEmailMsgClick = component.find('expandEmailMsgClick'),
            contractEmailMsgClick = component.find('contractEmailMsgClick'),
            emailPopContainer = component.find('emailPopContainer'),
            emailPopHeader = component.find('emailPopHeader'),
            emailPopContent = component.find('emailPopContent');
        if (emailMessageMain) {
           $A.util.toggleClass(emailMessageMain, 'thor-expan-editor');
            $A.util.toggleClass(contractEmailMsgClick, 'thor-expan-icon-clicked');
           $A.util.toggleClass(contractEmailMsgClick, 'slds-hide');
            $A.util.toggleClass(emailPopContainer, 'slds-modal__container');
            $A.util.toggleClass(emailPopHeader, 'slds-modal__header');
            $A.util.toggleClass(emailPopContent, 'slds-modal__content');
        }
    },
    contractIngameMsgClick: function(component, event, helper) {
        var ingameMessageMain = component.find('ingameMessageMain'),
            contractIngameMsgClick = component.find('contractIngameMsgClick'),
             ingamePopContainer = component.find('ingamePopContainer'),
            ingamePopHeader = component.find('ingamePopHeader'),
            ingamePopContent = component.find('ingamePopContent');
        if (ingameMessageMain) {
            $A.util.toggleClass(ingameMessageMain, 'thor-expan-editor');
            $A.util.toggleClass(contractIngameMsgClick, 'thor-expan-icon-clicked');
            $A.util.toggleClass(contractIngameMsgClick, 'slds-hide');
             $A.util.toggleClass(ingamePopContainer, 'slds-modal__container');
            $A.util.toggleClass(ingamePopHeader, 'slds-modal__header');
            $A.util.toggleClass(ingamePopContent, 'slds-modal__content');
        }
    },
    //THOR-1221 Ends -->
    handleAditionalActions: function(component, event, helper) {
        var commitActionSec = component.find('commitActionSection');
        if (commitActionSec) {
            $A.util.removeClass(commitActionSec, 'disabled-section');            
        }
    },
    
    keyPressController: function(component, event, helper) {
        var keyCode = event.getParams ? event.getParams().keyCode : event.keyCode;
        var selectedQueue = component.get('v.queueSelect');
        var petitionSelected = component.get('v.petitionActionSelected');
        var commitButton = component.find('commit_button');
        var commitButtonCasedetail = component.find('commit_button_casedetail');
        var makeCaseAccNotesBtn =component.find('makeCaseAccNotesBtn');
        var makeNotesSection = component.find('makeNotesCD');
        if(keyCode!="9" && keyCode!="13"){
                if((selectedQueue && selectedQueue != 'select queue') || petitionSelected == 'Resolve - No Violation Found'){
                    if(component.get('v.caseNote') == '' || component.get("v.caseNote")==null){
                        $A.util.addClass(commitButton, 'disableButton');
                        $A.util.addClass(commitButtonCasedetail, 'disableButton');     
                        $A.util.addClass(makeCaseAccNotesBtn, 'disableButton');
                    }else{
                        $A.util.removeClass(makeCaseAccNotesBtn, 'disableButton');
                        $A.util.removeClass(commitButtonCasedetail, 'disableButton');
                        if($A.util.hasClass(makeNotesSection, 'slds-hide')){
                            $A.util.removeClass(commitButton, 'disableButton');
                        }
                    }
            }
            else{
                $A.util.addClass(commitButton, 'disableButton');
                $A.util.addClass(commitButtonCasedetail, 'disableButton');
                $A.util.addClass(makeCaseAccNotesBtn, 'disabled-section');
            }
        }
    },
    
    
    // Commit For the Action Section For Petion Detail/CaseDetail Page
    handleCommitActionSection: function(component, event, helper) {
		if($A.util.hasClass(component.find("commit_button"),"disableButton")){
           return;
           }
        if (!window.agentStatus || (window.agentStatus && window.agentStatus == 'Offline')) {
            helper.displayErrorMsg('error', 'Please changes the status to available in Omni Widget');
            return;
        }
        
        if(component.get("v.caseNote")!=null && component.get("v.caseNote")!=''){
            console.log('Saving/committing case ');// TODO
            helper.closeAgentWork(component);
            var reasonCode = helper.getReasonCode(component, component.get('v.petitionActions'), component.get('v.caseAction'));
            
            
            
            helper.handlePetitionSave(component, event, true, reasonCode); 
        }
        
        
         /*THOR-THOR-1254 :
        Requirement : Clicking "Commit" to resolve a case does not bring us back to the Queue. The case is closed in the background, but the view stays in the case details.
        For Tier 2 petitions, on click of 'Commit' button, this method - handleCommitActionSection gets called and hence, make below call to bring the advisor back to Queue view after case is resolved.*/	
		$A.enqueueAction(component.get('c.clickBack'));
		  
    },
    
    handleMsgLocaleChanged: function(component, event, helper) {
        console.log('Changed locales for templates to get ');// TODO
        var tempLocaleVal = event.getParam("value"),
        	selData = '';            
        component.set('v.emailMsgTmpl', '');
        component.set('v.inGameMsgTmpl', '');
        if (tempLocaleVal) {
        	//Added the locale for Arabic RTL
        	//
        	selData = component.get('v.msgLanguageOptions').find(function(pData, pindex) {
		             if (pData.value == tempLocaleVal) {		                 
		                 return pData;
		             }
		        });
			var strMsgLocale = component.get('v.strMsgLocale'),
                emailMsgDom = component.find('emailMsgTmplId'),
                inGameMsgDom = component.find('inGameMsgTmplId');
            
            if ($A.util.hasClass(emailMsgDom, strMsgLocale)) {
                $A.util.removeClass(emailMsgDom, strMsgLocale);
            }
            if ($A.util.addClass(inGameMsgDom, strMsgLocale)) {
                $A.util.removeClass(inGameMsgDom, strMsgLocale);
            }
		    $A.util.addClass(emailMsgDom, selData.label);
		    $A.util.addClass(inGameMsgDom, selData.label);
            component.set('v.strMsgLocale', selData.label);
            helper.getTemplateList(component, tempLocaleVal, 'Email');
        }
    },
    
    handleEmailTemplateChanged: function(component, event, helper) {
        var templateId = event.getParam("value");
        if (templateId) {
            helper.getTemplateMessage(component, templateId, 'Email');
        }
    },
    handleInGameTemplateChanged: function(component, event, helper) {
        var templateId = event.getParam("value");
        if (templateId) {
            helper.getTemplateMessage(component, templateId, 'InGame');
        }
    },
    
    getSuprtMessageType: function(component, event, helper) {
        helper.getSuprtMessageType(component);
        helper.resetActionSections(component);
    },
    
    copyCaseNotesAcc: function(component, event, helper) {
        var caseNote = component.get('v.caseNote');        
        component.set('v.accNote', event.getSource().get('v.value')?caseNote:'');
    },
    
    accNotemarkPinned: function(component, event, helper) {
        // TODO
    },
    
    editPCAClick: function(component, event, helper) {        
        var cpamsgSection = component.find('cpamsgSection'),
            violationConfirmedDropdown = component.find('violationConfirmedOptions'),
            editPCAClick = component.find('editPCAClick');
        $A.util.addClass(cpamsgSection, 'slds-hide');
        $A.util.addClass(editPCAClick, 'slds-hide');
        $A.util.removeClass(violationConfirmedDropdown, 'slds-hide');
        helper.selectStrike(component);
    },    
    editMknoteClick: function(component, event, helper) {
    	var makeNotesSection = component.find('makeNotesCD'),
            makeNotesMsgSection = component.find('makeNotesMsgSection'),
            editMknoteClick = component.find('editMknoteClick');
        $A.util.removeClass(makeNotesSection, 'slds-hide');
        $A.util.addClass(editMknoteClick, 'slds-hide');
        $A.util.addClass(makeNotesMsgSection, 'slds-hide');
    },
    editMsgClick: function(component, event, helper) {
    	var emailingMsgSection = component.find('emailingMsgSection'),            
            sendMsg = component.find('sendMsg'),
            editMsgClick = component.find('editMsgClick');
        component.set('v.sendMsgPreviewFlg', false);
        $A.util.addClass(emailingMsgSection, 'slds-hide');
        $A.util.addClass(editMsgClick, 'slds-hide');
        $A.util.removeClass(sendMsg, 'slds-hide');
    },
    caseNoteBlurEvt: function(component, event, helper) {    	
    	var caseNote = component.get('v.caseNote'),
    		copyChkboxAcc = component.find('copyContentAcc'),
    		saveCntBtn = component.find('makeCaseAccNotesBtn');
    	// Enable Button Save and Continue
        /*caseNote = caseNote ? caseNote.trim() : caseNote;
    	component.set('v.caseNote', caseNote);
    	if (caseNote) {
    		$A.util.removeClass(saveCntBtn, 'disableButton');
    	}
    	else {
    		$A.util.addClass(saveCntBtn, 'disableButton');    		
    	}*/
        if(caseNote) {
            $A.util.removeClass(saveCntBtn, 'disableButton');
        }
    	if (copyChkboxAcc && copyChkboxAcc.get('v.value'))
    		component.set('v.accNote', caseNote);
    	// Check for the Commit Button
    	if (!component.get('v.sendMsgPerms') && caseNote) {
    		$A.util.removeClass(component.find('commitActionSection'), 'disableButton');
    	}
    },
    emailMsgBlurEvt: function(component, event, helper) {
        var emailTempContent = component.get('v.emailMsgTmpl'),
        	inGameMsgTmpl = component.get('v.inGameMsgTmpl'),
            sndMsgSaveCnt = component.find('sndMsgSaveCnt');
        if (emailTempContent.length >10000) {
            component.set('v.errorMessageEmail', 'Message length exceeds');
            helper.displayErrorMsg('error', 'Message length exceeds.');
            $A.util.addClass(sndMsgSaveCnt, 'disableButton');
        }
        else if (inGameMsgTmpl.length <= 10000) {
            $A.util.removeClass(sndMsgSaveCnt, 'disableButton');
               
        }
        
    },
    inGameMsgBlurEvt: function(component, event, helper) {
        var emailTempContent = component.get('v.emailMsgTmpl'),
            inGameMsgTmpl = component.get('v.inGameMsgTmpl'),
            sndMsgSaveCnt = component.find('sndMsgSaveCnt');
        if (inGameMsgTmpl.length >10000) {
            component.set('v.errorMessageIngame', 'Message length exceeds');
            helper.displayErrorMsg('error', 'Message length exceeds.');
            $A.util.addClass(sndMsgSaveCnt, 'disableButton');
        }
        else if (emailTempContent.length <= 10000)  {
            
            $A.util.removeClass(sndMsgSaveCnt, 'disableButton');
        } 
    },

    onChangeEntitlement : function(component, event, helper){
        helper.enableDisable(component, event);
    },
    customDurationBlurEvent : function(component, event, helper) {
        var durationUnit = component.find('customDurationUnit').get('v.value'),
        	durationNumber = event.getSource().get('v.value');
        helper.enableDisable(component, event);
        if (isNaN(durationNumber) && durationNumber < 0) {
            alert('enter valid duration');
            return;
        } 
        //conversion to days        
        durationNumber = helper.convertCustomToDays(component, durationNumber, durationUnit);
        helper.durationForPenaltyAction(component, durationNumber, durationUnit); 
    },
    
    clickBack : function(component, event, helper) {
    
    	//Logic to bring back advisor to the Queue view starts here
        var appEvent = $A.get("e.c:PetitionDetailEvent");        
        // Application Event Fire
        if (appEvent != undefined) {
            appEvent.setParams({
                id : '',
                domEl: ''
            });
            appEvent.fire();
        }
        var appEvent = $A.get("e.c:updatePetitionActionsEvt"); //updating actions in case detail page
        if (appEvent != undefined) {
            appEvent.setParams({
                eventType: "clickback"
            });  
            appEvent.fire();
        } 
        //Logic to bring back advisor to the Queue view ends here
        
	}
	
	                                 
      
    
})