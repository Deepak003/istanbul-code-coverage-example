({
    doInit: function(component, event, helper) {
		 
        let myPageRef = component.get("v.pageReference");
        if(myPageRef){
            component.set("v.recordId",myPageRef.state.c__sfAccountId);
            if (myPageRef.state.c__archivedCaseId) {
                component.set("v.archivedCaseId",myPageRef.state.c__archivedCaseId);   
                component.set("v.selectedTabId", "three");
                helper.addArchiveTabLabel(component,event, myPageRef.state.c__archivedCaseId); 
            }
        }
        helper.searchNucleusId(component,event);
    },
    
    //TSM-3250 - Function to open the selected product list
    openProductSelectDialog:function(component, event, helper){
        component.set("v.openProductChange", true);
    },
    
    //TSM-2521 - Added for case account connection
    onCaseChange: function(component, event, helper){
        var selectedActiveCase = component.get("v.selectedActiveCase");
        //Setting case ID as the selected case id
        component.set("v.caseId", selectedActiveCase);
        var verificationState = component.get("v.accountSnapDetails").isAovVerified;
        component.set("v.isCaseLinkedDisable", false); //TSM-3386
        component.set("v.actionDisable", verificationState);
    },
    handleOpenCase:function(component, event, helper){
        component.set("v.selectedTabId","three");
    },
    handleOpenSession:function(component, event, helper){
        //Firing event to open Account login
        component.set("v.selectedTab","two");
    },
    handleOpenAccount:function(component, event, helper){
        //Firing event to open Account notes
        component.set("v.selectedTab","three");
    },
    refreshAccountSummary :function(component, event, helper) {
        helper.fetchAccountSummary(component,event);
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
})