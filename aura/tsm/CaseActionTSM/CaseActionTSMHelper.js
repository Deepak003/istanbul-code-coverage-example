({
    /**
     * make api call and populate case statuses
     * @param {Object} component 
     */
    populateCaseStatus : function(component) {
        var action = component.get("c.fetchCaseStatuses");
        component.set("v.isLoading", true);
        var self = this;
		action.setParams({});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                self.createCaseStatusPicklist(component, response.getReturnValue());
            } else {
  				var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({                   
                    "message": "Error occured",
                    "type": "error"
                });
                toastEvent.fire();
            }
            component.set("v.isLoading", false);
        });
        $A.enqueueAction(action);
    },
    /**
     * populate case  status pick list
     * @param {Object} component 
     * @param {Object} availableStatuses 
     */
    createCaseStatusPicklist: function (component, availableStatuses) {
        var caseStatusArray=[]
        var caseObj = component.get("v.caseObj");
        for(var eachKey in availableStatuses){
            var statusMap={};
            statusMap["value"] = availableStatuses[eachKey];
            statusMap["label"] = availableStatuses[eachKey];
            //for Phone cases, not adding chat Transfer option
            if(caseObj != null && caseObj.currentChannel == 'Phone' && (availableStatuses[eachKey] =='Chat Transfer')){                
                continue;
            }
            //for Chat cases, not adding Phone Transfer Option
            else if(caseObj != null && caseObj.currentChannel == 'Chat' && (availableStatuses[eachKey] =='Phone Transfer')){                
               continue;
            }
            //for email cases, not adding phone & chat Transfer Options
            else if(caseObj != null && caseObj.currentChannel == 'Email' && ((availableStatuses[eachKey] =='Phone Transfer') || (availableStatuses[eachKey] =='Chat Transfer'))){                
                continue;
            }
            else{
                caseStatusArray.push(statusMap);
            }
        }
        component.set("v.caseStatusValues", caseStatusArray);
    },
    /**
     * make api call and populate case  queues
     * @param {Object} component 
     */
    populateCaseQueues : function(component) {
        var caseStatus = component.get("v.selectedCaseStatus");
        var caseObj = component.get("v.caseObj");
        if(caseStatus.includes('Transfer')){
            caseStatus = 'Transfer';
        }
        
        if(caseObj != null && caseObj.Current_Channel__c == 'Phone' && caseStatus == 'Transfer'){
            component.set("v.showQueue", false);
            component.set("v.saveDisabled", false);
        }
        else{
            var action = component.get("c.getEscalatedTransferredQueues");       
            var caseId = component.get("v.caseId");
            component.set("v.isLoading", true);
            var self = this;
            action.setParams({
                caseStatus: caseStatus,
                caseId: caseId
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === 'SUCCESS') {
                    self.createQueuePicklist(component, response.getReturnValue());
                    component.set("v.showResolution", false);
                    component.set("v.showQueue", true);
                } else {
                    var errorMessage = response.getError();
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({                   
                        "message": errorMessage[0].message, 
                        "type": "error"
                    });
                    toastEvent.fire();
                }
                component.set("v.isLoading", false);
            });
            $A.enqueueAction(action);
        }
        
    },
    /**
     * populate case  queue pick list
     * @param {Object} component 
     * @param {Object} availableQueue 
     */
    createQueuePicklist: function (component, availableQueue) {
        var caseQueueArray=[]
        for(var eachKey in availableQueue){
            var caseQueueMap={};
            caseQueueMap["value"] = availableQueue[eachKey].id;
            caseQueueMap["label"] = availableQueue[eachKey].name;
            caseQueueArray.push(caseQueueMap);
        }
        component.set("v.caseQueueValues", caseQueueArray);
    },
    /**
     * make api call and populate case  resolutions
     * @param {Object} component 
     */
   populateCaseResolutions : function(component) {
        var action = component.get("c.fetchResolutionStatuses");
        component.set("v.isLoading", true);
        var self = this;
		action.setParams({strLabelName: component.get('v.selectedCaseStatus')});
        action.setCallback(this, function (response) {
            var state = response.getState(),
			resolutionResponse = response.getReturnValue();
            if (state === 'SUCCESS') {
                self.createResolutionPicklist(component, resolutionResponse);
				if (resolutionResponse && resolutionResponse.length) {
                    component.set("v.showResolution", true);
                }   
            } else {
  				var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({                   
                    "message": "Error occured",
                    "type": "error"
                });
                toastEvent.fire();
            }
            component.set("v.isLoading", false);
        });
        $A.enqueueAction(action);
    },
    /**
     * populate case  resolution pick list
     * @param {Object} component 
     * @param {Object} availableResolution 
     */
    createResolutionPicklist: function (component, availableResolution) {
        var caseResolutionArray=[]
        for(var eachKey in availableResolution){
            var caseResolutionMap={};
            caseResolutionMap["value"] = availableResolution[eachKey];
            caseResolutionMap["label"] = availableResolution[eachKey];
            caseResolutionArray.push(caseResolutionMap);
        }
        component.set("v.caseResolutionValues", caseResolutionArray);
    },
    /**
     * populate email locales , api call
     * @param {Object} component 
     */
    populateEmailLocales : function(component) {
        var caseAction = component.get("c.searchCaseDetailsByCaseId");  
		var caseId = component.get("v.recordId");
        var storeResponse;
        caseAction.setParams({
                    caseID : caseId
               });
        caseAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                storeResponse = response.getReturnValue();          
                component.set("v.caseObj",storeResponse); // TSM 1912
            }
        });
        
        var action = component.get("c.getLocales");
        component.set("v.isLoading", true);
        var self = this;
		action.setParams({});
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                self.createLocalePicklist(component, storeResponse,response.getReturnValue());
            } else {
  				var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({                   
                    "message": "Error occured",
                    "type": "error"
                });
                toastEvent.fire();
            }
            component.set("v.isLoading", false);
        });
       
        $A.enqueueAction(caseAction);
        $A.enqueueAction(action);
    },
    /**
     * generate picklist for locales
     * @param {Object} component 
     * @param {Object} availableLocales 
     */
    createLocalePicklist: function (component, caseObj, availableLocales) {
        var localeMap =   new Map();
		var caseLocaleArray=[]
        for(var eachKey in availableLocales){
            var caseLocaleMap={}; 
            caseLocaleMap["value"] = availableLocales[eachKey].id;
            caseLocaleMap["label"] = availableLocales[eachKey].value;
			localeMap.set(availableLocales[eachKey].Name,availableLocales[eachKey].id);
            caseLocaleArray.push(caseLocaleMap);
        }
        if(caseObj != null){
            if(caseObj.LocaleLR__c != null){
                component.set("v.outboundLocale",caseObj.LocaleLR__c);
            }else if(localeMap.has(caseObj.Locale__c) ){
                 component.set("v.outboundLocale",localeMap.get(caseObj.Locale__c));
            }
        }
        component.set("v.emailLocales", caseLocaleArray);
    },
    /**
     * validate all required data so that save button can be enabled
     * @param {Object} component 
     * @param {Object} event 
     */
    validateData: function (component, event) {
        var note = component.get("v.note"); 
        var outboundLocale = component.get("v.outboundLocale");
        var selectedCaseStatus = component.get("v.selectedCaseStatus");
        var selectedCaseQueue = component.get("v.selectedCaseQueue");
        var selectedCaseResolution = component.get("v.selectedCaseResolution");
        var originalCaseNumber = component.get("v.originalCaseNumber");
        var caseObj = component.get("v.caseObj");
        
        if (selectedCaseStatus == 'Resolved') {
            component.set("v.saveDisabled", (this.isEmpty(note) || this.isEmpty(outboundLocale) || this.isEmpty(selectedCaseResolution)));
        }else if((selectedCaseStatus == 'Phone Transfer'  || selectedCaseStatus == 'Chat Transfer') && caseObj != null && (caseObj.Current_Channel__c == 'Phone' || caseObj.Current_Channel__c == 'Chat')) {
            component.set("v.saveDisabled", (this.isEmpty(note) || this.isEmpty(outboundLocale)));
        } else if(selectedCaseStatus == 'Escalate' || selectedCaseStatus == 'Email Transfer (Offline)') {
            component.set("v.saveDisabled", (this.isEmpty(note) || this.isEmpty(outboundLocale) || this.isEmpty(selectedCaseQueue)));
        } else if(selectedCaseStatus == 'Duplicate Case' && (originalCaseNumber != undefined && !isNaN(parseInt(originalCaseNumber)))){            
            component.set("v.saveDisabled", false);
		} else if (selectedCaseStatus == 'Waiting on Player') {
            component.set("v.saveDisabled", (this.isEmpty(note) || this.isEmpty(outboundLocale) || this.isEmpty(selectedCaseResolution)));
        } else if (selectedCaseStatus == 'Player Unavailable') {
            component.set("v.saveDisabled", (this.isEmpty(note) || this.isEmpty(outboundLocale)));
        } else {
            component.set("v.saveDisabled", true);
        }
		//  TSM-2983 Marking sections in Case detail as Unavailable for 'Player Unavailable'
        if(selectedCaseStatus == 'Player Unavailable' || selectedCaseStatus== 'Duplicate Case') {
            var emailLocales = component.get("v.emailLocales");
             if(note == undefined){
                if(selectedCaseStatus== 'Duplicate Case'){
                    note = "Duplicate Case";
                    component.set("v.note", note);
                }
                if(selectedCaseStatus == 'Player Unavailable'){
                    note = "Advisor override - player not available";
                    component.set("v.note", note);
                }                
            }               
            for(var i=0; i< emailLocales.length; i++){
                if(emailLocales[i].label == "English-US"){
                    component.set("v.outboundLocale",emailLocales[i].value);
                    break;
                }
            }
            if(selectedCaseStatus == 'Player Unavailable'){
                component.set("v.saveDisabled" , false);
            }
            var appEvent = $A.get("e.c:CaseDetailStatusChange");
            appEvent.fire();
        }
    },
    /**
     * validate if variable is empty, null or undefined
     * @param {*} data 
     */
    isEmpty: function (data) {
        return  (typeof data != 'undefined' && data) ? false : true;
    },
    /**
     * save case method, accepts callback that runs after success
     * @param {Object} component 
     * @param {Object} event 
     * @param {function} callback 
     */
    saveCase: function (component, event, callback) {
        var outboundEmailVO = component.get("v.outboundEmailVO");
		var caseObj = component.get("v.caseObj");
        var self = this;
        var updatedData = component.get("v.caseData");
        var caseData = updatedData || {};
        var caseId = component.get("v.caseId");
        var customerId = component.get("v.nucleusId");
		var originalCaseNumber = component.get("v.originalCaseNumber");
        var caseStatus = component.get("v.selectedCaseStatus");
        var dataMap = {};
        if(caseStatus.includes('Transfer')){
            dataMap.action = 'Transfer';
            if(caseStatus.includes('Email Transfer')){
                dataMap.currentChannel = 'Email';
            }
        }else{
            dataMap.action = component.get("v.selectedCaseStatus");
        }
        dataMap.caseId = caseId;
		dataMap.customerId = customerId;
        dataMap.caseNotes = component.get("v.note");
        dataMap.localeId = component.get("v.outboundLocale");
        dataMap.email = component.get("v.emailText").replace(/(?:\r\n|\r|\n)/g, '<br />');
        dataMap.resolution = component.get("v.selectedCaseResolution");
        dataMap.queueId = component.get("v.selectedCaseQueue");
        dataMap.customMessage = component.get("v.emailText").replace(/(?:\r\n|\r|\n)/g, '<br />');
		//dataMap.kbArticleMessage = component.get("v.articleLinkText");
		// TSM 4294
		dataMap.kbArticleMessage = component.get("v.knowledgeArticlesId").join();
        dataMap.responseURL = (outboundEmailVO != null) ? outboundEmailVO.responseURL : '';
        dataMap.outboundmailId = (outboundEmailVO != null) ? outboundEmailVO.id : '';
        dataMap.subject = caseData.hasOwnProperty('subject') ? caseData.subject : '';
        dataMap.product = caseData.hasOwnProperty('productId') ? caseData.productId : '';
        dataMap.platform = caseData.hasOwnProperty('platformId') ? caseData.platformId : '';
        dataMap.category = caseData.hasOwnProperty('categoryId') ? caseData.categoryId : '';
        dataMap['sub-category'] = caseData.hasOwnProperty('issueId') ? caseData.issueId : '';
        dataMap.caseStatus = caseStatus;
        
        if(component.get("v.selectedCaseStatus")== "Duplicate Case" && originalCaseNumber != null ){
            dataMap.originalCaseNo = component.get("v.originalCaseNumber");
        }

		dataMap = this.dataCleanUp(dataMap);
        var action = component.get("c.saveCaseActions");
        component.set("v.isLoading", true);
        var self = this;
		action.setParams({
            mapCaseParams: dataMap
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
				
				var phoneLabel = $A.get("$Label.c.Phone_Survey_Statuses"),
                    phoneStatuses = phoneLabel.split(',');
                var emailLabel = $A.get("$Label.c.Email_Survey_Statuses"),
                    emailStatuses = emailLabel.split(',');
                var status = component.get("v.selectedCaseStatus");
                if((caseObj.Current_Channel__c=="Email"&&emailStatuses.includes(status))||(caseObj.Current_Channel__c=='Phone'&&phoneStatuses.includes(status)))
               
				// if((caseObj.Current_Channel__c=="Email"&&component.get("v.selectedCaseStatus")=='Resolved')||(caseObj.Current_Channel__c=='Phone'&&(component.get("v.selectedCaseStatus")=='Resolved'||component.get("v.selectedCaseStatus")=='Waiting on customer')))
                

                this.surveyHelper(component,event)
                callback();
            } else {
                var errorMessage = response.getError();
  				var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({                   
                    "message": errorMessage[0].message,
                    "type": "error"
                });
                toastEvent.fire();
            }
            component.set("v.isLoading", false);
        });
        $A.enqueueAction(action);
        
    },
	surveyHelper : function(component,event){
        var S_action = component.get("c.sendSurveyDetails");
        var caseIdVal = component.get("v.caseId");
                S_action.setParams({
                    caseId : caseIdVal
                });
        S_action.setCallback(this,function(response){
            if(response.getState()==='SUCCESS'){
                
            }
        });
        $A.enqueueAction(S_action);
    },
    /**
     * cleans up keys with empty values from object
     * @param {Object} dataMap 
     */
    dataCleanUp: function (dataMap) {
        var fields = Object.getOwnPropertyNames(dataMap);
        for (var i = 0; i < fields.length; i++) {
            var dataFieldName = fields[i];
            if (this.isEmpty(dataMap[dataFieldName])) {
              delete dataMap[dataFieldName];
            }
		}
        return dataMap;
    },
    /**
     * takes save action based on action type
     * @param {Object} component 
     * @param {Object} event 
     * @param {String} actionType 
     */
    handleSaveCase: function (component, event, actionType) {
        var outboundEmailVO = component.get("v.outboundEmailVO");
        console.log('from save' + outboundEmailVO);
        var self = this;
        var caseData = event.getParam("caseData"); 
        switch(actionType) {
            case 'saveAndGetNext':
                self.saveCase(component, event, function(){self.handleSaveAndGetNext(component, event);});
                break;
            case 'saveAndCreateNew':
                self.saveCase(component, event, function(){self.handleSaveAndCreateNew(component, event);});
                break;
            case 'saveAndOpenOriginal':
                self.saveCase(component, event, function(){self.openOriginalCase(component, event);});
                break
        }
    },
    /**
     * callback for save and get next
     * @param {Object} component 
     * @param {Object} event 
     */
    handleSaveAndGetNext: function (component, event) {
        //this.closeWorkItem(component);
        var caseObj = component.get("v.caseObj");
        if(caseObj != null && caseObj.Current_Channel__c == 'Phone'){
            this.getLatestOnlineUserPresenceStatusId(component);
        }
        else{
            this.closeWorkTab(component);
        }
    },
    /**
     * callback for save and create new
     * @param {Object} component 
     * @param {Object} event 
     */
    handleSaveAndCreateNew: function (component, event) {
        //this.closeWorkItem(component);
        var accountId = component.get("v.accountId");
        var accountTabUrl = '/lightning/r/Account/'+accountId+'/view';
        var workspaceAPI = component.find("workspace");
		workspaceAPI.openTab({
            url: accountTabUrl,
            focus: true
        }).then(function(tabId) {
            console.log('success');
        })
        .catch(function(error) {
            console.log(error);
        });
        this.closeWorkTab(component);
    },
    /**
     * show status selection modal and initiate save after selection
     * @param {Object} component 
     * @param {Object} event 
     */
    handleSaveAndGoIdle: function (component, event) {
        component.set('v.showSelectStateModal', true);
    },
    /**
     * handle save event from status selection modal
     * @param {Object} component 
     * @param {Object} event 
     */
    handleSaveGoIdleEvent: function (component, event) {
        var omniToolkitAPI = component.find("omniToolkit");
        var selectedStatus = event.getParam("selectedStatus");
		var self = this;
        
        var currentStatusId = component.get("v.currentStatusId");
        if(currentStatusId == selectedStatus){
             self.saveCase(component, event, function(){self.closeWorkTab(component)});
        }else{
            omniToolkitAPI.setServicePresenceStatus({"statusId":selectedStatus})
            .then($A.getCallback(function(result) {
                if (result) {
                    console.log("Presence status changed");
                    self.saveCase(component, event, function(){self.closeWorkTab(component)});
                } else {               
                    console.log("Presence status change failed");
                }
            })).catch(function(error) {
                console.log(error);
            });
        }
               
        
        /*"{"statusId":"0N51b0000000085","statusName":"Available - Chat","statusApiName":"Available_Chat"}"
        {"statusId":"0N544000000001Z","statusName":"Busy","statusApiName":"Busy"}
        */

    },
    /**
     * method to close active work item
     * @param {Object} component  
     */
    closeWorkItem: function (component) {
        var omniToolkitAPI = component.find("omniToolkit");
        var caseType = component.get("v.caseType");
        var recordId = component.get("v.recordId"); // get the record Id 
        var recordId = recordId.substring(0, 15); 
        var self = this;
        omniToolkitAPI.getAgentWorks()
        .then(function(result) {
            var works = JSON.parse(result.works);
            for(var eachKey in works){
                if (works[eachKey].workItemId == recordId && works[eachKey].isEngaged) {
                    switch(caseType) {
                      case 'chat':
                        // code block
                        //self.endAgentChat(component, function(){self.closeAgentWork(component, works[eachKey]);});
                        //once we call closeAgentWork after that tab and chat is not closing/ending
                         self.closeAgentWork(component, works[eachKey]);
                        break;
                      default:
                        self.closeAgentWork(component, works[eachKey]);
                    }
                }
            }
        }).catch(function(error) {
            console.log(error);
        });
    },
    /**
     * method to close active chat
     * @param {Object} component  
     */
    endAgentChat: function (component, callback) {
        //giving type error while calling endchat
        var conversationKit = component.find("conversationKit");
        var self = this;
        var recordId = component.get("v.recordId");
        var recordId = recordId.substring(0, 15); 
        conversationKit.endChat({recordId: recordId})
        .then(function() {  
        	console.log('success'); 
            callback();
        }) 
        .catch(function(error) { 
        	console.log(error); 
        }); 
    },
    /**
     * method to close agent work
     * @param {Object} component  
     */
    closeAgentWork: function (component, work) {
        var self = this;
        var omniToolkitAPI = component.find("omniToolkit");
        omniToolkitAPI.closeAgentWork({workId: work.workId})
        .then(function(result) {
            if (result) {
                console.log("Closed work successfully");
                self.closeWorkTab(component);
            } else {
                console.log("Close work failed");
            }
        }).catch(function(error) {
            console.log(error);
        });
    },
    /**
     * method to close tab after work
     * @param {Object} component  
     */
    closeWorkTab: function (component) {
        var workspaceAPI = component.find("workspace");
		workspaceAPI.getEnclosingTabId().then(function(tabId) {
        workspaceAPI.closeTab({
             tabId: tabId
          });
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    // Added as part of crm phone layout TSM-2220
    getCaseDetails : function(component) {
        const action = component.get("c.getCase");
        action.setParams({
            caseId: component.get("v.caseId")
        });     
        action.setCallback(this, function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                var caseObj = response.getReturnValue();
                component.set("v.caseObj",caseObj);
            }
        });
           
        $A.enqueueAction(action);            
    },
	
	getKBArticleMessage : function(component) {
        var knowledgeArticles = JSON.parse(JSON.stringify(component.get("v.knowledgeArticles")));
        var kbArticleMessage = ' ';
		
        if(knowledgeArticles.length > 0){  
            knowledgeArticles.forEach(function(knowledgeArticle){ 
                kbArticleMessage = kbArticleMessage+$A.get("$Label.c.EA_HELP_BANNER_LINK")+knowledgeArticle+'<br/>';
            }); 
        }
        
        component.set("v.articleLinkText",kbArticleMessage);
    },

    handleDuplicateCase : function(component){
        var originalCaseNumber = parseInt(component.get('v.originalCaseNumber'));
        if(originalCaseNumber != "" && !isNaN(originalCaseNumber)){
            component.set("v.saveAndOriginalDisabled" , false);
            component.set("v.saveDisabled" , false);
        }
        else{
            component.set("v.saveAndOriginalDisabled" , true);
            component.set("v.saveDisabled" , true);            
        }        
    },
    
    checkCaseValidityAndsave: function(component, event, actionType){
        var self = this;
        var caseStatus = component.get("v.selectedCaseStatus");
        var originalCaseNumber = component.get('v.originalCaseNumber');
        if(caseStatus == "Duplicate Case" && originalCaseNumber != null){
             var action = component.get("c.getStandardCaseByCaseNumber");
            action.setParams({ "strCaseNumber" : component.get('v.originalCaseNumber') });
            action.setCallback(this, function(response) {
                var state = response.getState(),
                    result = response.getReturnValue();                
                console.log(result);
                var toastEvent = $A.get("e.force:showToast");
                if (state === "SUCCESS") {
                    if(result != null){
                        component.set('v.originalCaseId', result.Id);
                        if(actionType != null){
                            self.handleSaveCase(component, event, actionType);
                        }else{
                            self.handleSaveAndGoIdle(component, event);
                        }
                    }
                    else{
                        toastEvent.setParams({
                            "message": "Case could not be found",
                            "type" : "error"
                        }); 
                    }
                }
                else if(state === "ERROR"){
                    var errorMessage = response.getError();
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({                   
                        "message": errorMessage[0].message,
                        "type": "error"
                    });             
                }
                toastEvent.fire();  
            });
            $A.enqueueAction(action);
        }
        else{
            if(actionType != null){
                self.handleSaveCase(component, event, actionType);
            }else{
                 self.handleSaveAndGoIdle(component, event);
            }
        }                        
    },
    
    openOriginalCase : function(component, event){
        var toastEvent = $A.get("e.force:showToast");
        var caseId = component.get('v.originalCaseId');
        var caseTabUrl = '/lightning/r/Case/'+caseId+'/view';
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            url: caseTabUrl,
            focus: true
        }).then(function(tabId) {
            console.log('success');
        })
        .catch(function(error) {
            console.log(error);
        });
        toastEvent.setParams({                   
            "message": "Case successfully saved",
            "type": "success"
        }); 
        toastEvent.fire();
        this.closeWorkTab(component);
    },

    getLatestOnlineUserPresenceStatusId : function(component){        
        var action = component.get("c.getLatestOnlineUserPresenceStatusId");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var result = response.getReturnValue();
                    if(result != null){
                        this.setOmniChannelPresenceStatus(component, result.substring(0,15));
                    }                    
                }
                else{
                    console.log(state);
                    this.closeWorkTab(component);
                }
            });
            $A.enqueueAction(action);
    },
    
    setOmniChannelPresenceStatus : function(component, statusId){        
        var omniToolkitAPI = component.find("omniToolkit");
        var self = this;
        
        omniToolkitAPI.setServicePresenceStatus({"statusId":statusId})
        .then($A.getCallback(function(result) {
            if (result) {
                console.log("Presence status changed");                
            } else {
                console.log("Presence status change failed");
            }
            self.closeWorkTab(component);
        })).catch(function(error) {
            console.log(error);
        });        
    },
	transferChatCase: function(component, event){
        var outboundEmailVO = component.get("v.outboundEmailVO");
        var self = this;
        var updatedData = component.get("v.caseData");
        var caseData = updatedData || {};
        var caseId = component.get("v.caseId");
        var originalCaseNumber = component.get("v.originalCaseNumber");
        var caseStatus = 'Transfer';
        var dataMap = {};
        dataMap.action = 'Transfer';
               
        dataMap.caseId = caseId;
        dataMap.caseNotes = component.get("v.note");
        dataMap.localeId = component.get("v.outboundLocale");
        dataMap.email = component.get("v.emailText");
        dataMap.resolution = component.get("v.selectedCaseResolution");
        dataMap.queueId = component.get("v.selectedCaseQueue");
        dataMap.customMessage = component.get("v.emailText");
        dataMap.responseURL = (outboundEmailVO != null) ? outboundEmailVO.responseURL : '';
        dataMap.outboundmailId = (outboundEmailVO != null) ? outboundEmailVO.id : '';
        dataMap.subject = caseData.hasOwnProperty('subject') ? caseData.subject : '';
        dataMap.product = caseData.hasOwnProperty('productId') ? caseData.productId : '';
        dataMap.platform = caseData.hasOwnProperty('platformId') ? caseData.platformId : '';
        dataMap.category = caseData.hasOwnProperty('categoryId') ? caseData.categoryId : '';
        dataMap['sub-category'] = caseData.hasOwnProperty('issueId') ? caseData.issueId : '';
        if(component.get("v.selectedCaseStatus")== "Duplicate Case" && originalCaseNumber != null ){
            dataMap.originalCaseNo = component.get("v.originalCaseNumber");
        }
        
        dataMap = this.dataCleanUp(dataMap);
        var action = component.get("c.chatToChatTransfer");
        component.set("v.isLoading", true);
        var self = this;
        action.setParams({
            mapCaseParams: dataMap
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {                
                console.log('Chat transfer successful');
            } else {
                var errorMessage = response.getError();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({                   
                    "message": errorMessage[0].message,
                    "type": "error"
                });
                //toastEvent.fire();
            }
            component.set("v.isLoading", false);
        });
        $A.enqueueAction(action);
    },

    getStatus: function(component, event) {
        var omniAPI = component.find("omniToolkit");
        omniAPI.getServicePresenceStatusId().then(function(result) {
            component.set("v.currentStatusId", result.statusId);
            console.log('Status Id is: ' + result.statusId);
        }).catch(function(error) {
            console.log(error);
        });
    },
    populateCaseInteractionTabClosed: function(component, strCaseId) {
        var caseType = strCaseId.split("_")[0],
            caseId = strCaseId.split("_")[1];
        var action = component.get("c.populateCaseInteractionDetails");
        //caseOrChatId  objType 
        action.setParams({ "caseOrChatId": caseId, "objType": caseType});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                console.log('Success case Interaction');
            }
            else {
                console.log('Case Interaction failed');
            }
        });
        $A.enqueueAction(action);
    },
})