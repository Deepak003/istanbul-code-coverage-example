({
    init: function(component, event, helper) {
		helper.omniLogout(component);
        if (window.performance.navigation.type) {
            $A.util.removeClass(component.find('disScreenSpinner'), 'slds-hide');
        }
        
        window.userType = 'T2';
        window.createCaseOption = '';
        component.set('v.userType', window.userType); 
        helper.getProducts(component);        
        //helper.getUserRoles(component, event);
        helper.setHistoryOverride();
        helper.hideTabsOmni(component);
        if (window.location.search && window.location.search.indexOf('id') >= 0) {
            var PTabType = event.getParam("type"),
                pprevCmp = component.find('ppreview');
            if (pprevCmp) { //&& pprevCmp.get('v.simpleCase') && pprevCmp.get('v.simpleCase').Id == undefined
                var casePetitionData = pprevCmp.petitionLoadMethod(window.location.search.substr(4))//pprevCmp.get('simpleCase')
                setTimeout(function() { 
                    component.set('v.simpleCase', window.caseObj);
                    delete window.caseObj;
                    component.set('v.recordId', window.location.search.substr(4));
                    helper.toggleDetailContainer(component, PTabType);
                }, 2000);
                
            }
            $A.util.addClass(component.find('disableScreen'), 'slds-hide');
            $A.util.addClass(component.find('disScreenSpinner'), 'slds-hide');            
        }
    },
    
    getPetitions: function(component, event, helper) {        
        component.set('v.columns', [
            {label: 'Subject', fieldName: 'Subject', type: 'text'},
            {label: 'Category', fieldName: 'Case_Category__r.Name', type: 'text'},
            {label: 'Target Persona ID', fieldName: 'Petition_Details__r.Target_Persona_Id__c', type: 'text'},
            {label: 'Location', fieldName: 'Petition_Details__r.Location__c', type: 'text'},
            {label: 'Product', fieldName: 'ProductLR__r.Name', type: 'text'},
            {label: 'Date & Time', fieldName: 'CreatedDate', type: 'text'}
        ]);            
        
        helper.getAgentWorks(component);
        return true;
    },
    
    popUpsClick: function(component, event, helper) {         
        component.set('v.isOpen', true);  
        component.set('v.isQueue', false);         
    },
    
    manageQueueClick: function(component, event, helper) {
        //helper.popUpUserRoleWindow(component, 'roleSelect');
        //TODO for New selection of Queues
        component.set('v.isOpen', true);
        component.set('v.isManageQueue', true);
        component.set('v.isQueue', true);
        /*if (component.get('v.queueSelectionPermission')) {
        	component.set('v.isManageQueue', true);
        }
        else {
        	component.set('v.isManageQueue', false);
        } */             
    },
            
    getCompletedCases: function(component, event, helper)
    {
        component.set('v.columns', [
            {label: 'Subject', fieldName: 'Subject', type: 'text'},
            {label: 'Category', fieldName: 'Case_Category__c', type: 'text'},
            {label: 'Target Persona ID', fieldName: 'PersonaIdOnCase__c', type: 'text'},
            {label: 'Location', fieldName: 'Petition_Details__r.Location__c', type: 'text'},
            {label: 'Product', fieldName: 'ProductLR__c', type: 'text'},
            {label: 'Date & Time', fieldName: 'CreatedDate', type: 'text'}
        ]);
        
        var fetchData = {
            advisorID: "000000000"
        };
        
        helper.fetchCompletedCases(component);		
        return true;    
    },
	getPetition : function(component, event, helper) {
		var action = component.get('c.GetPetitionDetails');
        action.setCallback(this,function(response){
            var data = response.getReturnValue();
            //alert(data);
        })
        $A.enqueueAction(action);
	},
    
    //Mass action THOR-486,92,483
    hidePetitionPreviewonMassAction: function(component, event, helper) {
        //show hide panes for pet preview and case mass action
        var evType = event.getParam('eventType');
        if(evType == "endMassAction" || evType == "cancelMassAction"){
            component.set('v.showCaseMassAction',false);
        	component.set('v.showPetitionPreview',true);  
            component.set('v.caseCount',0); //reset case count
        }else{
            var massIds = [];
            massIds = event.getParam('massIds');    
            component.set('v.caseCount',massIds.length);
            component.set('v.caseIds',massIds);
            if(massIds.length < 2){
                component.set('v.petitionMsg', false);
                component.set('v.showCaseMassAction',false);
                component.set('v.showPetitionPreview',true);
            }else{
                 component.set('v.showCaseMassAction',true);
                 component.set('v.showPetitionPreview',false);
            }
        }
    },
    
    viewPetitionDetails: function(component, event, helper) {
        console.log('view petition detail clicked');
        var PTabType = event.getParam("type");
		var sid = event.getParam("id");
        var domElmt = event.getParam("domEl");
        var caseData = event.getParam("objCase");
        var workId =  event.getParam("agentWorkId");							   
        helper.toggleDetailContainer(component, PTabType);
		// Added below code for THOR-1146
		var childComponent = component.find('pdCmp');
        if(childComponent){
             childComponent.accountSearch(sid,caseData,domElmt,PTabType,workId);
        }											 
        component.set('v.simpleCase', window.caseObj);
        if (window.tabViewFlag)
        	component.find('ppreview').set('v.tabViewFlag', window.tabViewFlag);
        return true;
    },
    // Commit Petition event
    commitPetionEvent: function(component, event, helper) {        
         // Get the ID of the record
        var recordId = event.getParam("pk"),
            getNextPetition = event.getParam("getNextPetition"),
            petitionData = component.get("v.data"),
            index = '',
            completedData = component.get("v.completedData"),
            queueListDom = document.getElementsByClassName('cQueuedList');
        // Checks for List Record ID 
        if (recordId && recordId.length && petitionData) {
        	var rData = '',
        		i = 0;
        	for (i in recordId) {
        		rData = petitionData.find(function(pData, pindex) {
		             if (pData.Id == recordId[i]) {
		                 index = pindex;
		                 return pData;
		             }
		        });
		        // Add the row in the Completed Tab
		        if (completedData == undefined) {
		        	completedData = [];
		    	}
		        completedData.push(rData);
		        /* added below code for THOR-901*/ 
		        component.set("v.completedCount",completedData.length);
                /**/
		        if (index > -1) {
		            petitionData.splice(index, 1);
		        }
        	}        	
        }
        
        // Get all the record Id for the filtered data from DOM
        var queueListDomElmts = queueListDom[0].querySelectorAll('table.cDataGridTable tbody tr'),
            domRecordsList = [];
        if (!window.recordsWorked) {
            window.recordsWorked = domRecordsList;
        }
        if (queueListDomElmts && queueListDomElmts.length) {
            var i = 0;
            for (var item of queueListDomElmts) {
                if (!item.classList.contains('slds-is-selected')) {
                    if (i==0) {
                        item.classList.add("slds-is-selected");
                        i++;
                    }
                    domRecordsList.push(item.getAttribute('data-pk'));
                }
                if (item.classList.contains('slds-is-selected')) {
                    item.classList.add("slds-hide");
                    window.recordsWorked.push(item.getAttribute('data-pk'));
                }
            }            
        }
        window.domRecordsList = domRecordsList;
		// Added below condition for THOR-931
        								 
        //component.set("v.filterQueData",domRecordsList);
        component.set("v.data",petitionData);
        if(petitionData && petitionData != null){
            var CatProdPersona = helper.extractCatProdPersona(petitionData);
            CatProdPersona.personas.sort(helper.sortByField('value', 'asc'));
            component.set('v.filterData', CatProdPersona);	
            component.set("v.queueCount",petitionData.length);
        } 
        // Check and get Next cases.
        if (petitionData && !petitionData.length) {
        	helper.getAgentWorks(component);
        }
        // Get the next Petition 
        // Application Event Fire
        recordId = 0;
        if (petitionData && petitionData.length) {
            recordId = petitionData[0].Id; 
        }        
        var appEvent = $A.get("e.c:GetNextRowClickApp");
        if (appEvent != undefined) {
            if(recordId != 0){
                appEvent.setParams({
                    pk : recordId,
                    gNxtFlag: getNextPetition
                });
            }
            else{
                appEvent.setParams({
                    pk : recordId
                });
            }            
            appEvent.fire();
            component.set("v.recordId",recordId);
        }        
        
    },
    
    completedDataChanges: function(component, event, helper) {
        var filterCateg = component.find('filterCmp').find('filterCateg').get('v.value'),
            filterProd = component.find('filterCmp').find('filterProd').get('v.value'),
        	filterPersona = component.find('filterCmp').find('filterPersona').get('v.value');
        //console.log(filterCateg);
        if (filterCateg || filterProd || filterPersona) {
            var appEvent = $A.get("e.c:FilterQueueEvt");
            if (appEvent != undefined) {
                appEvent.setParams({
                    category: filterCateg,
                    product: filterProd,
                    persona: filterPersona,
                    type: 'petitionCompleted'
                });
                setTimeout( function() {
                    appEvent.fire();
                }, 500);                
            }
        }
    },
    selectedRole: function(component, event, helper) {    	
        $A.util.removeClass(component.find('advRole'), 'slds-hide');        
        //TODO 
        $A.util.removeClass(component.find('manageQueue'), 'manage-queue-disable');
    },
    queueListChanged: function(component, event, helper) {
    	// TODO for Queue selection
    	console.log('Queue Changes');
    	if (component.get('v.queueNames')) {
    		component.set('v.queueSelectionPermission', true);
            if(component.get('v.queueNames').includes("T1")){
                window.roleOfAdv = "T1";
            }
            else{
                window.roleOfAdv = "T2"
            }
    	}
    	$A.util.removeClass(component.find('manageQueue'), 'manage-queue-disable');
    	if (component.get('v.nMoreLabel')) {        	
            $A.util.removeClass(component.find('moreLabel'),'slds-hide');
        }
        else {
        	$A.util.addClass(component.find('moreLabel'),'slds-hide');
        }
        
    	//helper.addAndRemoveUsersFromQueue(component);
    },
    roleQueueAppEvtSubs: function(component, event, helper) {        
        var param = event.getParam('roleQueue'),
            userRolesList = component.get('v.userRoles'),            
            queueOptions = [];
        //alert('roleQueueAppEvtSubs');
        //on role select, set jobroleId and omni & queue selection permissions
        /*if(param == 'roleSelect') {
            var roleQueueObj = event.getParam('roleQueueObj');
             //helper.getUserPermissions(component, jobroleId, 'Queue Selection');
       // helper.getUserPermissions(component,jobroleId, 'Omni Routing');    
            alert('id' +roleQueueObj.role);
        }*/
        if (param == 'queueSelect') {
            var roleQueueObj = event.getParam('roleQueueObj'),
                queueItems = [];
            if (roleQueueObj.role) {
                component.set('v.advisorRoleSelect', roleQueueObj.role);
                //alert('id' +roleQueueObj.role);
                if (roleQueueObj.role.indexOf('1') >= 0) {
                    window.userType = 'T1';
                }
                if (roleQueueObj.role.indexOf('2') >= 0) {
                    window.userType = 'T2';
                }
                if (roleQueueObj.role.indexOf('3') >= 0) {
                    window.userType = 'T3';
                }
                //Setting the USer type to T1|T2|T3 based on the role 
                component.set('v.userType', window.userType);                
                if (roleQueueObj.qLabel) {
                    if (roleQueueObj.nMoreLabel) {
                        component.set('v.nMoreLabel', roleQueueObj.nMoreLabel);
                        $A.util.removeClass(component.find('moreLabel'),'slds-hide');
                    }
                    else {
                        component.set('v.nMoreLabel', '');
                        $A.util.addClass(component.find('moreLabel'),'slds-hide');
                    }
                    component.set('v.queueNames', roleQueueObj.qLabel);
                }
                if (roleQueueObj.selectedQueue =='') {
                    roleQueueObj.selectedQueue = 'Tier1 Queue';
                }
                if (roleQueueObj.selectedQueue && roleQueueObj.selectedQueue !='') {
                    component.set('v.selectedQueueList', roleQueueObj.selectedQueue);
                }                
                $A.util.removeClass(component.find('manageQueue'), 'manage-queue-disable');                
                $A.util.removeClass(component.find('advRole'), 'slds-hide');
            }
        }
    },
    onWorkAccepted: function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            component.set('v.tabId', focusedTabId);
            workspaceAPI.focusTab({tabId : focusedTabId});
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    onTabCreated: function(component, event, helper) {
        var workspaceAPI = component.find('workspace');
        var tabId = component.get('v.tabId');
        //workspaceAPI.focusTab({tabId: tabId});
    },
    ontabClosed: function(component, event, helper) {
        var workspaceAPI = component.find('workspace');
        //Remove the Tabds from Cache for Closed one
        var closetabId = event.getParam('tabId'),        
        	tabInPlayer = JSON.parse(window.localStorage.getItem('openTabsInfo')),
        	openTabsInfo = [];
        
        for(var tab of tabInPlayer) {
            if(tab.tabId != event.getParam('tabId')) {
                 openTabsInfo.push(tab);
            }
        }
        window.localStorage.setItem('openTabsInfo', JSON.stringify(openTabsInfo));
        // END
        workspaceAPI.getAllTabInfo().then(function(responseAll) {                
            var tabInfo = '';
            var item = '';
            for(item of responseAll) {
                if (item.pageReference.type == 'standard__navItemPage') {
                    tabInfo = item;
                }
            }if (tabInfo) {
                workspaceAPI.focusTab({tabId: tabInfo.tabId});
            }
            // This is for to close the tabs when clicks on rows in Queue
            
        }).catch(function(error) {
            console.log(error);
        });
    },
    onTabFocused : function(component, event, helper) {
        //console.log("Tab Focused");
        var focusedTabId = event.getParam('currentTabId');
        var workspaceAPI = component.find("workspace");        
        
        workspaceAPI.getTabInfo({
            tabId : focusedTabId
        }).then(function(response) {
            if (response && response.tabId && response.customTitle != undefined && response.pageReference.attributes.name 
                && response.pageReference.attributes.name == "c:PetitionDetail") {
                workspaceAPI.refreshTab({
                    tabId: focusedTabId,
                    includeAllSubtabs: false
                });
            }
        });
    },
    showSpinner: function(component, event, helper) {
        var spinner = component.find("disScreenSpinner");
        $A.util.toggleClass(spinner, "slds-show");
    },
    hideSpinner: function(component, event, helper) {
        var spinner = component.find("disScreenSpinner");
        $A.util.toggleClass(spinner, "slds-hide");
    },
    moreLabelClick: function(component, event, helper) {
        var queueTitle = component.find("queueTitle");
        if ($A.util.hasClass(queueTitle, "slds-truncate")) {
            $A.util.removeClass(queueTitle, "slds-truncate");
            event.target.innerHTML = "View less";
        }
        else {
            $A.util.addClass(queueTitle, "slds-truncate");
            event.target.innerHTML = "+ " + component.get('v.nMoreLabel') + " More";
        }
    },
    
    //fires on omni status changed
    onStatusChanged : function(component, event, helper) {
        component.set('v.casecount',0);
        var isResetOmni =component.get("v.isResetOmni");       
        var statusId = event.getParam('statusId');   
        component.set('v.currentOmniStatus', statusId);
        //get the cases, when omni status is set to available
        if(statusId == component.get("v.presenceStatusId")){
            if(component.get("v.queueCount") == 0){                
                component.set("v.getCases", true);
            }
        }
    },
    //fires on omni logout/offline
    onLogout : function(component, event, helper) {
        component.set('v.currentOmniStatus', null);
        //clear cases in queue on logout and unload petition preview cmp
        var isReset = component.get("v.isResetOmni");
        if(!isReset)
        {
            component.set('v.data', null);               
            component.set('v.queueCount', 0);
            component.set('v.isResetOmni', false); 
            //ack
        }
    },
     onWorkloadChanged : function(component, event, helper) {
         var newWorkload = event.getParam('newWorkload'),
             queueCount = component.get('v.queueCount'),
             getCases = component.get("v.getCases"),      
             timeOut = component.get('v.timeout');  
         if(newWorkload == 3) {
             // If case detail page is being displayed, then hide it
             var detailCasePage = component.find('detailContainer'),
                 layoutContainer = component.find('mainLayoutContainer');
             if (!$A.util.hasClass(detailCasePage, 'slds-hide')) {
                 $A.util.addClass(detailCasePage, 'slds-hide');
             }
             $A.util.removeClass(layoutContainer, 'slds-hide');
             helper.getAgentWorks(component);
         }
         if (newWorkload == 0) {
             component.set('v.ackMsg', true);
             component.set('v.petitionMsg', false);
             component.set('v.showCaseMassAction', false);
             component.set('v.showPetitionPreview', true);
             //Remove the Spinner for THOR-1122
             //$A.util.removeClass(component.find('disScreenSpinner'), 'slds-hide');     
         }
         window.clearTimeout(timeOut);
         timeOut = window.setTimeout(
             $A.getCallback(function() {                 
                 if(newWorkload != 0 && (getCases == true || queueCount <= 1) && component.get('v.advisorRoleSelect') !=""){                     
                     helper.getAgentWorks(component);
                     component.set('v.getCases', false);
                 }
                 
             }), 5000);
         component.set('v.timeout', timeOut);
         if (component.get('v.advisorRoleSelect') =="") {
             helper.omniLogout(component); 
         }      
    }, 
    checkQueueCount: function(component, event, helper) {
        var queueCount = component.get('v.queueCount');
        /*if (queueCount == 0) this.onStatusChange(component, event, helper);*/ //its throwing error while logging out omni
    },
    thorPermissionEventHandler: function(component, event, helper) {        
        var currentOmniStatus = component.get('v.currentOmniStatus'),
            isChangeRole = component.get('v.isChangeRole');
        if(currentOmniStatus != undefined || isChangeRole){
            var promise1 = helper.omniLogout(component);
            promise1.then(function(){
                component.set('v.data', null);               
                component.set('v.queueCount', 0);
                helper.getJobRolePermissions(component);
            });
        }
        else{
           helper.getJobRolePermissions(component); 
        } 
    },
    
    tabViewClickEventHandler: function(component, event, helper) {
        if(component.get('v.caseCount') && component.get('v.caseCount') >= 2){
            var tabFlag = event.getParam('tabFlag');
            if(tabFlag == "Completed"){
                component.set('v.showCaseMassAction',false);
                component.set('v.showPetitionPreview',true); 
            }
            else{
                component.set('v.showCaseMassAction',true);
                component.set('v.showPetitionPreview',false); 
            }
        }
    }
})