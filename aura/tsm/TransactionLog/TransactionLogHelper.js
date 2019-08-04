({
    getTransactionLogs : function(component) {
        var action = component.get("c.getTransactionLogsByInvoiceId");
        var invoiceId = component.get('v.invoiceId');
        component.set("v.isLoading", true);
        action.setParams({ "strInvoiceId" : invoiceId }); 
        action.setCallback(this, function(response) {
            var state = response.getState(),
                result = response.getReturnValue();                
            console.log(result);
            if (state === "SUCCESS") {
                component.set("v.isLoading", false);
                if(result != null && result.length > 0){                   
                    for(var res of result){                        
                        var tempDate = new Date(parseInt(res.invoiceEventDate));                       
                        var trimmedDate = $A.localizationService.formatDateTimeUTC(tempDate, 'MMM/dd/yy hh:mma UTC');
                        res.invoiceEventDate = trimmedDate;
                        if(res.invoiceEventPropertySetList.purchaseTime){
                            var purchaseDate = $A.localizationService.formatDateTimeUTC(new Date(res.invoiceEventPropertySetList.purchaseTime), 'MMM/dd/yy hh:mma UTC');
                            res.invoiceEventPropertySetList.purchaseTime = purchaseDate;
                        }                       
                    }
                    component.set('v.transactionLogList', response.getReturnValue());
                }
                else{
                    component.set('v.emptyState', true);
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
                    component.set('v.openTransactionLogs', false);
                }   
            }
            else{
                component.set('v.transactionLogList', null);
                component.set("v.isLoading", false);
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);       
    }
})