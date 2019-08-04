({
	init : function(component, event, helper) {
		var recordId = component.get('v.recordId');
        console.log(recordId);
        //console.log(component.get('v.simpleRecord'));
        var simpleRecord = component.get('v.simpleRecord'),
            workspaceAPI = component.find("workspace"),
            accountSearch = component.get('v.accountSearch'),
            gamerDataFlag = component.get('v.gamerDataFlag'),
            openTabsInfo = [];
        if (!window.permsList) {
            window.location = '/lightning/n/Queue';
        }
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
        //Check for agent status
        if (!window.agentStatus || (window.agentStatus && window.agentStatus == 'Offline')) {
            helper.displayMsg('warning', 'Please changes the status to available in Omni Widget.');
        }
        if (simpleRecord && simpleRecord.id && accountSearch) {
            // Account Search by FB
            if (!simpleRecord.persona && simpleRecord.personas) {
                simpleRecord.persona = simpleRecord.personas[0].displayName;
            }
            if (!simpleRecord.personaId && simpleRecord.personas) {
                simpleRecord.personaId = simpleRecord.personas[0].personaId;
            }
			 for(var i in simpleRecord.personas){
                var actualDate,
                        checkT,
                        checkZ,
                        convertedDate; 
                    actualDate = simpleRecord.personas[i].dateCreated;
                    checkT = actualDate.split('T').pop().split(':').shift();
                    checkZ = actualDate.split(':').pop().split('Z').shift();
                    if(checkT.length<=1){
                        convertedDate = actualDate.replace('T','T0');
                    }
                    if(checkZ.length<=1){
                        if(convertedDate){
                            convertedDate = convertedDate.replace(checkZ+'Z','0'+checkZ+'Z');
                        }
                        else{
                            convertedDate = actualDate.replace(checkZ+'Z','0'+checkZ+'Z');
                        }
                    }
                    if(convertedDate){
                        simpleRecord.personas[i].dateCreated = $A.localizationService.formatDateTimeUTC(convertedDate)+" "+"UTC";
                    }
                    else{
                        simpleRecord.personas[i].dateCreated = $A.localizationService.formatDateTimeUTC(actualDate)+" "+"UTC";
                    }
                }									
            if (!simpleRecord.dateCreated && simpleRecord.personas) {
                simpleRecord.dateCreated = simpleRecord.personas[0].dateCreated;
            }
            // BESL search
            if (!simpleRecord.customerId && simpleRecord.id) {
                simpleRecord.customerId = simpleRecord.id;
            }
            
            workspaceAPI.getAllTabInfo().then(function(responseAll) {                
                var tabInfo = '';
                for (var i = 0; i<responseAll.length; i++) {
                    tabInfo = responseAll[i];
                    if (tabInfo && tabInfo.url.indexOf('OMNI') == -1) {
                        if (tabInfo.pageReference.attributes.attributes && tabInfo.pageReference.attributes.attributes.simpleCase) {
                            openTabsInfo.push({'tabId':tabInfo.tabId, 'tabNo':tabInfo.pageReference.attributes.attributes.simpleCase.CaseNumber});
                        }
                        else if(tabInfo.pageReference.attributes.attributes && tabInfo.pageReference.attributes.attributes.simpleRecord) {
                            openTabsInfo.push({'tabId':tabInfo.tabId, 'tabNo':tabInfo.pageReference.attributes.attributes.simpleRecord.id});
                        }                        
                    } 
                    if (tabInfo && tabInfo.tabId && tabInfo.customTitle == undefined && tabInfo.pageReference.attributes.name && tabInfo.pageReference.attributes.name == "c:Account") {
                        break;
                    }
                }
                window.localStorage.setItem('openTabsInfo', JSON.stringify(openTabsInfo));
                if (tabInfo && tabInfo.tabId && tabInfo.customTitle == undefined && tabInfo.pageReference.attributes.attributes.accountSearch) {
                    var accountLabel = "Account ";
                    if (gamerDataFlag) {
                        accountLabel += simpleRecord.id + ' ' + simpleRecord.idType; 
                    }
                    else {
                        accountLabel += tabInfo.pageReference.attributes.attributes.simpleRecord.persona; 
                    }
                    workspaceAPI.setTabLabel({
                        tabId: tabInfo.tabId,
                        label: accountLabel
                    });
                    //tab icon
                    workspaceAPI.setTabIcon({
                        tabId: tabInfo.tabId,
                        icon: "standard:person_account",
                        iconAlt: accountLabel
                    });
                    window.setTimeout(function() {
                        helper.focusTab(component, tabInfo.tabId);
                    },1500);
                }                    
            }).catch(function(error) {
                console.log(error);
            });
            
            simpleRecord.dob = helper.getAgeAt(simpleRecord.dob);
            simpleRecord.dateCreated = helper.getAgeAt(simpleRecord.dateCreated);
            
            window.setTimeout(function() {
                var playerAccDetail = component.find('playerAccDetail');
                playerAccDetail.getSanctionDate('playerAccount');
                component.set('v.targetAccountSFId', simpleRecord.strSFAccountId);
                if (playerAccDetail) {
                    if(simpleRecord.idType != undefined){
                         playerAccDetail.set("v.targetSynergyID",simpleRecord.id+';'+simpleRecord.idType);
                    }
					playerAccDetail.set("v.targetAccountID",simpleRecord.id);
                    playerAccDetail.find('accountNotes').getAccountNotes();
                    //playerAccDetail.set("v.targetAccountID",simpleRecord.strSFAccountId);
                  	// Strikes
                    if (playerAccDetail.find('accStatusCmp')) {
                        //playerAccDetail.find('accStatusCmp').set("v.recordId", simpleRecord.strSFAccountId);
                        var accStatus = playerAccDetail.find('accStatusCmp'); 
                        accStatus.set("v.targetAccountSFId",simpleRecord.strSFAccountId);
                        accStatus.getSrikesAcc();
                    }
                }
            }, 2000);
            //if (!window.productsToDisplay || accountSearch == true) {
                helper.getUserEntitlemnts(component);
            //}
        }        
    },
    tabSelected: function(component,event,helper) {		
        var tabValue = event.getParam('id'),
            caseHistory = component.find('caseHistory');
        if(tabValue == 'accCaseHistory' && caseHistory) {
            caseHistory.getAllCasesByAccIdSF();            
        } 
        if(tabValue == 'accDetail') {
            component.find('playerAccDetail').getAccountDetails('playerAccount');            
        } 
    },
})