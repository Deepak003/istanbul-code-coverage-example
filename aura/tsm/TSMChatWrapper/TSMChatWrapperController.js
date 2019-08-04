({
    doInit: function(component, event, helper) { 
		helper.searchDetails(component);
    },
    handleOpenCase:function(component, event, helper){
        component.set("v.selectedTab","four");
    },
    handleOpenSession:function(component, event, helper){
        component.set("v.selectedTab","two");
        //Firing event to open Account login
        component.set("v.selectedAccountSubTab","two");
    },
    handleOpenAccount:function(component, event, helper){
        component.set("v.selectedTab","two");
        //Firing event to open Account notes
        component.set("v.selectedAccountSubTab","three");
    },
    currentProductChange: function(component, event, helper) {
        if(event.getParam("type") == "initialLoad"){
            var newProduct = event.getParam("changedProduct");
            component.set("v.selectedProduct", newProduct); 
            var newPlatform = event.getParam("changedPlatform");
            component.set("v.selectedPlatform", newPlatform); 
            var newCategory = event.getParam("changedCategory");
            component.set("v.selectedCategory", newCategory);
        } else if(event.getParam("type") == "productChange"){
            var newProduct = event.getParam("changedProduct");
           // component.set("v.selectedProduct", newProduct);  
        }
    },
    onAov: function (component, event, helper) {
        //const emailObj = component.get("v.aovEmailObj");
        const emailObj = event.getParam('emailObj');
        const accountSnapDetails = component.get('v.accountSnapDetails');
        if(accountSnapDetails && emailObj && emailObj.email) {
            accountSnapDetails.tfaDateFormatting = new Date();
            accountSnapDetails.aovVerifiedType = "with Email";
            accountSnapDetails.device = emailObj.email;
            accountSnapDetails.deviceType = "6 digit pin";
            accountSnapDetails.deviceIpGeo = "advisor input";
            accountSnapDetails.isAovVerified = true;
            accountSnapDetails.isUnAuthenticated = false; //TSM-4044 - Removing unauth on verification
            component.set('v.accountSnapDetails', accountSnapDetails);
        }        
    },
    
    onAgentSend: function(component, event, helper) {
        var advisorId = $A.get("$SObjectType.CurrentUser.Id");
        var caseId = component.get('v.caseObj').Id;
        var isAgentIdUpdated = component.get("v.isAgentIdUpdated");
         if (!isAgentIdUpdated) {
             helper.updateAgentId(component,event, advisorId, caseId);
                component.set("v.isAgentIdUpdated", true);
         }
    },
    refreshAccountSummary:function(component, event, helper) {
        helper.fetchAccountSummary(component,event);
    },
    onRender: function(component, event, helper) {
        component.getElement().addEventListener('chatTransferEvent', function() {
			if (component.get('v.isChatTransferRender')) {
                component.set('v.transferCase', true);
            	console.log('chat transfered');
            }
			component.set('v.isChatTransferRender', true);
		})
    }
})