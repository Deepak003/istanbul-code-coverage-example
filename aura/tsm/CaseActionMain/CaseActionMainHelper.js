({
    closeAgentWork: function(component){         
        var omniAPI = component.find("omniToolkit"),
            workspaceAPI = component.find("workspace"),
            caseId = component.get('v.simpleCase').Id,
            agentWorkId;        
        omniAPI.getAgentWorks().then(function(result) {
            var works = JSON.parse(result.works);
            var isEngaged;
            for(var i in works){               
                if(works[i].workItemId == caseId.substring(0, 15)){
                    agentWorkId = works[i].workId;
                }
            }
            omniAPI.closeAgentWork({workId: agentWorkId}).then(function(res) {
                if (res) {                    
                    console.log("Closed work successfully");
                } else {                   
                    console.log("Close work failed");
                }
                workspaceAPI.getAllTabInfo().then(function(response) {
                    for (var x = 0; x < response.length; x++) {
                        if (response[x].url.indexOf('OMNI') != -1 && response[x].url.indexOf(caseId) != -1) {
                            workspaceAPI.closeTab({tabId: response[x].tabId});
                        }
                    }
                });
            }).catch(function(error) {
                console.log(error);
            }); 
        });							 
    },
    
    getProducts : function(component) {
        if (window.allProducts) {
            component.set("v.products", window.products);
        }
        else {
            var action = component.get("c.getProducts");        
            // set a callBack    
            action.setCallback(this, function(response) {            
                var state = response.getState();
                if (state === "SUCCESS") {
                    var storeResponse = response.getReturnValue();
                    // set searchResult list with return value from server.
                    window.allProducts = storeResponse;
                    component.set("v.products", storeResponse);
                }            
            });
            // enqueue the Action  
            $A.enqueueAction(action);
        }        
    },
    
    handlePetitionSave: function(component, event, getNxtFlag, reasonCode) {       
        var caseObj = component.get("v.simpleCase");
        //THOR-1101 START
        if(caseObj){
            if(!(caseObj.PlatformLR__c && caseObj.ProductLR__c && caseObj.Case_Category__c && caseObj.PlatformLR__r && caseObj.ProductLR__r && caseObj.Case_Category__r))
            {	var toastEvent = $A.get("e.force:showToast"),
                showHideQueueDrop = component.find('queueSelectDropdown');
             toastEvent.setParams({                    
                 "message": 'Case could not be processed, please make sure that the Product, Category and Issue fields are complete.',
                 "type": 'warning'
             });                
             toastEvent.fire();
             if(!$A.util.hasClass(showHideQueueDrop, 'slds-hide')){
                 $A.util.addClass(showHideQueueDrop, 'slds-hide');
             }
             return;
            }
        }
        //THOR-1101 END
        var strContentVO = component.get('v.strContentVO');
        var spinner = component.find("petitionSpinner");
        //var oldCaseObject = window.oldCaseObject;
        $A.util.toggleClass(spinner, "slds-hide");      
        var saveAction = component.get("c.updateCaseAndSaveCaseNotes"),
            sendEmailIngameMsg = component.get("c.sendEmailInGameMessage"),
            caseUpdateFlag = false;
        //accNoteAction = component.get("c.createAccountNotes");
        var checkViolationFound,
            checkViolationFoundNxt;
        checkViolationFound = component.get('v.caseAction').replace(/ /g,'');
        checkViolationFound = checkViolationFound.toLocaleLowerCase();
        if(checkViolationFound == "resolve-violationfound"){
            checkViolationFoundNxt = true;
        }  
        else{
            checkViolationFoundNxt = false;
        }
        var tabViewFlag = component.get('v.tabViewFlag'),
            recordId = caseObj.Id,
            caseStatus = checkViolationFoundNxt ? 'Resolved' : component.get('v.caseAction');
        if(!checkViolationFoundNxt){
            if(caseStatus.includes('Resolve')){
                caseStatus = "Resolved";
            }
            else if(caseStatus.includes('Transfer'))
            {
                caseStatus = "Transferred";
            }
                else if(caseStatus.includes('Escalate'))
                {
                    caseStatus = "Escalated";
                }
        }
        caseObj.Status = caseStatus;
        // Check for Reason Code        
        if (reasonCode) {
            caseObj.Reason = reasonCode;
        }
        
        // Reason Code END
        if (caseObj.products) {
            delete caseObj.products;
        }
        if (caseObj.platforms) {
            delete caseObj.platforms;
        }
        if (caseObj.categories) {
            delete caseObj.categories;
        }
        var contentStringify;
        if(strContentVO != null){
            contentStringify = JSON.stringify(strContentVO);
        }
        else{
            contentStringify = strContentVO;
        }
        
        var accSticky = component.find('accNotePinned'),
            accNoteParam = null,
            accNucleusId,
            accEmail,
            accSFId;
        if(caseObj.Petition_Details__r != undefined && caseObj.Petition_Details__r.Target_Account__r){
            accNucleusId = caseObj.Petition_Details__r.Target_Account__r.Nucleus_ID__c;
            accEmail = caseObj.Petition_Details__r.Target_Account__r.PersonEmail;
            accSFId = caseObj.Petition_Details__r.Target_Account__r.Id;
        }else{
            accNucleusId = caseObj.Account.Nucleus_ID__c;
            accEmail = caseObj.Account.PersonEmail;
            accSFId = caseObj.Account.Id;
        }
        if (accSticky && component.get('v.accNote').trim()) {
            accNoteParam = {noteText: component.get('v.accNote').trim(),
                            noteType: accSticky.get('v.value') ? 'ACCTSTICKYNOTE' : 'ACCTNOTE',
                            userId: accNucleusId,
                            userEmail: accEmail
                           };
        }
        var petAction =  component.get('v.petitionActionSelected');
        if(!petAction.includes("Resolve") && component.get('v.selectedQueue').length>=1){
            caseObj.Owner = component.get('v.selectedQueue')[0];
            caseObj.OwnerId = component.get('v.selectedQueue')[0].Id;
        }
        else if(petAction.includes("Resolve")){
            caseObj.OwnerId = $A.get('$SObjectType.CurrentUser.Id');
        }
        caseObj.sobjectType='Case';
        saveAction.setParams({"updateCase":JSON.stringify(caseObj),
                              "caseNote":component.get("v.caseNote").trim(), 
                              "accountNote": accNoteParam ? JSON.stringify(accNoteParam): null,
                              "strContentVO": contentStringify                                                       
                             });
        // Call The Send Email and In Game Msg to send Msg to Players
        // Sets the Params for Email and Ingame Msg
        var caseObj = component.get("v.simpleCase"),
            emailSubj = this.getValuestoDisplay(component, 'emailMsgTemplateCMB', 'value', 'emailTemplateOptions'),
            inGameSubj = this.getValuestoDisplay(component, 'inGameMsgTemplate', 'value', 'emailTemplateOptions'),
            EmailMessageVO = null,
            ImGameMessageVO = null,
            emailMsgTmpl = component.get('v.emailMsgTmpl'),
            inGameMsgTmpl = component.get('v.inGameMsgTmpl'),
            sendMsgFlag = false,
            chkMsgFlg = true,
            sendMsgDisp = component.find('emailingMsgSection'),
            promisecase = '';
        
        if ($A.util.hasClass(sendMsgDisp, 'slds-hide')) {
            chkMsgFlg = false;
        }
        if (emailMsgTmpl && emailMsgTmpl.trim() && chkMsgFlg) {
            //Checking for Arabic Templates
            var arabic = /[\u0600-\u06FF]/;
            if(arabic.test(emailMsgTmpl)) {
                emailMsgTmpl = '<span dir="rtl">' + emailMsgTmpl + '</span>';
            }
            sendMsgFlag = true;
            var msgLocaleCmp = component.find('msgLanguage'),
                msgLocalId = '';
            if (msgLocaleCmp) {
                msgLocalId = msgLocaleCmp.get('v.value');
            }
            EmailMessageVO = {"message": emailMsgTmpl.trim(),
                              "reason": caseObj.Reason,
                              "subject": emailSubj,
                              "accountId": accSFId,
                              "toAddress": accEmail,
                              "localeId": msgLocalId};
        }
        if (inGameMsgTmpl && inGameMsgTmpl.trim() && chkMsgFlg) {
            sendMsgFlag = true;
            var idType;
            if(caseObj.Petition_Details__r != undefined){
                idType = caseObj.Petition_Details__r.Petition_Account_Type__c; 
            }
            ImGameMessageVO = {"crmProductName": caseObj.ProductLR__r.Url_Name__c,
                               "message": inGameMsgTmpl.trim(),
                               "id": accNucleusId,
                               "idType": idType,
                               "persona": "",
                               "platform": caseObj.PlatformLR__r.InternalName__c,
                               "reason": caseObj.Reason,
                               "subject": inGameSubj};
        }
        //Reset the Image Check Box
        var hideImg = component.find('hideContent'),
            unHideImg = component.find('unHideContent');
        if (hideImg && hideImg.length) {
            hideImg = hideImg[0];
        }
        if (unHideImg && unHideImg.length) {
            unHideImg = unHideImg[0];
        }	
        if (hideImg) {
            hideImg.set('v.value', false);
        }
        if (unHideImg) {
            unHideImg.set('v.value', false);
        }
        
        var tosMessageParam = {"emailMessage": EmailMessageVO, "inGameMessage": ImGameMessageVO, "caseId": caseObj.Id, 
                               "accountId": accSFId};
        
        
        if (saveAction != undefined) {
            sendEmailIngameMsg.setParams({"tosMessageVO":JSON.stringify(tosMessageParam), "newCase" : caseObj});
            
            promisecase = this.updateCasePromise(component, sendEmailIngameMsg, sendMsgFlag);
            // Saving the case
            // Sends the Email and In Game Msg
            var self = this;
            
            if (promisecase) { 
                promisecase.then(function() {
                    saveAction.setCallback(this, function(saveResult)  {
                        // NOTE: If you want a specific behavior(an action or UI behavior) 
                        // when this action is successful 
                        // then handle that in a callback (generic logic when record is changed should be 
                        // handled in recordUpdated event handler)
                        $A.util.toggleClass(spinner, "slds-hide");
                        component.set("v.caseNote", '');                
                        
                        if (saveResult.getState() === "SUCCESS" || saveResult.getState() === "DRAFT") {                 
                            //var responseDetails = JSON.parse(saveResult.getReturnValue());
                            //self.handleErrors(component,event, responseDetails);  
                            //THOR-1151 self.displayErrorMsg('success', "Updated case details with status Success.");  
                            caseUpdateFlag = true;                  
                            // Application Event Fire to delete row from Queued list  
                            var appEvent = $A.get("e.c:PetitionCommitApp"),
                                contentActPermsHide = component.get('v.contentActPermsHide'),
                                contentActPermsShow = component.get('v.contentActPermsShow');  
                            //component.set('v.contentActPermsHide', !contentActPermsHide);
                            //component.set('v.contentActPermsShow', !contentActPermsShow);
                            // Check if the Save & Commit button event is coming from case search tab.
                            var workspaceAPI = component.find("workspace");
                            workspaceAPI.getFocusedTabInfo().then(function(response) { 
                                var focusedTab = response;
                                if (focusedTab && focusedTab.tabId && focusedTab.pageReference
                                    &&focusedTab.pageReference.attributes.name && focusedTab.pageReference.attributes.name == "c:PetitionDetail") {
                                    workspaceAPI.closeTab({tabId: focusedTab.tabId});
                                    // Focuse the Queue Tab
                                    workspaceAPI.getAllTabInfo().then(function(responseAll) {                
                                        var tabInfo = '';
                                        var item = '';
                                        for(item of responseAll) {
                                            if (item.pageReference.type == 'standard__navItemPage') {
                                                tabInfo = item;
                                            }
                                        }
                                        if (tabInfo) {
                                            
                                            console.log('CaseAction Comp Helper focusTab :: ' + tabInfo.tabId);
                                            workspaceAPI.focusTab({tabId: tabInfo.tabId});
                                        }                                        
                                    }).catch(function(error) {
                                        console.log(error);
                                    });
                                }
                                else {
                                    if (appEvent != undefined && getNxtFlag) {
                                        appEvent.setParams({
                                            pk : [recordId],
                                            getNextPetition : getNxtFlag
                                        });
                                        setTimeout(function() { 
                                            appEvent.fire();
                                        }, 2000);
                                        
                                    }                                    
                                    var petionDEvent = $A.get("e.c:PetitionDetailEvent");
                                    // Application Event Fire
                                    if (petionDEvent != undefined && focusedTab.pageReference.type != 'standard__navItemPage') {
                                        petionDEvent.setParams({
                                            id : '',
                                            domEl: '',
                                            type: component.get('v.tabViewFlag')
                                        });
                                        petionDEvent.fire();
                                    }
                                }
                            });
                            // TODO for handle component related logic in event handler
                            // Remove a petition in Queued tab and adding in Completed tab
                        } else if (saveResult.getState() === "INCOMPLETE") 
                        {
                            console.log("User is offline, device doesn't support drafts.");
                        } else if (saveResult.getState() === "ERROR") 
                        {
                            var errorDetails;
                            errorDetails = JSON.parse(saveResult.getError()[0].message);
                            self.handleErrors(component,event,errorDetails);  
                            /*
                            if(typeof saveResult.getError()[0].message == 'string'){
                            	
                            }else{
                                errorDetails = JSON.parse(saveResult.getError()[0].message);
                                self.handleErrors(component,event,errorDetails);    
                            }
                            */
                            //self.displayErrorMsg('error', "An issue occurred and we are unable to retrieve the information you requested.");
                            console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error));
                        } else 
                        {
                            var errorDetails = JSON.parse(saveResult.getError()[0].message);
                            self.handleErrors(component,event,errorDetails);
                            //self.displayErrorMsg('error', "An issue occurred and we are unable to retrieve the information you requested.");
                            console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
                        }
                    });
                    $A.enqueueAction(saveAction);
                });
            }
            
        }
        else {
            //var spinner = component.find("petitionSpinner");
            $A.util.toggleClass(spinner, "slds-hide");
            // Application Event Fire to delete row from Queued list
            var appEvent = $A.get("e.c:PetitionCommitApp");
            if (appEvent != undefined) {
                appEvent.setParams({
                    pk : [component.get("v.recordId")],
                    getNextPetition : getNxtFlag
                });                
                appEvent.fire();
            }
        }
        
        // var petitionActions = component.find('selectPetitionAction');
        // petitionActions.set('v.value', "");
        component.set("v.petitionMsg", false);
        component.set('v.petitionCommitFlg', false);
    },
    
    updateCasePromise: function(component, saveAction, sendMsgFlag) {
        var self = this;
        var promise1 = new Promise(function(resolve, reject) {
            resolve(self.updateCaseNoteAccContentAction(component, saveAction, sendMsgFlag));
        }).catch(function(error) {
            self.displayErrorMsg('error', "An issue occurred and we are unable to retrieve the information you requested.");
            console.log('Error Save Case'+error);
        });
        return promise1;
    },
    
    updateCaseNoteAccContentAction: function(component, saveAction, sendMsgFlag) { 
        var spinner = component.find("petitionSpinner");
        
        if (saveAction != undefined && sendMsgFlag) {            
            saveAction.setCallback(this, function(sendMsgResult) {
                var msgStatus = sendMsgResult.getState();
                $A.util.removeClass(spinner, "slds-hide");
                if (msgStatus === "SUCCESS" ||msgStatus === "DRAFT") {
                    console.log('Msg send succesfully');
                }
                else {
                    console.log('Msg not send succesfully');
                } 
            });
            $A.enqueueAction(saveAction); // Saving the case
        }
        
    },
    
    createCase: function(component, event) {        
        var selectedAction = component.get("v.caseAction"),      
            notesVar = component.get("v.note"),
            newCase = component.get("v.caseObj"),
            newPetitionDetails = component.get("v.petitionDetails"),
            action = component.get("c.createPetition"),
            selProductObj = component.find('createCaseProduct').get('v.oRecord'),
            selPlatformObj = component.find('createCasePlatform').get('v.oRecord'),           
            selCategoryObj = component.find('createCaseCategory').get('v.oRecord'),
            targetAccount = component.get('v.targetAccount'),
            currentOmniStatus = component.get('v.currentOmniStatus'),
            availableStatusId = component.get('v.availableStatusId'),
            selContentTypeObj;
        if(!selProductObj ||!selCategoryObj||!selPlatformObj || !selProductObj.Id || !selCategoryObj.Id || !selPlatformObj.Id){
            this.displayErrorMsg("Error!", "Product, Category or Platform can't be blank");
            return;
        }
        var promise1 = this.getOmniStatus(component);
        var self = this;
        promise1.then(function(result){
        	if(result == undefined){
                self.displayErrorMsg('error', 'Please changes the status to available in Omni Widget');
            }
            if(result != undefined && result.statusId != availableStatusId){
                self.setStatus(component);
            }      
            if (selectedAction == 'create-petition') {
                selContentTypeObj = component.find('createCaseContentType').get('v.oRecord');
            }
            var spinner = component.find('petitionSpinner');
            console.log(newCase);
            
            // Display message for error
            if (selProductObj == null) {
                self.displayErrorMsg("Error!", "Product can't be blank.");
                return;
            }
            else {
                newCase.ProductLR__c = selProductObj.Id;
            }
            if (selPlatformObj == null) {
                self.displayErrorMsg("Error!", "Platform can't be blank.");
                return;
            }
            else {
                newCase.PlatformLR__c = selPlatformObj.Id;
            }
            if (selCategoryObj == null) {
                self.displayErrorMsg("Error!", "Category can't be blank.");
                return;
            }
            else {
                newCase.Case_Category__c = selCategoryObj.Id;
            }
            if (newCase.Subject == null || newCase.Subject == '') {
                self.displayErrorMsg("Error!", "Subject can't be blank.");
                return;
            }
            if (notesVar == null) {
                self.displayErrorMsg("Error!", "Note can't be blank.");
                return;
            }       
            if(selContentTypeObj != undefined || selContentTypeObj != null)
            { 
                newPetitionDetails.Content_Type__c = selContentTypeObj.Name;
            }
            
            $A.util.toggleClass(spinner, "slds-hide");
            //To-do set the parameters appropriately while integrating the create case component with backend. As of now, integrated only creation of case notes
            if (selectedAction == 'create-dispute') {
                action = component.get("c.createDispute");
                action.setParams({ strAccNucleusId : null,accountId:targetAccount.strSFAccountId,newCase:newCase,strCaseNotes:notesVar });
            }
            else {           
                action.setParams({ strTargetAccNucleusId : null,targetAccId:targetAccount.strSFAccountId,newCase:newCase,newPetiDetails:newPetitionDetails,strCaseNotes:notesVar });
            }
            //THOR-280 -- Create petition case for non nucleus users
            if (targetAccount.idType && targetAccount.idType != '') {
                action = component.get("c.createGamerPetition");
                action.setParams({ strSyneryID :null ,targetAccId:targetAccount.strSFAccountId,newCase:newCase,newPetiDetails:newPetitionDetails,strCaseNotes:notesVar });
            }
            //Check for the products object
            var allProducts = component.get('v.products');
            if (window.allProducts && window.allProducts != allProducts) {
                component.set('v.products', window.allProducts);
            }
            action.setCallback(this, function(response) {
                var state = response.getState();
                $A.util.toggleClass(spinner, "slds-hide");
                if (state === "SUCCESS") {
                    var objCase = response.getReturnValue(),
                        evt = $A.get("e.force:navigateToComponent");
                    self.acceptAgentWork(component, objCase.Id);
                    //Fire event to nulltify selected values
                    component.set('v.createCase', false);
                    component.set("v.caseAction", null);
                    component.set("v.caseObj.Subject",null);                
                    component.set("v.note","");
                    //window.location = '/lightning/n/ThorQueue?id='+response.getReturnValue();				
                    evt.setParams({
                        componentDef : "c:PetitionDetail",
                        componentAttributes: {
                            simpleCase : objCase,
                            searchCaseFlg : true
                        }                        
                    }); 
                    evt.fire();
                }
                else {
                    console.log(state);
                    self.displayErrorMsg('error', "An issue occurred and we are unable to retrieve the information you requested.");
                }
            });
            
             /*THOR-1459*/ 
            $A.util.addClass(component.find('cancelCreateCaseClick'), 'disableButton');
            $A.util.addClass(component.find('createCaseClick'), 'disableButton');
        
        
            $A.enqueueAction(action);
        });        
    },
    //thor 490 start
    getStrikes: function(component,event){
        
        var caseObj = component.get("v.simpleCase");
        var action = component.get("c.getStrikes");  
        action.setParams({
            "newCase" : component.get('v.simpleCase')
        });
        // set a callBack    
        action.setCallback(this, function(response) {            
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var updateStrikeAction = component.get('v.violationSelectedOptionList');
                updateStrikeAction.majorStrikesNum = null;
                updateStrikeAction.minorStrikesNum = null;
                component.set('v.selectedStrikeMsgName',null)
                var majorStrikeOptions =[]; var minorStrikeOptions =[];
                component.set("v.mapOfStrikes",response.getReturnValue());
                var strikesData = component.get("v.mapOfStrikes");
                for(var key in strikesData)
                {
                    console.log('key >>'+key);
                    if(key == 'MajorStrike'){
                        majorStrikeOptions = strikesData[key];
                        //this.setStrikesOptions(component,event,strikesData[key]);
                    }else if(key == 'MinorStrike'){
                        minorStrikeOptions = strikesData[key];
                        //this.setStrikesOptions(component,event,strikesData[key]);
                    }
                }
                var majorStrikesForUI =[]; var minorStrikesForUI=[];
                majorStrikesForUI = this.setStrikesOptions(component,event,majorStrikeOptions,'MajorStrike');
                component.set("v.majorStrikeOptions",majorStrikesForUI);
                minorStrikesForUI = this.setStrikesOptions(component,event,minorStrikeOptions,'MinorStrike');
                component.set("v.minorStrikeOptions",minorStrikesForUI);
            }
            else{
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                                    errors[0].message);
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    // Start THOR 490
    setStrikesOptions:function(component,event, strikeBasedOptions, strikeType){
        var setStrikes = [];
        for (var i=0; i<strikeBasedOptions.length; i++) 
        {
            if(strikeBasedOptions[i].indexOf('Current') != -1)
            {
                var obj = {
                    value:strikeBasedOptions[i],
                    isCurrent : true
                    
                };
                if(strikeType == 'MajorStrike'){
                    component.set("v.currentMajorStrike", strikeBasedOptions[i]);
                }else if(strikeType == 'MinorStrike'){
                    component.set("v.currentMinorStrike", strikeBasedOptions[i]);
                }
                //setStrikes[i]=obj;
                setStrikes.push(obj);
            }
            else{
                var obj = {
                    value:strikeBasedOptions[i],
                    isCurrent : false
                };
                setStrikes.push(obj); 
            }
        }
        return setStrikes;
    },
    // THOR 490 -- This method will handle first dropdown - based Type of Strike selected, we are getting current Major/Minor from Database
    selectStrike: function(component,event){
        var strikeType = component.find('strikesTypeSelect').get('v.value');
        var strikeOptions =[];
        if(strikeType == 'Major Strikes')
        {
            strikeOptions = component.get('v.majorStrikeOptions');
            console.log('@@@@@@@ '+strikeOptions);
            component.set("v.strikeOptions",strikeOptions);
            //var currentStrikeOption = this.pickCurrentStrikes(component,event,strikeOptions);
            var currentMajorStrike = component.get("v.currentMajorStrike");
            //component.set('v.selectedStrike', currentStrikeOption);
            //component.find("strikesName").set("v.value",currentStrikeOption);
            component.set('v.selectedStrike', currentMajorStrike);
            // component.find("strikesName").set("v.value",currentMajorStrike);
        }else if(strikeType == 'Minor Strikes'){
            strikeOptions = component.get('v.minorStrikeOptions');
            component.set("v.strikeOptions",strikeOptions);
            //var currentStrikeOption = this.pickCurrentStrikes(component,event,strikeOptions);
            //component.set('v.selectedStrike', currentStrikeOption);  
            var currentMinorStrike = component.get('v.currentMinorStrike');
            component.set('v.selectedStrike', currentMinorStrike);
            
        }else if(strikeType == 'Strike Type'){
            component.set('v.strikeOptions',strikeOptions);
            // var currentStrikeOption = this.pickCurrentStrikes(component,event,strikeOptions);
            // component.set("v.selectedStrike", currentStrikeOption);
        }
        this.cpsectionReset(component, 'hide,strike');
    },
    // THOR 490 - This method is called when second drop down is selected, this is where we calculate Strike difference
    selectedStrikeAction: function(component,event)
    {
        var updateStrikeAction = component.get('v.violationSelectedOptionList');
        //component.get('v.simpleCase').Petition_Details__r.Target_Account__r.MajorStrikes__c,
        //component.get('v.simpleCase').Petition_Details__r.Target_Account__r.MinorStrikes__c;
        var strikeType = component.get('v.selectedStrikeType');
        //var selectedStrike = component.find("strikeSection").get("v.value");
        var strikeSelected = component.get('v.selectedStrike');
        var currentMajorStrike = component.get('v.currentMajorStrike');
        var currentMinorStrike = component.get('v.currentMinorStrike');
        var majorStrike =  currentMajorStrike.substr(0, currentMajorStrike.indexOf('[')),
            //component.get('v.currentMajorStrike').substr(0,1),
            minorStrike =  currentMinorStrike.substr(0,currentMinorStrike.indexOf('['));
        
        var strikeNumber = strikeSelected.substr(0, strikeSelected.indexOf('[')); 
        var selectedStrikeMsgName = this.setOrdinalOfNumber(component,event,strikeNumber);
        if(strikeType == 'Major Strikes'){
            updateStrikeAction.majorStrikesNum = (strikeNumber - majorStrike);
            updateStrikeAction.minorStrikesNum = null;
            if((strikeNumber - majorStrike) > 0 ){
                selectedStrikeMsgName = selectedStrikeMsgName + ' Major Strike Applied';
            }else{
                selectedStrikeMsgName = 'Reduce major strikes by '+ Math.abs(strikeNumber - majorStrike);
            }
            //
            component.set('v.selectedStrikeMsgName',selectedStrikeMsgName);
        }else if(strikeType == 'Minor Strikes'){
            updateStrikeAction.minorStrikesNum = (strikeNumber - minorStrike);
            updateStrikeAction.majorStrikesNum = null;
            if( (strikeNumber - minorStrike) > 0 ){
                selectedStrikeMsgName = selectedStrikeMsgName + ' Minor Strike Applied';
            }else{
                selectedStrikeMsgName = 'Reduce minor strikes by '+ Math.abs(strikeNumber - minorStrike);
            }
            
            component.set('v.selectedStrikeMsgName',selectedStrikeMsgName);
        }
        component.set('v.violationSelectedOptionList',updateStrikeAction);
        this.cpsectionReset(component, 'hide,strike');  
    },
    // THOR 490 - This method is used to append ordinal for the chosen Strike.
    setOrdinalOfNumber:function(component,event,strikeNum){
        var suffix =["th","st","nd","rd"],
            remainder = strikeNum%100;
        return strikeNum+(suffix[(remainder-20)%10]||suffix[remainder]||suffix[0]);
    },
    // End thor 490 end
    
    //thor-492 start
    getReasonCodes: function(component, event) {
        var action = component.get("c.getStatusReasonCodes");        
        // set a callBack    
        action.setCallback(this, function(response) {            
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                var parsedData = JSON.parse(data);
                //create account reason codes list
                var accountReasonCodes = [];
                accountReasonCodes = parsedData.Account;
                var acctreasoncodearray = [];
                accountReasonCodes.map(function(item){
                    var accreasoncodevalue = {};  
                    accreasoncodevalue.value = item; 
                    accreasoncodevalue.label = item;
                    acctreasoncodearray.push(accreasoncodevalue);
                });
                component.set('v.accountReasonCodes',acctreasoncodearray);
                //create entitlement codes list
                var entitlementReasonCodes = [];
                entitlementReasonCodes = parsedData.Entitlement;
                var entreasoncodearray = [];
                entitlementReasonCodes.map(function(item){
                    var entreasoncodevalue = {};  
                    entreasoncodevalue.value = item; 
                    entreasoncodevalue.label = item;
                    entreasoncodearray.push(entreasoncodevalue);
                });
                component.set('v.entReasonCodes',entreasoncodearray);
                //create franchise codes list
                var franchiseReasonCodes = [];
                franchiseReasonCodes = parsedData.Franchise;
                var franchisereasoncodearray = [];
                franchiseReasonCodes.map(function(item){
                    var franreasoncodevalue = {};  
                    franreasoncodevalue.value = item; 
                    franreasoncodevalue.label = item;
                    franchisereasoncodearray.push(franreasoncodevalue);
                });
                component.set('v.franchiseReasonCodes',franchisereasoncodearray);
            }            
        });
        // enqueue the Action  
        $A.enqueueAction(action);
    },
    
    updateViolationActionOptions: function(component, event) {
        console.log('post the violation options');        
        var action = component.get("c.performPenaltyContentAction"),
            penaltyActions = component.get('v.violationSelectedOptionList'),
            petitionCaseObj = component.get('v.simpleCase').Petition_Details__r,
            strContentVO = component.get('v.strContentVO'),
            contentPenaltyEventsParam = component.get('v.contentPenaltyActionEventParam'),
            caseObj = component.get('v.simpleCase'),
            entitlements = '';
        if (caseObj.products) {
            delete caseObj.products;
        }
        if (caseObj.platforms) {
            delete caseObj.platforms;
        }
        if (caseObj.categories) {
            delete caseObj.categories;
        }
        // Check fo Entitlements
        if (penaltyActions.strType == 'ENTITLEMENT') {
            entitlements = component.find('productEntitlementsLookup').get('v.listOfSelectedRecords');
        }
        // ContentPenalty Obj
        penaltyActions.strNucleusId = petitionCaseObj && petitionCaseObj.Target_Account__r ? petitionCaseObj.Target_Account__r.Nucleus_ID__c: '';
        penaltyActions.strParentId = petitionCaseObj && petitionCaseObj.Target_Account__r ? petitionCaseObj.Target_Account__r.Nucleus_ID__c: '';
        
        var caseList = [];
        caseList.push(component.get('v.simpleCase')); // TODO - Mass Action
        var selectedItems = component.get('v.selectedItems');
        var paramType = penaltyActions.strType ? penaltyActions.strType.toLowerCase():'',
            paramEvtObj = {},
            paramEvtArr = [];
        
        if (entitlements) 
        {
            var entIds = []
            for (var i=0; i<entitlements.length; i++) {
                console.log('##### '+entitlements[i]);
                var entParam = {
                    "strStatus": entitlements[i].status, //penaltyActions.action,
                    "strEntitlementId": entitlements[i].Id,
                    "strEntitlementTag": entitlements[i].Name
                };
                entIds.push({"id": entitlements[i].Id});
                paramEvtArr.push(entParam);
            }
            selectedItems.entitlements = paramEvtArr;
            penaltyActions.lstIDInfo = entIds;
        }
        else {
            contentPenaltyEventsParam.status = penaltyActions.action;
            paramEvtArr.push(contentPenaltyEventsParam);
        }
        
        paramEvtObj[paramType] = paramEvtArr; // Request Details for Old
        if (penaltyActions.strType == 'FRANCHISE_BAN') {
            
            if(caseObj.ProductLR__r.Name && caseObj.ProductLR__r.Name.search('fifa') >=0) {
                penaltyActions.strProduct = caseObj.ProductLR__r.Name;
            }
        }
        // "caseObj": caseObj,
        // "accountObj": component.get('v.simpleCase').Petition_Details__r.Target_Account__r
        penaltyActions['selectedItems'] = selectedItems;
        
		var synergyId = caseObj.Petition_Details__r.Target_Account__r.Synergy_ID__c;
        if(synergyId){
            penaltyActions.strIDType = synergyId.split(";").pop(); 
            penaltyActions.lstIDInfo = [{"id": synergyId.substr(0, synergyId.indexOf(';'))}];
            penaltyActions.strProduct = caseObj.ProductLR__r.Url_Name__c;
        }
		
        var penaltyContent = {
            "strPenaltyVO":  penaltyActions,
            //"strSelectedResponse" : paramEvtObj,
            //"strNucleusID" : penaltyActions.nucleusId,
            //"strCasePageType": "CaseDetail"
        };
        
        
        //console.log('strContentVO >>> '+ JSON.stringify(strContentVO));
        //console.log('penaltyContent >>> '+ JSON.stringify(penaltyContent));
        action.setParams({  
            strPenaltyVO :  JSON.stringify(penaltyContent),
            strContentVO: JSON.stringify(strContentVO),
            lstCases : caseList
        });
        // set a callBack    
        action.setCallback(this, function(response) {            
            var state = response.getState();
            component.set('v.strContentVO', null);            
            if (state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast"),
                    contentActPermsHide = component.get('v.contentActPermsHide'),
                    contentActPermsShow = component.get('v.contentActPermsShow');  
                //component.set('v.contentActPermsHide', !contentActPermsHide);
                //component.set('v.contentActPermsShow', !contentActPermsShow);              
                this.getStrikes(component); // THOR 490 - This is needed to get updated strikes from database 
                var appEvent = $A.get("e.c:strikesAppEvent");
                var successDetails = JSON.parse(response.getReturnValue());
                this.handleErrors(component,event,successDetails);
                //this.displayErrorMsg('success', "Selected Actions have been take and Events logged " + response.getState());
                
                console.log('@@@@@@@@ '+component.get('v.simpleCase').Petition_Details__r.Target_Account__r);
                if(appEvent){
                    appEvent.setParams({
                        "targetAccountForStrikes" : component.get('v.simpleCase').Petition_Details__r.Target_Account__r.Id
                    });
                    appEvent.fire();
                }   
            } 
            else if(state === "ERROR")
            {
                var errorDetails = JSON.parse(response.getError()[0].message);
                this.handleErrors(component,event,errorDetails);
                // this.displayErrorMsg('error', "An issue occurred and we are unable to retrieve the information you requested.");
                console.log('Error: Saving Penalty Content Actions ' +response.getError()[0].message);
            }            
        });
        // enqueue the Action  
        $A.enqueueAction(action);
    },
    handleErrors: function(component,event,strResponseMessage){
        var responseDetails = [];
        var showErrMsg = ''; var showSuccessMsg = ''; 
        var errorDetails =  strResponseMessage; 
        if(typeof errorDetails == 'string')
        {
            this.displayErrorMsg('error', errorDetails);  
        }else if(typeof errorDetails == 'object')
        {
            for(var key in errorDetails)
            {
                responseDetails = errorDetails[key];
                if(responseDetails.strStatus == 'SUCCESS'){
                    showSuccessMsg = showSuccessMsg + responseDetails.strMessage +'  \n';
                }else{
                    showErrMsg = showErrMsg + responseDetails.strMessage +'  \n';
                }
                if(responseDetails.newErrorAuraVO != null){
                    showErrMsg = showErrMsg + responseDetails.newErrorAuraVO.strErrorMsg +'  \n';
                }
                console.log('key >>'+key);
            }
            //this.displayErrorMsg('success', showSuccessMsg);
            this.displayErrorMsg('error', showErrMsg);  
        }
        
    },
    getValuestoDisplay: function(component, IdName, valName, optionName) {        
        var elmName = component.find(IdName),
            valueElm = '',
            labelReturn = '';
        if (elmName) {
            valueElm = elmName.get('v.'+valName);
            if (valueElm && optionName) {
                var optionsElm = component.get('v.'+optionName);
                if (optionsElm) {
                    var labelElm = optionsElm.find(function(data, i) {
                        if (valueElm == data.value) {
                            return data;
                        }
                    });
                    if (labelElm) {
                        labelReturn = labelElm.label;
                    }
                }
            }
        }
        return labelReturn;
    },
    
    getProductEntitlements: function(component, event) {
        var action = component.get("c.getUserEntitlements");
        var productDetails = {};
        productDetails.strPageSize = "10000";
        productDetails.strPageNumber = "1";
        productDetails.strNucleusID = component.get('v.simpleCase').Petition_Details__r.Target_Account__r?component.get('v.simpleCase').Petition_Details__r.Target_Account__r.Nucleus_ID__c : "";
        productDetails.strCrmProductName = component.get('v.simpleCase').ProductLR__r ? component.get('v.simpleCase').ProductLR__r.Url_Name__c: '';
        productDetails.noCache = false;
        productDetails.strWithoutProduct ='NO';
        //console.log('productDetails >>> '+JSON.stringify(productDetails));
        action.setParams({"strEntitlementRequest": JSON.stringify(productDetails)});
        action.setCallback(this, function(response) {            
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = JSON.parse(response.getReturnValue());
                var productEntitlements = data.response.entitlements;
                var prodKeys = Object.keys(productEntitlements); 
                var entObj = {}; var entArray = [];
                productEntitlements.map(function(item) { 
                    if(item.name && item.entitlementId && item.status == 'ACTIVE'){
                        entObj = {Id:item.entitlementId, Name: item.name, status: item.status};
                        entArray.push(entObj);
                    }                                
                });
                if(entArray.length == 0)
                {
                    this.displayErrorMsg('error', "There are no ACTIVE entitlements present for this Account.");                                
                }
                component.set('v.productEntitlements',entArray);
                $A.util.removeClass(component.find("productEntitlementsSection"), "slds-hide");
                $A.util.addClass(component.find("violationActionSpinner"), "slds-hide");
            }
            else{                        
                this.displayErrorMsg('error', "An issue occurred and we are unable to retrieve the information you requested.");
                console.log('<<< Error in getting the product entitlements in violation action >>>' + response.getError()[0].message);
                $A.util.addClass(component.find("violationActionSpinner"), "slds-hide");
            }
        });
        $A.enqueueAction(action);
    },
    
    durationForPenaltyAction: function(component, durationNumber, durationUnit) {
        var updateDuration= component.get('v.violationSelectedOptionList');
        durationNumber = parseInt(durationNumber);
        if(updateDuration.strType == "FRANCHISE_BAN"){ //checking the penality level type if it is franchise we convert the duration to TZ format
            var startDate = new Date();
            if (durationUnit == 'hours') {
                startDate.setHours(startDate.getHours() + durationNumber);
            }
            else {
                startDate.setDate(startDate.getDate() + durationNumber);
            }            
            var takeActionTill = startDate.toISOString();
            updateDuration.strDurationUnit = "dateTime";
            updateDuration.strDuration = takeActionTill;
            component.set('v.violationSelectedOptionList',updateDuration);
        }
        else{ //if not franchise then number of days will be sent
            durationNumber = durationNumber.toString();
            updateDuration.strDurationUnit = durationUnit == "hours" ? "hours" :"day";
            updateDuration.strDuration = durationNumber;
            component.set('v.violationSelectedOptionList',updateDuration);
        }
    },
    //thor-492 end
    
    displayErrorMsg: function(type, msg) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: 'pester',
            duration: '7000',
            "message": msg,
            "type": type
        });
        toastEvent.fire();
    },
    
    convertCustomToDays: function (component, unitVal, durationUnit) {
        var returnVAl = '';
        if(durationUnit == "hours") {
            returnVAl = unitVal;
        }
        else if(durationUnit == "days") {
            returnVAl = unitVal;
        }
        else if(durationUnit == "weeks"){
            returnVAl = unitVal*7;
        }
            else if(durationUnit == "months"){
                returnVAl = unitVal*30;
            }
                else{
                    returnVAl = unitVal*365;
                }
        return returnVAl;
    },
    
    getMsgLanguages: function (component) {
        var action = component.get("c.getLocalesForMessaging"),
            msgLocaleOptions = [];
        
        action.setParams({"isPetition": true});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                if (data && data.length) {
                    for(var item of data) {
                        if (item.localeId) 
                            msgLocaleOptions.push({'label': item.DisplayName ? item.DisplayName : item.localeId, 'value': item.localeId});
                    }
                }
                component.set('v.msgLanguageOptions', msgLocaleOptions);
            }
            else {
                console.log("Error in get locales");
            }
        });
        $A.enqueueAction(action);
    },
    getTemplateList: function (component, localeId, templateType) {
        var spinner = component.find('msgLocaleSpinner'),            
            prodId = component.get('v.simpleCase').ProductLR__c,
            emailTemplateOptions = [];
        $A.util.toggleClass(spinner, 'slds-hide');
        
        var tempAction = component.get("c.getTosMessageTemplates");
        tempAction.setParams({"isPetition": true, "strLocaleId": localeId , "strProduct": prodId});
        tempAction.setCallback(this, function(response) {
            var state = response.getState(),
                emailMsgTemplateCMB = component.find('emailMsgTemplateCMB'),
                inGameMsgTemplate = component.find('inGameMsgTemplate');
            if (emailMsgTemplateCMB) {
                $A.util.removeClass(emailMsgTemplateCMB, 'disabled-section');
            }
            if (inGameMsgTemplate) {
                $A.util.removeClass(inGameMsgTemplate, 'disabled-section');
            }            
            $A.util.toggleClass(spinner, 'slds-hide');
            if (state === "SUCCESS") {
                var dataTemplates = response.getReturnValue();
                if (dataTemplates && dataTemplates.length) {
                    for(var item of dataTemplates) {
                        if (item.Id) 
                            emailTemplateOptions.push({'label': item.Name, 'value': item.Id});
                    }
                }
                component.set("v.emailTemplateOptions", emailTemplateOptions);
            }
            else {
                console.log("Error in get Email Templates");
            }
        });
        $A.enqueueAction(tempAction);
    },
    
    getTemplateMessage: function (component, templateId, typeId) {
        var spinner = component.find('msgLocaleSpinner'),            
            msgTemplate = '';
        $A.util.toggleClass(spinner, 'slds-hide');
        
        //var strikeVal = component.find('strikeLevelAdjust') ? component.find('strikeLevelAdjust').get('v.value') : '';
        var tempAction = component.get("c.getTemplateTextById");
        /*if (strikeVal) {
            var msgLanguageVal = component.find('msgLanguage').get('v.value'),
                prodId = component.get('v.simpleCase').ProductLR__c;
            tempAction = component.get("c.getPetitionMsgTemplate");
            tempAction.setParams({"strStrike": strikeVal, "strLocaleId":msgLanguageVal ,"strProduct":prodId});
        }
        else {*/
        tempAction.setParams({"strTemplateId": templateId});
        //}
        
        tempAction.setCallback(this, function(response) {
            var state = response.getState();
            $A.util.toggleClass(spinner, 'slds-hide');
            if (state === "SUCCESS") {
                var msgTemplate = response.getReturnValue(),
                    emailMsgTmplId = component.find('emailMsgTmplId'),
                    inGameMsgTmplId = component.find('inGameMsgTmplId'),
                    regEx = new RegExp("<br>", "g");
                if (msgTemplate) {
                    msgTemplate = msgTemplate.replace(regEx, '<br/>');
                    regEx = new RegExp("<br/>", "g");
                    msgTemplate = msgTemplate.replace(regEx, '<br/>');
                    regEx = new RegExp("&lt;br&gt;", "g");
                    msgTemplate = msgTemplate.replace(regEx, '<br/>');
                }                
                if (typeId == 'Email') {
                    component.set("v.emailMsgTmpl", msgTemplate);
                    if (emailMsgTmplId) {
                        $A.util.removeClass(emailMsgTmplId, 'disabled-section');
                    }
                }
                if (typeId == 'InGame') {
                    component.set("v.inGameMsgTmpl", msgTemplate);                
                    if (inGameMsgTmplId) {
                        $A.util.removeClass(inGameMsgTmplId, 'disabled-section');
                    }
                }                
            }
            else if(state == "ERROR"){
                this.displayErrorMsg('error', response.getError()[0].message);
                console.log("Error in get Email Templates");
            }
        });
        $A.enqueueAction(tempAction);
    },
    
    getSuprtMessageType: function(component) {
        var caseObject = component.get('v.simpleCase');
        if (caseObject && caseObject.ProductLR__r) {
            var strProdId = caseObject.ProductLR__r.Id,
                msgAction = component.get("c.getSupportedMessageType");
            
            msgAction.setParams({"strProductId": strProdId});
            msgAction.setStorable();
            msgAction.setCallback(this, function(response) {
                var state = response.getState(),
                    simpleCase = caseObject;
                if (state === "SUCCESS") {
                    var supMsgType = response.getReturnValue();                
                    component.set("v.supportedMsgType", supMsgType);   
                    component.set('v.msgLanguageVal', simpleCase.LocaleLR__c);// Load template to case locale
                    if (simpleCase.LocaleLR__c) {
                        this.getTemplateList(component, simpleCase.LocaleLR__c, 'Email');
                        this.getPetitionMsgTemplate(component);
                    }
                    if (supMsgType && (supMsgType.isEmail || supMsgType.isInGame)) {
                        var petitionMsgSec = component.find('petition-message'),
                            sendMsg = component.find('sendMsg'),
                            makeNotes = component.find('makeNotesMsgSection');
                        
                        if (!$A.util.hasClass(makeNotes, 'slds-hide')) {
                        	/*THOR-1343 : SUS : If condition added to exclude below logic when Petition action is selected as 'Resolve - No Violation Found', in order to hide 'Send Message' panel*/
                        	if( component.get('v.petitionActionSelected') != 'Resolve - No Violation Found' )
                        	{
                            $A.util.removeClass(petitionMsgSec, 'disabled-section');
                            $A.util.removeClass(sendMsg, 'slds-hide');
                        }
                        }
                        //TODO
                    }
                    else {
                        var petitionMsgSec = component.find('petition-message'),
                            commitActionSection = component.find('commitActionSection'),
                            sendMsg = component.find('sendMsg'),
                            commitButton = component.find('commit_button');
                        $A.util.addClass(petitionMsgSec, 'disabled-section');
                        $A.util.removeClass(commitActionSection, 'disabled-section');
                        $A.util.addClass(sendMsg, 'slds-hide');
                        if(component.get("v.caseNote")==null || component.get("v.caseNote")=='' ){
                            $A.util.addClass(commitButton, 'disableButton');           
                        }else{
                            $A.util.removeClass(commitButton, 'disableButton');
                        }
                        //var petitionAddSec = component.find('petition-aditional-actions'),
                        //  addAction = component.find('addlnActnSec');
                        // $A.util.removeClass(petitionAddSec, 'disabled-section');
                        //$A.util.removeClass(addAction, 'slds-hide');
                    }
                }
                else{
                    console.log("Error in get Email Templates");
                }
            });
            $A.enqueueAction(msgAction);
        }
    },
    
    cpsectionReset: function(component, fieldNm) {
        var pcontentPenaltiesSec = component.find('petition-content-penalties'),
            pcpSection = component.find('violationConfirmedOptions'),
            strikesTypeSec = component.find('strikesTypeSelect'),  
            strikesSection = component.find('strikeSection'),
            pcpStrike = component.find('strikeLevelAdjust'),
            pcpPlevel = component.find('penaltyLevel'),
            pcpEntitlemnts = component.find('productEntitlementsLookup'),
            pcpDispAct = component.find('disciplinaryAction'),
            pcpDurationB = component.find('durationBan'),
            pcpReason = component.find('reasonCode'),
            cpamsgSection = component.find('cpamsgSection'),
            hideContChbox = component.find('hideContent'),
            unHideCntChbox = component.find('unHideContent'),
            customDurationDropdown = component.find("customDurationSection"),
            cpactBtn = component.find('cpactBtn'),
            penaltyActions = component.get('v.violationSelectedOptionList'),
            fieldName = fieldNm || '';
        if (fieldName == '') {
            this.resetActionSections(component, 'pcpSec');
        }
        component.set('v.sendMsgPreviewFlg', false);
        if (pcontentPenaltiesSec) {    		
            if (fieldName == '') {
                $A.util.addClass(cpamsgSection, 'slds-hide');
            }            
            //$A.util.addClass(pcontentPenaltiesSec, 'disabled-section');
            if (hideContChbox && ((fieldName && !fieldName.includes('hide')) || !fieldName)) {
                hideContChbox.set('v.value', false);
            }
            if (unHideCntChbox && ((fieldName && !fieldName.includes('hide')) || !fieldName)) {
                unHideCntChbox.set('v.value', false);
            }  
            // THOR 490
            if (strikesSection && ((fieldName && !fieldName.includes('strike')) || !fieldName)) {
                //pcpStrike.set('v.value', '');
                strikesTypeSec.set('v.value','Strike Type');
                component.set('v.strikeOptions',[]);
            }
            if (pcpPlevel && ((fieldName && !fieldName.includes('penalty')) || !fieldName)) {
                pcpPlevel.set('v.value', '');
                var entitlementSection = component.find("productEntitlementsSection");
                if (entitlementSection) {
                    pcpEntitlemnts.set('v.SearchKeyWord', '');
                    pcpEntitlemnts.set('v.listOfSelectedRecords', []);
                    $A.util.addClass(entitlementSection, 'slds-hide');
                    /*var selectedEnts = document.getElementById('selectedItems');
                    if (selectedEnts) {
                        selectedEnts.innerHTML = '';
                    }*/
                }
            }
            if (pcpEntitlemnts && ((fieldName && !fieldName.includes('entlmnt')) || !fieldName)) {
                pcpEntitlemnts.set('v.value', '');
            }
            if (pcpDispAct && ((fieldName && !fieldName.includes('displact')) || !fieldName)) {
                pcpDispAct.set('v.value', '');
            }
            if (pcpDurationB && ((fieldName && !fieldName.includes('duration')) || !fieldName)) {
                pcpDurationB.set('v.value', '');
                $A.util.addClass(customDurationDropdown, 'slds-hide');
                var custDurationVal = component.find('custDurationVal'),
                    customDurationUnit = component.find('customDurationUnit');
                if (customDurationUnit && custDurationVal) {
                    custDurationVal.set('v.value', '');
                    customDurationUnit.set('v.value', '');
                }
            }
            if (pcpReason && ((fieldName && !fieldName.includes('reason')) || !fieldName)) {
                pcpReason.set('v.value', '');
            }
            if (cpactBtn) {
                $A.util.addClass(cpactBtn, 'disabled-section');
            }
            if (penaltyActions && !fieldName) {
                penaltyActions = {
                    "strType":  null, 
                    "strIDType": null,
                    "strAction": null,  
                    "strParentId":null,
                    "strComment":null,
                    "strStatusReasonCode":null, 
                    "lstIDInfo" : null, 
                    "majorStrikesNum":null,
                    "minorStrikesNum":null,
                    "strProduct": null,
                    "strDurationUnit": null,
                    "strDuration": null,
                    "strNewFranchiseBan":null,
                    "strNucleusId": null
                };
                component.set('v.violationSelectedOptionList', penaltyActions);
            }
            // Check box to uncheck
            if (fieldName == '') {
                
                component.set('v.caseNote', '');
                component.set('v.accNote', '');
            }            
        }
    },
    
    resetActionSections: function(component, secName) {
        var petitionAction = component.find('selectPetitionAction'),
            pcontentPenaltiesSec = component.find('petition-content-penalties'),
            pcpSection = component.find('violationConfirmedOptions'),
            strikesTypeSec = component.find('strikesTypeSelect'),  
            strikesSection = component.find('strikeSection'),
            pcpStrike = component.find('strikeLevelAdjust'),
            pcpPlevel = component.find('penaltyLevel'),
            pcpEntitlemnts = component.find('productEntitlementsLookup'),
            pcpDispAct = component.find('disciplinaryAction'),
            pcpDurationB = component.find('durationBan'),
            pcpReason = component.find('reasonCode'),
            pmakeNotesSec = component.find('petition-makenotes'),
            pmNotes = component.find('makeNoteText'),
            pmaccNotes = component.find('makeNotesCD'),
            pMessageSec = component.find('petition-message'),
            pmLanguage = component.find('msgLanguage'),
            pmEmailMsgTemp = component.find('emailMsgTemplateCMB'),
            pmInGameMsgTem = component.find('inGameMsgTemplate'),
            pAditionalSec = component.find('petition-aditional-actions'),
            padAction = component.find('additionalAction'), //Notes Msgs
            cpamsgSection = component.find('cpamsgSection'),
            makeNotesMsgSection = component.find('makeNotesMsgSection'),
            sendMsg = component.find('sendMsg'),
            addAction = component.find('addlnActnSec'),
            emailingMsgSection = component.find('emailingMsgSection'),
            sectionName = secName || '',
            editPCAClick = component.find('editPCAClick'),
            editMknoteClick = component.find('editMknoteClick'),
            commitButton = component.find('commit_button');
        try {
            //Reset for Paction
            if(!$A.util.hasClass(commitButton, "disableButton")){
                $A.util.addClass(commitButton, "disableButton");
            }
            if (petitionAction && sectionName =='') {
                petitionAction.set('v.value', '');
            }
            $A.util.addClass(cpamsgSection, 'slds-hide');
            $A.util.addClass(makeNotesMsgSection, 'slds-hide');
            $A.util.addClass(emailingMsgSection, 'slds-hide');
            $A.util.addClass(sendMsg, 'slds-hide');
            $A.util.addClass(addAction, 'slds-hide');
            $A.util.addClass(editMknoteClick, 'slds-hide');
            component.set("v.emailMsgTmpl", '');
            component.set("v.inGameMsgTmpl", '');            
            component.set('v.accNote', '');
            component.set('v.caseNote', '');
            // Email-InGame Msg Templ options
            component.set('v.emailTemplateOptions', []);
            // Reset Strikes
            if(strikesSection && sectionName ==''){
                strikesTypeSec.set('v.value','Strike Type');
                component.set('v.strikeOptions',[]);
            }
            if (pmEmailMsgTemp) {
                pmEmailMsgTemp.set('v.value', '');            	
            }
            if (pmInGameMsgTem) {
                pmInGameMsgTem.set('v.value', '');
            }
            //Reset P Content Penalty
            if (pcontentPenaltiesSec && sectionName =='') {                
                $A.util.addClass(editPCAClick, 'slds-hide');
                $A.util.addClass(pcpSection, 'slds-hide');
                $A.util.addClass(pcontentPenaltiesSec, 'disabled-section');
                if (pcpStrike) {
                    pcpStrike.set('v.value', '');
                }                	
                pcpPlevel.set('v.value', '');
                pcpEntitlemnts.set('v.value', '');
                pcpDispAct.set('v.value', '');
                pcpDurationB.set('v.value', '');
                pcpReason.set('v.value', '');            
            }
            //Reset Make Notes
            if (pmakeNotesSec) {
                $A.util.addClass(pmakeNotesSec, 'disabled-section');
                $A.util.addClass(pmaccNotes, 'slds-hide');
                // Check box to uncheck
                var copyContentAcc = component.find('copyContentAcc'),
                    mkNAccSticky = component.find('accNotePinned');
                if (mkNAccSticky) {
                    mkNAccSticky.set('v.value', false);
                }
                if (copyContentAcc) {
                    copyContentAcc.set('v.value', false);
                }
                pmNotes.set('v.value', '');
                component.set('v.accNote', '');
            }
            //Reset P Message Section
            if (pMessageSec) {
                $A.util.addClass(pMessageSec, 'disabled-section');
                pmLanguage.set('v.value', '');
                pmEmailMsgTemp.set('v.value', '');
                pmInGameMsgTem.set('v.value', '');
                $A.util.addClass(pmEmailMsgTemp, 'disabled-section');
                $A.util.addClass(pmInGameMsgTem, 'disabled-section');                
                // TO DO for msg templates
                
            }
            // Reset Adln Section
            if (pAditionalSec) {
                $A.util.addClass(pAditionalSec, 'disabled-section');
                padAction.set('v.value', '');
            }
        }
        catch(err) {};
    },
    // Get auto case Notes
    getAutoCaseNotes: function(component, noteActType) {
        //no violation
        var caseAction = component.get('v.caseAction'),
            getCaseNoteAction = component.get("c.getCaseNotes"),
            caseNAVo = '',
            strContentVO = component.get('v.strContentVO'),
            penaltyVal = this.getValuestoDisplay(component, 'penaltyLevel', 'value', 'penaltyLevels'),
            displAction = this.getValuestoDisplay(component, 'disciplinaryAction', 'value', 'disciplinaryActions'),
            displDuran = this.getValuestoDisplay(component, 'durationBan', 'value', 'durationList'),
            dispReason = this.getValuestoDisplay(component, 'reasonCode', 'value', 'reasonCodesList'),
            regEx = new RegExp("<br>", "g"),
            custDuranCmp = component.find('durationBan');
        
        if (custDuranCmp && custDuranCmp.get('v.value') == 'customDuration') {
            displDuran = component.find('custDurationVal').get('v.value') + ' ' + component.find('customDurationUnit').get('v.value');
        }
        // Checks for Content Actions
        var hideImg = component.find('hideContent'),
            unHideImg = component.find('unHideContent'),
            contentAct = null;
        if (hideImg && hideImg.length) {
            hideImg = hideImg[0];
        }
        if (unHideImg && unHideImg.length) {
            unHideImg = unHideImg[0];
        }	
        if (hideImg && hideImg.get('v.value')) {
            contentAct = 'Hide image content permanantly';
        }
        if (unHideImg && unHideImg.get('v.value')) {
            contentAct = 'Un Hide Image Content';
        }
        
        //THOR-1363 :: Battlefield platoon reports need to have the hide functionality remapped.
        if(hideImg && hideImg.get('v.value') && unHideImg && unHideImg.get('v.value'))
        {
        	contentAct = 'Hide-Unhide Image content';
        }
        
        if (noteActType == 'violation') {
            /*var strikesTypeSelect = component.find('strikesTypeSelect'),
                strikeSection = component.find('strikeSection'),
                strikeSectionVal = '',
                strikesTypeSelectVal = '';
            if (strikesTypeSelect) {
                strikesTypeSelectVal = ' ' + strikesTypeSelect.get('v.value');
            }
            if (strikeSection) {
                strikeSectionVal = strikeSection.get('v.value');
                if (strikeSectionVal) {
                    strikeSectionVal = strikeSectionVal.split(' ')[0];                     
                }
            }*/
            var strikesTypeSelectVal = component.get('v.selectedStrikeMsgName') ? component.get('v.selectedStrikeMsgName') : 'NA';
            var strikeSectionVal = '';
            caseNAVo = {
                "strCaseAction": 'Resolved',
                "strContentAction": contentAct,
                "isAccountAction": true,
                "strStrikeType": strikesTypeSelectVal,
                "strStrikeNum": strikeSectionVal,
                "strPenalty": displAction,
                "strDisciplinary": penaltyVal,
                "strDuration": displDuran,
                "strReason": dispReason
            };
            
        }
        else {
            var queueNameSelected;
            if(caseAction.includes('Resolve')){
                caseAction = "Resolved"; 
                queueNameSelected = null;
            }
            else{
                if(caseAction.includes('Transfer')){
                    caseAction = "Transferred"; 
                }
                if(caseAction.includes('Escalate')){
                    caseAction = "Escalated";
                }
                if(component.get('v.selectedQueue')){
                    queueNameSelected = component.get('v.selectedQueue');
                    if(queueNameSelected.length){
                        queueNameSelected = queueNameSelected[0].Name;}
                }
                else{
                    queueNameSelected = null;
                }
            } 
            caseNAVo = {
                "strCaseAction": caseAction,
                "strContentAction": contentAct
            };
        }
        
        getCaseNoteAction.setParams({"strCaseNotesVO": JSON.stringify(caseNAVo),"queueName":queueNameSelected});
        getCaseNoteAction.setCallback(this, function(response) {
            var state = response.getState(),
                caseNote = response.getReturnValue();
            
            if (caseNote) {
                caseNote = caseNote.replace(regEx, '\n');
                regEx = new RegExp("<br/>", "g");
                caseNote = caseNote.replace(regEx, '\n');
                regEx = new RegExp("&lt;br&gt;", "g");
                caseNote = caseNote.replace(regEx, '\n');
            }                  
            if (state === "SUCCESS") {
                var chatContent = component.get('v.selectedViolationChat');
                //console.log('chatContent====****'+chatContent);
                if (chatContent) {
                    chatContent = 'Chat Content:' + chatContent;
                }
                else {
                    chatContent = '';
                }
                
                var caseNotes = caseNote +'\n'+ chatContent;
                component.set('v.caseNote', caseNotes);               
            }
            else {
                console.log("Error in to get Case Note");
            }
        });
        $A.enqueueAction(getCaseNoteAction);
    },
    
    getPetitionMsgTemplate: function (component) { 
        var action = component.get("c.getPetitionMsgTemplate"),
            productId = component.get('v.simpleCase').ProductLR__r.Id,
            localeId = component.get('v.simpleCase').LocaleLR__c,
            strikeType = component.get('v.selectedStrikeType'),
            strikeSelected = component.get('v.selectedStrike'),
            strikeNumber,
            selectedStrikeMsgName,
            supportedMsgType = component.get("v.supportedMsgType"); 
        if(strikeSelected != "" && strikeSelected != undefined){
            strikeNumber = strikeSelected.substr(0, strikeSelected.indexOf('['));        
            selectedStrikeMsgName = this.setOrdinalOfNumber(component,event,strikeNumber);            
            selectedStrikeMsgName = selectedStrikeMsgName.replace(/\s+/g, '');
            selectedStrikeMsgName = selectedStrikeMsgName + ' ' +strikeType.substring(0, strikeType.length - 1);                  
            action.setParams({
                "strStrike": selectedStrikeMsgName,
                "strLocaleId": localeId,
                "strProduct": productId       
            });
            action.setCallback(this, function(response) {
                var state = response.getState();           
                if (state === "SUCCESS") {
                    var msgTemplate = response.getReturnValue();
                    if(msgTemplate != null && supportedMsgType){
                        if(supportedMsgType.isEmail){
                            component.set('v.emailTemplateVal', msgTemplate.Id);
                            component.set('v.emailMsgTmpl', msgTemplate.Template__c);
                        }
                        if(supportedMsgType.isInGame){
                            component.set('v.inGameTemplateVal', msgTemplate.Id);
                            component.set('v.inGameMsgTmpl', msgTemplate.Template__c);
                        }                   
                    }
                    else{
                        component.set('v.emailTemplateVal', '');
                        component.set('v.emailMsgTmpl', '');
                        component.set('v.inGameTemplateVal', '');
                        component.set('v.inGameMsgTmpl', '');                   
                    }
                }                            
                else{
                    console.log("Failed with state: " + state);
                }
            });
            $A.enqueueAction(action);
        }
    },
    
    acceptAgentWork: function(component,caseId) {        
        var omniAPI = component.find("omniToolkit");
        var agentWorkId;
        omniAPI.getAgentWorks().then(function(result) {
            var works = JSON.parse(result.works);
            var isEngaged;
            for(var i in works){               
                if(works[i].workItemId == caseId.substring(0, 15)){
                    agentWorkId = works[i].workId;
                    component.set("v.workId", works[i].workId);
                    console.log(component.get('v.workId'));
                    isEngaged = works[i].isEngaged;
                    break;
                }
            }            
            if(agentWorkId != undefined) {
                if(!isEngaged){
                    console.log(component.get('v.workId'));                    
                    //change status of agent work to accepted            
                    omniAPI.acceptAgentWork({workId: agentWorkId}).catch(function(error) {
                        console.log(error);                             
                    });
                }
            }                                     
        });														   
    },
    getPenaltyOptions : function(component,event){
        var penaltyOptionAction = component.get("c.getPenaltyActionOptions");
        var caseObj = component.get('v.simpleCase') ? component.get('v.simpleCase') : window.caseObj;
        var caseUpdated = component.get('v.caseObj');
        caseObj.sobjectType='Case';
        
        penaltyOptionAction.setParams({
            "newCaseObj": JSON.stringify(caseObj),
        });
        
        penaltyOptionAction.setCallback(this, function(response) {
            var state = response.getState();
            if(state == "SUCCESS")
            {
                var penaltyOptions = response.getReturnValue();
                var penaltyActions = penaltyOptions.PENALTY_OPTIONS;
                var disciplinaryActions = penaltyOptions.DISCIPLINARY_OPTIONS;
                
                var penaltyBasedOptions =[]; var disciplinaryBasedOptions =[];
                
                for (var i=0; i<penaltyActions.length; i++) 
                {
                    var option = {};
                    option.value = penaltyActions[i];
                    option.label = penaltyActions[i];
                    penaltyBasedOptions.push(option);
                }
                
                for (var i=0; i<disciplinaryActions.length; i++) 
                {
                    var option = {};
                    option.value = disciplinaryActions[i];
                    option.label = disciplinaryActions[i];
                    disciplinaryBasedOptions.push(option);
                }
                component.set('v.penaltyLevels',penaltyBasedOptions);
                component.set('v.disciplinaryActions',disciplinaryBasedOptions);
                
            }else if(state == "ERROR"){
                var penaltyBasedOptions =[]; var disciplinaryBasedOptions =[];
                component.set('v.penaltyLevels',penaltyBasedOptions);
                component.set('v.disciplinaryActions',disciplinaryBasedOptions);
                var errorDetails = response.getError()[0].message;
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    mode: 'pester',
                    duration: '5000',
                    message: errorDetails,
                    type: 'error'
                });
                toastEvent.fire();
                console.log('Error in getting action roles for mass actions');
            }
        });
        //component.set("v.penaltyLevels",
        $A.enqueueAction(penaltyOptionAction);
    },
    
    getCaseActionOptions: function(component,event) {
        var getRolesAction = component.get("c.getRoleWiseCaseActions");
        getRolesAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {  
                var roleBasedOptions = response.getReturnValue();
                var setRoleBasedOptions =[];
                for (var i=0; i<roleBasedOptions.length; i++) {
                    var option = {};
                    option.value = roleBasedOptions[i];
                    option.label = roleBasedOptions[i];
                    if(window.permsList){
                        var actName = option.value.toLowerCase();
                        if (actName.includes('resolve') && window.permsList.includes('resolve')) {
                            option.value = roleBasedOptions[i];
                            option.label = roleBasedOptions[i];
                            setRoleBasedOptions.push(option);
                        }
                        else if (actName.includes('transfer') && window.permsList.includes('transfer')) {
                            option.value = roleBasedOptions[i];
                            option.label = roleBasedOptions[i];
                            setRoleBasedOptions.push(option);
                        }
                            else if (actName.includes('escalate') && window.permsList.includes('escalate')) {
                                option.value = roleBasedOptions[i];
                                option.label = roleBasedOptions[i];
                                setRoleBasedOptions.push(option);
                            }
                                else if (actName.includes('move') && window.permsList.includes('move')) {
                                    option.value = roleBasedOptions[i];
                                    option.label = roleBasedOptions[i];
                                    setRoleBasedOptions.push(option);
                                }
                    }
                }
                //component.set("v.petitionActions", []);
                window.caseActionOptions = setRoleBasedOptions;
                component.set("v.petitionActions", setRoleBasedOptions);
                
            } 
            else{
                console.log('Error in getting action roles for mass actions');
            }
        });
        $A.enqueueAction(getRolesAction);
    },
    
    getRoleBasedQueues: function(component, event) {
        var actionSelected = component.get('v.petitionActionSelected'),
            getRoleQueuesAction = component.get("c.getRoleWiseQueues"),
            showHideQueueDrop = component.find('queueSelectDropdown');
        getRoleQueuesAction.setParams({
            "strCaseAction": actionSelected
        });
        if(!$A.util.hasClass(showHideQueueDrop, 'slds-hide')){
            $A.util.addClass(showHideQueueDrop, 'slds-hide');
        }
        
        getRoleQueuesAction.setCallback(this, function(response) {
            var state = response.getState();
            //var showQueueSelect = component.find('queueSelectDropdown');
            if (state === "SUCCESS") {
                var roleBasedQueues = JSON.parse(response.getReturnValue());
                var queueNames = Object.keys(roleBasedQueues);
                var setRoleBasedQueuesOptions =[ { value: "", label: "Select a queue" }];
                for (var i=0; i<queueNames.length; i++) {
                    //if(!queuesFromModal.includes(queueNames[i]))
                    // {    
                    //alert(queueNames[i]);
                    var option = {};
                    option.label = queueNames[i];
                    option.value = roleBasedQueues[queueNames[i]];
                    setRoleBasedQueuesOptions.push(option);
                    //}
                }
                if(setRoleBasedQueuesOptions.length == 0)
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "message": 'No queues available',
                        "type": "warning"
                    });
                    toastEvent.fire();
                }
                if(setRoleBasedQueuesOptions.length>=1){
                    //petitionOptions.push(setRoleBasedQueuesOptions);
                    component.set('v.queueSelect',"select queue");
                    $A.util.removeClass(showHideQueueDrop, 'slds-hide');
                    component.set('v.queueOptions',setRoleBasedQueuesOptions);
                }
            } 
            else{
                if(!$A.util.hasClass(showHideQueueDrop, 'slds-hide')){
                    $A.util.addClass(showHideQueueDrop, 'slds-hide');
                }
                //var massNoteSection = component.find('massNoteSection');
                //if(!$A.util.hasClass(massNoteSection, 'slds-hide')){
                //    $A.util.addClass(massNoteSection, 'slds-hide');
                // }
                var errorMessage = response.getError()[0].message;
                console.log('Error in getting petition action queues: '+errorMessage);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "message": errorMessage,
                    "type": "error"
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(getRoleQueuesAction);
    },
    
    enableDisable : function(component, event){
        var penaltyLevel = component.find('penaltyLevel').get('v.value');
        var disciplinaryAction = component.find('disciplinaryAction').get('v.value');
        var durationBan = component.find('durationBan').get('v.value');
        var reasonCode = component.find('reasonCode').get('v.value');
        var customDuration = component.find('customDurationUnit').get('v.value');
        var cpactBtn = component.find('cpactBtn');
        var ents =  component.find('productEntitlementsLookup').get('v.listOfSelectedRecords');
        var entSelected = false;
        $A.util.addClass(cpactBtn, 'disabled-section');
        if(!$A.util.isEmpty(penaltyLevel) && !$A.util.isEmpty(disciplinaryAction) && !$A.util.isEmpty(reasonCode)){
            if(penaltyLevel == 'Entitlement'){
                entSelected = true;
            }
            if((disciplinaryAction == 'Suspend' || disciplinaryAction == 'Squelch') && !$A.util.isEmpty(durationBan)) {
                if(durationBan == 'customDuration' && !$A.util.isEmpty(customDuration)){
                    $A.util.removeClass(cpactBtn, 'disabled-section');
                }else if(durationBan == 'customDuration' && $A.util.isEmpty(customDuration)){
                    
                }else if(durationBan != 'customDuration'){
                    $A.util.removeClass(cpactBtn, 'disabled-section');
                }
            }else if((disciplinaryAction == 'Suspend' || disciplinaryAction == 'Squelch') && $A.util.isEmpty(durationBan)) {
                $A.util.addClass(cpactBtn, 'disabled-section');
            }else if(disciplinaryAction != 'Suspend' || disciplinaryAction != 'Squelch' ){
                $A.util.removeClass(cpactBtn, 'disabled-section');
            }
            if(entSelected && $A.util.isEmpty(ents)){
                $A.util.addClass(cpactBtn, 'disabled-section');
            }
        }
    },
    
    getOmniStatus: function(cmp) {
        var omniAPI = cmp.find("omniToolkit");
		var self = this;       
        var promise1 = new Promise(function(resolve, reject){
            resolve(omniAPI.getServicePresenceStatusId());
        }).catch(function(error) {
            console.log(error);
        });
        return promise1;
    },
    
    setStatus: function(component) {
		var omniAPI = component.find("omniToolkit"),
            availableStatusId = component.get('v.availableStatusId');
        omniAPI.setServicePresenceStatus(
            {statusId: availableStatusId}).then(function(result)
           	{
                console.log('Current statusId is: ' + result.statusId);
            }).catch(function(error){
            console.log(error);
        });
    },
    getAvailableStatusId: function(cmp){
         var statusAction = cmp.get("c.getAvailablePresenceStatusId");        
        statusAction.setCallback(this, function(response) {
            var state = response.getState();                
            if (state === "SUCCESS") {
                var statusId = response.getReturnValue();
                cmp.set("v.availableStatusId", statusId.substring(0,15));                 
            }else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(statusAction);
    },
    getReasonCode : function(component, reasonArr, reasonStatus) {
        var reasonCode = reasonArr.find(function(pData, pindex) {
            if (pData.value == reasonStatus) {		                 
                return pData;
            }
        });
        if (reasonCode && reasonCode.label) {
            reasonCode = reasonCode.label.split('-')[1];
        }
        return reasonCode;
    },
})