({
    doInit: function(component, event, helper) {  
        helper.getAllProduct(component); //Added for lookup
        helper.getCaseDetails(component); 
        helper.getTags(component); 
        //Removing the margin if the wrapper is chat
        if(!component.get('v.isCase')){
            $A.util.removeClass(component.find('marginLargeDiv'), 'slds-m-around_large'); 
        }
        // TSM-3233: giving time to render CaseActionTSM component to handle application event     
        setTimeout($A.getCallback(()=>helper.caseDetailModified(component, event)),3000);
    }, 
    // Adding Functions related to TSM-2983
    CaseDetailStatusChange:function (component, event, helper) {
        console.log('CaseDetailStatusChange');
        var productName =component.get("v.simpleCase.productName");
        var subject =component.get("v.simpleCase.subject");
        var platformGivenName =component.get("v.simpleCase.platformGivenName");
        var categoryName =component.get("v.simpleCase.categoryName");
        var issueName =component.get("v.simpleCase.issueName");
        if(productName == '' || productName == null)
            component.set("v.simpleCase.productName", 'Unavailable');
        if(subject == '' || subject == null)
            component.set("v.simpleCase.subject" , 'Player not available');
        if(platformGivenName == '' || platformGivenName == null)
            component.set("v.simpleCase.platformGivenName", 'Unavailable');
        if(categoryName == '' || categoryName == null)
            component.set("v.simpleCase.categoryName", 'Unavailable');
        if(issueName == '' || issueName == null)
            component.set("v.simpleCase.issueName", 'Unavailable');
        
        helper.caseDetailModified(component, event);
    },
    handleSelect: function (component, event, helper) {
        
        var actionValue = event.getParam("value");
        if(actionValue == 'Edit'){
            helper.makeFormFieldsEditable(component);
        }
    },
    lockAttachments:function(component, event, helper){
        helper.lockAttachments(component);
    },
    unlockAttachments:function(component, event, helper){
        helper.unlockAttachments(component);
    },
    updateProduct: function(component, event, helper) {
        var productSnapshotEvent = $A.get("e.c:ProductSnapShotAction"),
            product = event.getParam('value');
      if (product && product.Id != null) 
       {
            productSnapshotEvent.setParams({ "type" : 'product' });
            productSnapshotEvent.setParams({ "changedProduct" : product });
            productSnapshotEvent.setParams({ "caseId": component.get('v.recordId') });
            productSnapshotEvent.fire();
        }
    },
     handleBubbling : function(component, event, helper) {
         var firedLookupType = event.getParam('type');
         var simpleCase = component.get("v.simpleCase");
         if(firedLookupType == "Product"){
                 //Closing platform
                 simpleCase.productId = event.getParam('Id');
                 //simpleCase.productName = event.getParam('Name');
                 simpleCase.productUrl = "";
                 
                 simpleCase.platformGivenName = "";
                 simpleCase.platformName = "";
                 component.set("v.platformDisable",true);
                 component.set("v.platformData",[]);
                 
                 simpleCase.categoryName = "";
                 component.set("v.categoryData",[]);
                 component.set("v.categoryDisable",true);
             
                 simpleCase.issueName = "";
                 component.set("v.issueData",[]);
                 component.set("v.issueDisable",true);
                 
                 component.set("v.simpleCase", simpleCase);
                 helper.caseDetailModified(component, event);
               if(!event.getParam('isEmpty')){  
                 helper.getPlatformsByProduct(component); 
                 helper.getCategoriesForProduct(component);
               }
         }else if(firedLookupType == "Platform"){
         	 simpleCase.platformId = event.getParam('Id');
             component.set("v.simpleCase", simpleCase); // also updated as part of TSM-3638
             helper.caseDetailModified(component, event);
             /*simpleCase.categoryName = "";
             component.set("v.categoryData",[]);
             component.set("v.categoryDisable",true);
             
             simpleCase.issueName = "";
             component.set("v.issueData",[]);
             component.set("v.issueDisable",true);
             
             component.set("v.simpleCase", simpleCase);
             if(!event.getParam('isEmpty')){
                helper.getCategoriesForProduct(component);
             }*/
         }else if(firedLookupType == "Category"){
             simpleCase.issueName = "";
             component.set("v.issueData",[]);
             component.set("v.issueDisable",true);
             
             simpleCase.categoryId = event.getParam('Id');
             component.set("v.simpleCase", simpleCase);
             helper.caseDetailModified(component, event);
             if(!event.getParam('isEmpty')){
                helper.getSubCategoriesForCategory(component);
             }
         }
         //TSM-3638 - start
         else if(firedLookupType == "Issue"){
             simpleCase.issueId = event.getParam('Id');
             component.set("v.simpleCase", simpleCase);
             helper.caseDetailModified(component, event);
         } // TSM-3638 - end
         
    },
    caseDetailUpdated:function(component, event, helper){
        helper.caseDetailModified(component, event);
    }
})