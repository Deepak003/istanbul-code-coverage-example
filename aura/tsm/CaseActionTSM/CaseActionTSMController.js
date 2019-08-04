({
    /**
     * Initialize component
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    doInit : function(component, event, helper) {
        var caseId = component.get("v.caseId"); //Added as part of crm phone layout TSM-2220
        helper.getCaseDetails(component);
        var outboundEmailVO = component.get("v.outboundEmailVO");
        console.log('from init' + outboundEmailVO);
        helper.populateCaseStatus(component, event, helper);
        helper.populateEmailLocales(component, event, helper);
    },
	
    updateClickToDialNumber : function(component){
        var currentElement = component.find("enterCallBackNumber");
         //TSM-4433
        if(currentElement != undefined){
            if(currentElement.length == undefined){
                if (currentElement.get("v.value")!=""){
                    component.find("callBackNumber").set("v.value",currentElement.get("v.value"));
                    currentElement.setCustomValidity("");                           
                }else{
                    currentElement.setCustomValidity("Invalid phone number");
                }
                currentElement.reportValidity(); //Reporting validity
            }
        }
    },
	
    /**
     * onload get all case status
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    handleCaseStatusChange : function(component, event, helper) {
        component.set("v.showResolution", false);
        component.set("v.showQueue", false);
        component.set("v.selectedCaseQueue", '');
        component.set("v.selectedCaseResolution", '');
        var selectedCaseStatus = component.get("v.selectedCaseStatus");
        switch(selectedCaseStatus) {
          case 'Escalate':          
          case 'Email Transfer (Offline)':
            // Escalate or Email Transfer
                helper.populateCaseQueues(component, event);
                component.set('v.isDuplicateCase', false);
                break;
          case 'Duplicate Case':
                component.set('v.isDuplicateCase', true);
                break;
          case 'Phone Transfer':
          case 'Chat Transfer':
                component.set('v.isDuplicateCase', false);
                break;
          default:
                component.set('v.isDuplicateCase', false);
            // Resolved
            helper.populateCaseResolutions(component, event);
        }
        helper.validateData(component, event);
    },
    /**
     * onchange validate data
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    validateFields : function(component, event, helper) {
		helper.validateData(component, event);
    },
    /**
     * validate once queue changed
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    handleCaseQueueChange : function(component, event, helper) {
		helper.validateData(component, event);
    },
    /**
     * validate once resolution changed
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    handleCaseResolutionChange : function(component, event, helper) {
        helper.validateData(component, event);
    },
    /**
     * handle save case click
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    saveAndGetNext : function(component, event, helper) {
		helper.getKBArticleMessage(component,event);
        helper.checkCaseValidityAndsave(component, event, 'saveAndGetNext');
    },
    /**
     * handle save and create new button click
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    saveAndCreateNew : function(component, event, helper) {
		helper.getKBArticleMessage(component,event);
        helper.checkCaseValidityAndsave(component, event, 'saveAndCreateNew');
    },
    /**
     * handle save and go idle click
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    saveAndGoIdle : function(component, event, helper) {
        helper.getStatus(component, event);
		helper.getKBArticleMessage(component,event);
        helper.checkCaseValidityAndsave(component, event, null);
    },
    /**
     * handle event from presence modal
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    saveGoIdleEvent : function(component, event, helper) {
        helper.handleSaveGoIdleEvent(component, event);
    },
    /**
     * handle event from case deatil section
     * @param {Object} component 
     * @param {Object} event 
     * @param {Object} helper 
     */
    handleCaseDetailEvent : function(component, event, helper) {
        var updateCaseDetail = event.getParam("caseData");
        var caseId = component.get("v.caseId");
        if (updateCaseDetail && caseId == updateCaseDetail.caseId) {
            component.set("v.caseData", updateCaseDetail);
            console.log(JSON.stringify(updateCaseDetail));
        	console.log(caseId);
        }
    },
    //Function handled to remove the article Pill
    handleRemove : function(component, event, helper) {
        var indx = event.getSource().get('v.name');
        var articles =  component.get('v.knowledgeArticles');
        articles.splice(indx,1);
        component.set('v.knowledgeArticles',articles);
    },

    handleDuplicateCase: function(component, event, helper){
        helper.handleDuplicateCase(component);
    },
    saveAndOpenOriginalCase: function(component, event, helper){
        helper.checkCaseValidityAndsave(component, event, 'saveAndOpenOriginal');
    },
	chatTranfer: function(component, event, helper){
        helper.transferChatCase(component, event);
    },
	/*
    updateClickToDialNumber : function(component,event, helper){
        component.find("callBackNumber").set("v.value", component.find("enterCallBackNumber").get("v.value"));
    },
    */
    handleSaveButton: function(component, event, helper){
        const caseData = event.getParam("value") || {};
        
        const product = caseData.productName;
        const platform = caseData.platformGivenName;
        const category = caseData.categoryName;
        const issue = caseData.issueName;
        const subject = caseData.subject;
        
        const isValid = !!product && !!platform && !!category && !!issue && !!subject;        
        component.set('v.isValidCaseData', isValid);
    },
    //TSM-4261 - Case Interaction tab closed case
    onTabClosed : function(component, event, helper) {
        var tabId = event.getParam('tabId');
        var openCaseList = sessionStorage.getItem("advisorOpenCases");
        if (openCaseList) {
            openCaseList = JSON.parse(openCaseList);
            var caseId = openCaseList[tabId];			
            if (caseId) {
                delete openCaseList[tabId];
                sessionStorage.setItem("advisorOpenCases", JSON.stringify(openCaseList));
                helper.populateCaseInteractionTabClosed(component, caseId);
            }            
        }        
    },
})