({
    getCaseDetails : function(component) {
        const action = component.get("c.getCase");
        action.setParams({
            caseId: component.get("v.caseId")
        });     
        action.setCallback(this, function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                var caseObj = response.getReturnValue();
                component.set("v.simpleCase",caseObj);
                var productSnapshotEvent = $A.get("e.c:ProductSnapShotAction");
                productSnapshotEvent.setParams({ "type" : 'initialLoad' });
                productSnapshotEvent.setParams({ "changedProduct" : {
                    Id: caseObj.productId,
                    Name: caseObj.productName,
                    Url_Name__c: caseObj.productUrl,
                    studio:caseObj.studio,
					isMobile__c :caseObj.isMobile
                } });
               productSnapshotEvent.setParams({ "changedPlatform" : {
                   Id: caseObj.platformId ,
                   Name: caseObj.platformName, 
                   InternalName__c: caseObj.platformName
                } });
               productSnapshotEvent.setParams({ "changedCategory" : {
                    Id: caseObj.categoryId  ,
                    Name: caseObj.categoryName 
                } });
                productSnapshotEvent.setParams({"caseId" : component.get('v.caseId')});
                productSnapshotEvent.fire();
                //Fire next event's
                this.getPlatformsByProduct(component);
                this.getCategoriesForProduct(component);
                this.getSubCategoriesForCategory(component);
                component.set("v.isLoading", false);
            }
            else {
                component.set("v.isLoading", false);
                //check how to handle aurahandledexception 
                //keep common error modal componet for error messages
            }
        });
        $A.enqueueAction(action);
        
    },
    getTags : function(component) {
        const actionTag = component.get("c.getAllCaseTagsForCase");
        actionTag.setParams({
            caseId: component.get("v.caseId")
        });

        actionTag.setCallback(this, function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.tagRecs",response.getReturnValue());
            }
            else {
                
            }
        });
        $A.enqueueAction(actionTag);
    },
    makeFormFieldsEditable: function(component){
        component.set("v.Editable",false);
    },
    lockAttachments:function(component){
        this.showSpinner(component);
        const actionLockAttachments = component.get("c.toggleLockUnlockAttachments");

        actionLockAttachments.setParams({
            caseId: component.get("v.caseId"),
            isLocked: true
        });

        actionLockAttachments.setCallback(this, function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                var caseObj = component.get("v.simpleCase");
                caseObj.isAttachementLocked = true;
                component.set("v.simpleCase",caseObj);
                this.hideSpinner(component);
            }
            else {
                
            }
        });
        $A.enqueueAction(actionLockAttachments);
    },
    unlockAttachments:function(component){
        this.showSpinner(component);
        const actionUnlockAttachments = component.get("c.toggleLockUnlockAttachments");
        actionUnlockAttachments.setParams({
            caseId: component.get("v.caseId"),
            isLocked: false
        });

        actionUnlockAttachments.setCallback(this, function(response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                var caseObj = component.get("v.simpleCase");
                caseObj.isAttachementLocked = false;
                console.log('caseObj'+caseObj.isAttachementLocked);
                component.set("v.simpleCase",caseObj);
                this.hideSpinner(component);
            }
            else {
                
            }
        });
        $A.enqueueAction(actionUnlockAttachments);
    },
    showSpinner:function(component){
        var spinnerCmp = component.find("lockSpinner");
        $A.util.removeClass(spinnerCmp, "slds-hide");
        $A.util.addClass(spinnerCmp, "slds-show");
    },
    hideSpinner:function(component){
        var spinnerCmp = component.find("lockSpinner");
        $A.util.removeClass(spinnerCmp, "slds-show");
        $A.util.addClass(spinnerCmp, "slds-hide");
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
        var caseObject = component.get("v.simpleCase");
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
        var caseObject = component.get("v.simpleCase");
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
        var caseObject = component.get("v.simpleCase");
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
    caseDetailModified:function(component, event){
        var simpleCase = component.get("v.simpleCase");
        var caseEvent = $A.get("e.c:CaseDetailEvent");
        caseEvent.setParams({ "caseData" : simpleCase });
        caseEvent.fire();

    }
})