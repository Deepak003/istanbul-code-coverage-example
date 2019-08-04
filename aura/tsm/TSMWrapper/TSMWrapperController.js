({
    doInit: function(component, event, helper) {
		helper.searchDetails(component);
    },
    handleSendOutboundEmailId: function(component,event,helper){
    	var outboundEmailVO = event.getParam('outbountEmailVO');
        console.log('outboundEmailVO >>'+outboundEmailVO);
    	component.set("v.outboundEmailVO",outboundEmailVO);
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
        if (event.getParam('caseId') == component.get('v.recordId')) {
            if (event.getParam("type") == "initialLoad"){
                var newProduct = event.getParam("changedProduct");
                component.set("v.selectedProduct", newProduct); 
                var newPlatform = event.getParam("changedPlatform");
                component.set("v.selectedPlatform", newPlatform); 
                var newCategory = event.getParam("changedCategory");
                component.set("v.selectedCategory", newCategory);
            } else if(event.getParam("type") == "productChange"){
                var newProduct = event.getParam("changedProduct");
                //component.set("v.selectedProduct", newProduct);  
            }
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
    refreshAccountSummary : function(component, event, helper){
        helper.fetchAccountSummary(component,event);
    },
    //tsm 2940
    handleRefreshSessionsTab: function(component, event, helper){
        console.log('TSMWRAPPER grant att',component.get("v.grantAttribute"))
        
        if(component.get("v.grantAttribute"))
        component.set("v.grantAttribute",false);
        else
         component.set("v.grantAttribute",true);
    }
})