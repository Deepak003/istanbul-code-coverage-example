({
    getEmailHistory : function(component){
        var action = component.get("c.getEmailHistory");
        var invoiceId = component.get('v.invoiceId');
        var nucleusId = component.get('v.nucleusId');
        console.log(nucleusId);
        component.set("v.isLoading", true);
        action.setParams({ "strUserID" : nucleusId,
                          "strInvoiceId" : invoiceId }); 
        action.setCallback(this, function(response) {
            var state = response.getState(),
                result = response.getReturnValue();                
            console.log(result);
            if (state === "SUCCESS") {
                component.set("v.isLoading", false);
              if(typeof result.emailHistories != 'undefined')
              {
                if(result.emailHistories.length > 0){                   
                    for(var res of result.emailHistories){                        
                        var tempDate = new Date(res.lastSentDate);                       
                        var trimmedDate = $A.localizationService.formatDateTimeUTC(tempDate, 'MMM/dd/yy');
                        res.lastSentDate = trimmedDate;
                    }
                    component.set('v.emailHistoryList', result.emailHistories);
                }
                else{
                    component.set('v.emptyState', true);
                } 
              }
            }
            else if(state === "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                        toastEvent.setParams({
                            "message":  errors[0].message,
                            "type" : "error"
                        });  
                        console.log("Failed with state: " + state);
                    }
                    toastEvent.fire();
                    component.set('v.openResendInvoice', false);
                }
            }
            else{
                component.set('v.emailHistoryList', null);                
                component.set("v.isLoading", false);
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },

    resendInvoice : function(component) {
        var action = component.get("c.resendInvoice");        
        var invoiceId = component.get('v.invoiceId'),
            nucleusId = component.get('v.nucleusId'),
			caseId = component.get("v.caseId"),
            emailHistoryList = component.get('v.emailHistoryList'),         
            resendHistoryList = component.get('v.resendHistoryList'),
            historyIdList = [],
            multipleRecipents = false;          
            component.set("v.isLoading", true);
        for(var res of resendHistoryList){
            historyIdList.push(res.emailHistoryId);
            var previousRecipent;            
            if(!previousRecipent){
                previousRecipent = res.recipient;
            }
            else if(previousRecipent != res.recipient){
                multipleRecipents = true;
            }
        }
        action.setParams({ "strCaseID" : caseId,
                          "strCustomerId" : nucleusId,
                          "lstmailIds" : historyIdList }); 
        action.setCallback(this, function(response) {
            var state = response.getState(),
                result = response.getReturnValue();                
            console.log(result);
             var toastEvent = $A.get("e.force:showToast");
            if (state === "SUCCESS") {
                component.set("v.isLoading", false);
                var recipients;
                if(multipleRecipents == true){
                    recipients = 'multiple emails';
                }
                else{
                    recipients = emailHistoryList[0].recipient;
                }                
                toastEvent.setParams({                   
                    "message": "Invoice was sent to " + recipients,
                    "type": "success"
                });            
            }
            else{              
                component.set("v.isLoading", false);
                 toastEvent.setParams({
                    "message": "Invoice was not sent. Please try again",
                     "type" : "error"
                });  
                console.log("Failed with state: " + state);
            }
            toastEvent.fire();
            component.set('v.openResendInvoice', false);
        });
       $A.enqueueAction(action); 
    }
})