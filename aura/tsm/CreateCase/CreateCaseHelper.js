({
    createCase : function(component) {
        var simpleCase = component.get("v.case");
        const newCase = {},      
            spinner = component.find("spinner");
        
        // preparing data
        newCase.accountId = component.get("v.accountId");
        newCase.nucleusId = component.get("v.nucleusId");
        
        if(simpleCase.product)
            newCase.productId = simpleCase.productId;
        if(simpleCase.platform)
            newCase.platformId = simpleCase.platformId;
        if(simpleCase.category)
            newCase.categoryId = simpleCase.categoryId;
        if(simpleCase.subCategory)
            newCase.issueId = simpleCase.issueId;
        if(component.get("v.subject")){
            newCase.subject = component.get("v.subject").slice(0, 255);
        }
        newCase.status="New";
        const request = { "strCaseDetailAuraVO" : JSON.stringify(newCase) };
        
        const action = component.get("c.saveCase");        
        action.setParams(request);
        
        // backend call
        $A.util.toggleClass(spinner, "slds-hide");
        action.setCallback(this, function(response) {
            $A.util.toggleClass(spinner, "slds-hide");
            var state = response.getState();            
            if (state === "SUCCESS") {                
                // open new case in new tab
                const workspaceAPI = component.find("workspace");
                const recordId = response.getReturnValue();
                workspaceAPI.openTab({
                    url: '/lightning/r/Case/'+recordId+'/view',
                    focus: true
                }).then(console.log).catch(console.error);
            }
            else {
                console.log(state);
            }
        });
        $A.enqueueAction(action);
    },
    //gets all products function used for lookup - Product
    getAllProduct: function (component, event) {
        var action = component.get("c.getAllProducts"); 
        var self = this;
        action.setCallback(self, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var allProducts = response.getReturnValue();            
                component.set("v.allProducts", allProducts);
            }
        });
        $A.enqueueAction(action);
    },
    //gets all platforms function used for lookup - Platform
    getPlatformsByProduct: function (component) {
        var action = component.get("c.getPlatformsByProduct"); 
        var caseObject = component.get("v.case");
        component.set("v.isLoading", true);
        var self = this;
        action.setParams({
            strProductId: caseObject.productId
        });
        action.setCallback(self, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var responsePlatfrom = response.getReturnValue();            
                component.set("v.platformData", responsePlatfrom);
                console.log(responsePlatfrom);
                component.set("v.platformDisable",false);
                component.set("v.isLoading", false);
                
            }
        });
        $A.enqueueAction(action);
    },
    //gets all platforms function used for lookup - Platform
    getCategoriesForProduct: function (component) {
        var action = component.get("c.getCategoriesForProduct"); 
        var caseObject = component.get("v.case");
        component.set("v.isLoading", true);
        var self = this;
        action.setParams({
            strProductId: caseObject.productId
        });
        action.setCallback(self, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var responseCategory = response.getReturnValue();            
                component.set("v.categoryData", responseCategory);
                console.log(responseCategory);
                component.set("v.categoryDisable",false);
                component.set("v.isLoading", false);
            }
        });
        $A.enqueueAction(action);
    },
    //gets all sub categories function used for lookup - Platform
    getSubCategoriesForCategory: function (component) {
        var action = component.get("c.getSubCategoriesForCategory"); 
        var caseObject = component.get("v.case");
        component.set("v.isLoading", true);
        var self = this;
        action.setParams({
            categoryId: caseObject.categoryId
        });
        action.setCallback(self, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var responseSubCategory = response.getReturnValue();            
                component.set("v.issueData", responseSubCategory);
                console.log(responseSubCategory);
                component.set("v.issueDisable",false);
                component.set("v.isLoading", false);
            }
        });
        $A.enqueueAction(action);
    },
    getCaseDetails : function(component) {
        const caseNumber = component.get('v.selectedActiveCase');
        const action = component.get("c.getCaseByNumber");
        action.setParams({
            caseNumber: caseNumber
        });     
        action.setCallback(this, function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.currentCase",response.getReturnValue());
                //Setting the id to the case
                component.set("v.selectedWorkingCase", response.getReturnValue().caseId);
            }
        });
        $A.enqueueAction(action);
    }
})