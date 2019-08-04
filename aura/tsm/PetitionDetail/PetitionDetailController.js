({
    init : function(component, event, helper) {
        helper.getCaseNote(component);	
        var workspaceAPI = component.find("workspace"),
            recordId = component.get('v.recordId'),
            simpleRecord = component.get('v.simpleRecord'),
            userId = $A.get("$SObjectType.CurrentUser.Id"),
        	simpleCase = component.get('v.simpleCase'),
            searchCaseFlg = component.get('v.searchCaseFlg'),
            openTabsInfo = [],
            readModeCase = component.get('v.readModeCase'),
            archiveCaseDetailFlg = component.get('v.archiveCaseDetailFlg'),
            petitionArchivedFlag = component.get('v.petitionArchivedFlag');
        component.set('v.userId', userId);        
        //Checking if it's first time login or refresh
        if (window.refreshFlag  === undefined) {
            window.refreshFlag = window.performance.navigation.type;
        } 
        if (!window.refreshFlag) {
            helper.focusTabtoQueue(component);
            window.refreshFlag = true;
        }
        else {
            window.refreshFlag = true;
        }
        
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            
            var focusedTab = response;
            workspaceAPI.getAllTabInfo().then(function(responseAll) {                
                var tabInfo = '',
                    item = '';
                for (item of responseAll) {
                    if (item && item.url.indexOf('OMNI') == -1) {
                        if (item.pageReference.attributes.attributes && item.pageReference.attributes.attributes.simpleCase) {
                            openTabsInfo.push({'tabId':item.tabId, 'tabNo':item.pageReference.attributes.attributes.simpleCase.CaseNumber});
                        }
                        else if(item.pageReference.attributes.attributes && item.pageReference.attributes.attributes.simpleRecord) {
                            openTabsInfo.push({'tabId':item.tabId, 'tabNo':item.pageReference.attributes.attributes.simpleRecord.id});
                        }                        
                    }                    
                    if (item && item.tabId && item.customTitle == undefined && item.pageReference.attributes.name && item.pageReference.attributes.name == "c:PetitionDetail") {
                        tabInfo = item;
                    }
                }
                window.localStorage.setItem('openTabsInfo', JSON.stringify(openTabsInfo));
                if (!tabInfo && focusedTab.pageReference.attributes.name && focusedTab.pageReference.attributes.name == "c:PetitionDetail") {
                    tabInfo = focusedTab;
                }
                if (tabInfo && tabInfo.tabId) {
                    if (tabInfo.customTitle != focusedTab.customTitle || (tabInfo.customTitle === undefined && tabInfo.pageReference.attributes.name == 'c:PetitionDetail')) {                
                        workspaceAPI.setTabLabel({
                            tabId: tabInfo.tabId,
                            label: "Case "+simpleCase.CaseNumber
                           // label: "TestCase"
                        });
                        //tab icon
                        var tabIconCase = archiveCaseDetailFlg || petitionArchivedFlag ? 'utility:lock' : 'standard:case';
                        workspaceAPI.setTabIcon({
                            tabId: tabInfo.tabId,
                            icon: tabIconCase,
                            iconAlt: "Case "+simpleCase.CaseNumber
                        });
                        window.setTimeout(function() {
                            
                            helper.focusTab(component, tabInfo.tabId);
                        },3500);
                    }
                }                
                // This is for to close the tabs when clicks on rows in Queue
                else {//if ('standard__navItemPage')
                    
                    var tabInfo = '';
                    for (var i = 0; i<responseAll.length; i++) {
                        tabInfo = responseAll[i];
                        if (tabInfo && tabInfo.tabId && tabInfo.pageReference.type && tabInfo.pageReference.type == "standard__navItemPage") {
                            break;
                        }
                    }
                    if (tabInfo && tabInfo.tabId) { // Queue Tab focused 
                        
                        helper.focusTab(component, tabInfo.tabId);
                        
                    }
                }
            }).catch(function(error) {
                console.log(error);
            });
            
        });
        if (recordId && simpleRecord) {
            component.set('v.simpleCase', simpleRecord);            
        }
        if(simpleCase && simpleCase.OwnerId && userId){
            component.set('v.caseStatus', simpleCase.Status);
            //THOR-1104 START
            if(simpleCase.Status == 'Closed'){                
                component.set('v.isWorkOn', true);
            }else{
                component.set('v.isWorkOn', false);
            }
            //THOR-1104 END
            //THOR-1143
            if (readModeCase || (simpleCase.RecordType && simpleCase.RecordType.Name.toLowerCase() != 'petition')) {
                component.set('v.isWorkOn', true);
            }
            if(!component.get('v.isWorkOn') && (simpleCase.OwnerId.substring(0,3) == '005' || simpleCase.OwnerId.substring(0,3) == '00G') && simpleCase.Status != 'Closed' && simpleCase.RecordType.Name.toLowerCase() == 'petition'){
                if (userId != simpleCase.OwnerId) {
                    component.set('v.isOwner', false);
                    if (simpleCase.Status == 'Active') {
                        component.set('v.isWorkOn', true);
                        // Added below global variable for THOR-1069
                        window.lockscreen =true;
                        console.log('component.findcaseAction'+component.find('caseAction'));
                        component.find('caseAction').set('v.tabIndex',-1);
                         
                     }
                    else{
                        component.set('v.isWorkOn', false);                        
                        if(simpleCase.Status != 'Closed'){
                            helper.acceptAgentWorkSearchCase(component, event, simpleCase.Id);
                        }
                    }
                }
                else{
                    component.set('v.isOwner', true);
                    if (simpleCase.Status != 'Active' && simpleCase.Status != 'Closed') {                      
                        helper.acceptAgentWorkSearchCase(component, event, simpleCase.Id);
                    }
                }
            }
            //Removing for THOR-1143
            //else if(simpleCase.OwnerId.substring(0,3) == '00G'){
            //    helper.acceptAgentWorkSearchCase(component, event, simpleCase.Id);
            //}
            
        }
        if (archiveCaseDetailFlg) {
            simpleCase.CaseNumber = simpleCase.strCaseNumber;
            simpleCase.Subject = simpleCase.strSubject;
            simpleCase.Account = {'id': simpleCase.strAccountId, 'Nucleus_ID__c':simpleCase.strNucleusID, 'Name': simpleCase.strAccountName};
            simpleCase.Status = simpleCase.strStatus;
            simpleCase.ProductLR__r = {'Name': simpleCase.strProductName};
            simpleCase.PlatformLR__r = {'Name': simpleCase.strPlatformName};
            simpleCase.Case_Category__r = {'Name': simpleCase.strCategoryName};
            simpleCase.RecordType = {'Name': 'Standard'};
            component.set('v.simpleCase', simpleCase);            
            component.set('v.isWorkOn', true);
        }
        // Archived Petition Details
        if (petitionArchivedFlag) {
            simpleCase.CaseNumber = simpleCase.caseNumber;
            simpleCase.Subject = simpleCase.subject;
            simpleCase.Account = {'id': simpleCase.accountid, 'Nucleus_ID__c':simpleCase.personaIdOnCase, 'Name': simpleCase.personaNamespace};
            simpleCase.Status = simpleCase.status;
            simpleCase.ProductLR__r = {'Name': simpleCase.productName, 'Url_Name__c': simpleCase.productUrlName};
            simpleCase.PlatformLR__r = {'Name': simpleCase.platformName, 'InternalName__c': simpleCase.platformUrlName};
            simpleCase.Case_Category__r = {'Name': simpleCase.categoryName};
            simpleCase.RecordType = {'Name': 'Petition'};
            var Target_Account = {'Id' : simpleCase.petitionArchivedVO.archiveTargetAccount,'Nucleus_ID__c' : simpleCase.petitionArchivedVO.targetUserid};
            simpleCase.Petition_Details__r = {'Target_Account__r': Target_Account, 
                                              'PetitionUUID__c': simpleCase.petitionUUId,
                                              'Target_Persona_Id__c': simpleCase.petitionArchivedVO.targetPersonaId,
                                              'PersonEmail': simpleCase.petitionArchivedVO.targetPersonaName,
                                              'View_Url__c': simpleCase.petitionArchivedVO.contentUrl,
                                              'Content_Type__c': simpleCase.petitionArchivedVO.contentType,
                                              'Target_Account__c': simpleCase.petitionArchivedVO.archiveTargetAccount};
            simpleCase.Id = simpleCase.id;
			
			//Past Activity = THOR 1336
            var iconList = {'Petition created': 'standard:recent', 'Transferred': 'utility:forward', 'Resolved': 'utility:check', 'Notes Appended': 'utility:note', 'Escalated': 'utility:arrowup', 'Created': 'standard:recent'};
        	if (simpleCase.caseComments) {
                var caseNotes = simpleCase.caseComments;
                for (var i=0; i<caseNotes.length; i++) {
                    caseNotes[i].className = '';
                    if (i > 1) {
                        caseNotes[i].className = 'slds-hide';
                    }
                    if(caseNotes[i].caseAction != 'undefined'){
                        caseNotes[i].iconType = iconList[caseNotes[i].strCaseAction];
                    }               
                    
                    if(caseNotes[i].strLastModifiedDate != 'undefined'){
                        caseNotes[i].strLastModifiedDate = $A.localizationService.formatDateUTC(caseNotes[i].strLastModifiedDate); 
                    } 
                }
                simpleCase.caseComments = caseNotes;
            }
            component.set('v.simpleCase', simpleCase);            
            component.set('v.isWorkOn', true);            
        }
		window.setTimeout(function() {
            var caseDetailTab = component.find('caseDetailTab'),
                caseStatusCmp = component.find('caseStatusCmp');
            if (caseDetailTab) {
                caseDetailTab.find('accNotes').getAccountNotes();
				if(caseDetailTab.find('supportingPetitions') != undefined){
                    caseDetailTab.find('supportingPetitions').getMergedPetitions();
                }
            }
            if (caseStatusCmp) {
                caseStatusCmp.getCaseEventsData();
            }
            // Target Acc Id
            if (simpleCase && searchCaseFlg) { 
                
                component.set('v.targetAccountSFId', simpleCase.Petition_Details__r && simpleCase.Petition_Details__r.Target_Account__r?simpleCase.Petition_Details__r.Target_Account__r.Id:'');
                if(simpleCase.Petition_Details__r == undefined){
                    component.set('v.targetAccountId', simpleCase.Account?simpleCase.Account.Nucleus_ID__c:'');
                    component.set('v.targetAccountEmail', simpleCase.Account?simpleCase.Account.PersonEmail:'');
                }
                else{
                    component.set('v.targetAccountId', simpleCase.Petition_Details__r.Target_Account__r ? simpleCase.Petition_Details__r.Target_Account__r.Nucleus_ID__c:'');
                    component.set('v.targetAccountEmail', simpleCase.Petition_Details__r.Target_Account__r?simpleCase.Petition_Details__r.Target_Account__r.PersonEmail:'');
                }
                helper.getProductsByAccount(component); 
                var pdcaseAct = component.find('pdCaseAction');
				if (pdcaseAct != undefined){
					pdcaseAct.getSupportedMessageType();
					pdcaseAct.set('v.msgLanguageVal', simpleCase.LocaleLR__c);
                }
            }
        }, 3000);  
		//Reset the History tab flags
        if (window.caseHistoryArchiveSF != undefined) {
            var caseHistoryCmpId = component.find('caseHistoryCmp');
            if (caseHistoryCmpId) {
                caseHistoryCmpId.set('v.pageNumber', 1);
                caseHistoryCmpId.set('v.pageNumberArch', 0);
                window.caseHistoryArchiveSF = true;
                window.caseHistoryArchive = false;
            }            
        }
		window.setTimeout(function() {
                    if (simpleCase && searchCaseFlg) { 
                        var playerAccDetail = component.find('accountDetailTab');
                        var caseDetail;
                        if(playerAccDetail == undefined)
                        {
                            caseDetail = component.find('caseDetailTab');
                            if(caseDetail != undefined){
                                component.set('v.targetAccountID', simpleCase.Petition_Details__r && simpleCase.Petition_Details__r.Target_Account__r?simpleCase.Petition_Details__r.Target_Account__r.Id:simpleCase.Account ? simpleCase.Account.Id : '');
                                if (caseDetail.find('accStatusCmp')) {
                                    //playerAccDetail.find('accStatusCmp').set("v.recordId", simpleRecord.strSFAccountId);
                                    var accStatus = caseDetail.find('accStatusCmp');
                                    accStatus.set('v.targetAccountSFId',simpleCase.Petition_Details__r&&simpleCase.Petition_Details__r.Target_Account__r?simpleCase.Petition_Details__r.Target_Account__r.Id:simpleCase.Account ? simpleCase.Account.Id:'');
                                    accStatus.getSrikesAcc();
                                }
                            }
                        }
                    }
                }, 5000);  
	},
	clickBack : function(component, event, helper) {
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
	},
    viewPetitionDetails: function(component, event, helper) {
        // The below code added for THOR-1146
		var params = event.getParam("arguments");
        var PTabType = params.type;
        var objCase = params.objCase;    
        var workId = params.agentWorkId;
        //The WorkOn wil be always false as the Advisor is working on assigned cases
        component.set('v.isWorkOn', false);
        event.stopPropagation();
		if (objCase != undefined && PTabType != 'caseAction') {
            component.set('v.simpleCase', objCase);
            component.set('v.caseObj', objCase); //Store Old case value
            component.set('v.workId', workId);           	
            if (objCase.Petition_Details__r) {
                component.set('v.searchCaseFlg', false);
                component.set('v.targetAccountId', objCase.Petition_Details__r.Target_Account__r ?objCase.Petition_Details__r.Target_Account__r.Nucleus_ID__c:'');
                component.set('v.targetAccountEmail', objCase.Petition_Details__r.Target_Account__r?objCase.Petition_Details__r.Target_Account__r.PersonEmail:'');
				helper.getProductsByAccount(component); 
                var pdcaseAct = component.find('pdCaseAction');
				if (pdcaseAct != undefined){
					pdcaseAct.getSupportedMessageType();
					pdcaseAct.set('v.msgLanguageVal', objCase.LocaleLR__c);
                }
                //if (objCase.Petition_Details__r) {
                    /*var chkCTAct = objCase.Petition_Details__r.Content_Action__c ? true : false,
                        contentActPermsHide = false,
                        contentActPermsShow = false;
                    if (chkCTAct) {
                        if (objCase.Petition_Details__r.Content_Action__c.toLowerCase() != 'hide' && objCase.Petition_Details__r.Unhide_Url__c) {
                            contentActPermsHide = true
                        }
                    }
                    if (!chkCTAct && objCase.Petition_Details__r.Hide_Url__c) {
                        contentActPermsHide = true;
                    }
                    if (!contentActPermsHide) {
                        if (objCase.Petition_Details__r.Content_Action__c && objCase.Petition_Details__r.Content_Action__c.toLowerCase() == 'hide' && objCase.Petition_Details__r.Unhide_Url__c) {
                            contentActPermsShow = true
                        }
                    }
                    component.set('v.contentActPermsHide', contentActPermsHide);
                    component.set('v.contentActPermsShow', contentActPermsShow);*/
                //}
            }
        }
       	if (PTabType == 'account') {
            component.set('v.tabsId', 'playerAccount');
            component.find('accountDetailTab').getAccountDetails('playerAccount'); 
        }
        else if(PTabType != 'caseAction') {
            component.set('v.tabsId', 'caseDetail');            
        }
        var caseDetail = component.find('caseDetailTab'),
            caseStatusCmp = component.find('caseStatusCmp');
        if (PTabType != 'caseAction' && caseDetail) {
        	window.setTimeout(function(){
	            var caseDetailCmp = caseDetail.getPetitionDetails('caseDetail');
	        }, 600); 
        }
        if (caseStatusCmp) {
            caseStatusCmp.getCaseEventsData();
        }
        //Reset the History tab flags
        if (window.caseHistoryArchiveSF != undefined) {
            var caseHistoryCmpId = component.find('caseHistoryCmp');
            if (caseHistoryCmpId) {
                caseHistoryCmpId.set('v.pageNumber', 1);
                caseHistoryCmpId.set('v.pageNumberArch', 0);
                window.caseHistoryArchiveSF = true;
                window.caseHistoryArchive = false;
            } 
        }
    },
    // Get the acount history tab open after click of petition Number
    petitionPlayerToAccount: function(component, event, helper) {        
    	component.set('v.tabsId', 'accountCaseHistory');        
    },
    tabSelected: function(component,event,helper) {		
        var tabValue = event.getParam('id');
        if(tabValue == 'playerAccount') {
            component.find('accountDetailTab').getAccountDetails('playerAccount');            
        } 
        if(tabValue == 'accountCaseHistory') {
            component.find('caseHistoryCmp').getAllCasesByAccIdSF();            
        }
        if (tabValue == 'caseDetail') {
            component.find('caseDetailTab').getStrikesDetails();
        }
    },
    setOwner: function(component, event, helper) {
        var record = event.getParam('value'),
            userId = $A.get('$SObjectType.CurrentUser.Id'),
            isOwner = component.get('v.isOwner');
        if(record.OwnerId && record.OwnerId.length > 15) {
            if(record.OwnerId.indexOf(userId) != -1) {
                component.set('v.isOwner', true);
            }
        }
    }
})