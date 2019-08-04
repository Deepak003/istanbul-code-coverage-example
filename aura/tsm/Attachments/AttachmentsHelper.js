({
    getAttachments : function(component, event, helper) {
          
           var action = component.get("c.getAttachmentsForCase");         
           action.setParams({
                   caseId : component.get("v.caseId")
              });
           action.setCallback(this, function(response) {
           var state = response.getState();
           if (state === "SUCCESS") {
               var spinnerCmp = component.find("attachmentSpinner");
               $A.util.removeClass(spinnerCmp, "slds-show");
               $A.util.addClass(spinnerCmp, "slds-hide");
               var storeResponse = response.getReturnValue();
               component.set("v.attachmentDetails", storeResponse);
           }
       });
       $A.enqueueAction(action);
   }
})