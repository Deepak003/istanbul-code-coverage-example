({
    getRefundReasonCodes : function(component){
        var action = component.get("c.getRefundReasonCodes"); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse = response.getReturnValue();
            console.log(response.getReturnValue());
            if (state === "SUCCESS") { 
                var result =[];
                for(let i=0; i < storeResponse.length; i++){
                    var resArr={};
                    resArr['label'] = storeResponse[i];
                    resArr['value'] = storeResponse[i];
                    result.push(resArr);
                }
                component.set("v.reasons", result);
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
                    component.set('v.openCancelPreOrder', false);
                }   
            }
        });
        $A.enqueueAction(action);
    },    
    
    confirmCancelPreOrder : function(component) {
        var action = component.get("c.cancelPreOrder");
        var lineItems = [],
            itemsArray = [],
            itemMap = {},
            dataMap= {},
            selectedReason = component.find('reasons').get('v.value'),
            caseId = component.get('v.caseId');
        lineItems = component.get('v.data.lineItems');
        //prepare items map        
        itemMap["id"] = lineItems[0].itemId;
        itemMap["quantity"] = lineItems[0].quantity;
        itemMap["description"] = lineItems[0].description;
        itemMap["productId"] = lineItems[0].productId;
        itemMap["platform"] = lineItems[0].platform;
        itemMap["isMVPRefundable"] = lineItems[0].isMVPRefundable;
        itemMap["isRefundAcceptable"] = lineItems[0].isRefundAcceptable;
        itemMap["isMVPLineItem"] = lineItems[0].isMVPLineItem;       
        itemsArray.push(itemMap);
        dataMap["items"] = itemsArray;
        //prepare request map
        var requestMap ={};
        requestMap["userId"] = component.get('v.data.userId');
        requestMap["accountId"] = component.get('v.accountId');
        //requestMap["customerEmail"] = "cust email";
        requestMap["data"] = JSON.stringify(dataMap);
        requestMap["invoiceId"] = component.get('v.data.invoiceId');
        requestMap["invoiceStatus"] = component.get('v.data.status');
        requestMap["isRefundable"] = component.get('v.data.isRefundable');
        requestMap["refundReasonCode"] = selectedReason;
        requestMap["userActionType"] = "Cancel Pre-Order";
       // requestMap["vcFundLinkCreditInvoiceId"] = 
        action.setParams({
            requestParams : requestMap,
            strCaseId : caseId
        });
        console.log(requestMap);
        component.set("v.isLoading", true);         
        action.setCallback(this, function(response) {
            var state = response.getState(),
                result = response.getReturnValue();
            if (state === "SUCCESS") {                
                console.log(result);                
                component.set("v.isLoading", false);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({                   
                    "message": "Order has been successfully canceled",
                    "type": "success"
                });
                $A.get("e.c:UpdateInvoiceRowEvent")
                .fire();                
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
                }   
            }            
            else{               
                component.set("v.isLoading", false);
                console.log("Failed with state: " + state);
                var toastEvent = $A.get("e.force:showToast");
                 toastEvent.setParams({
                    "message": "Order cancellation failed.",
                     "type" : "error"
                });                
            }
            toastEvent.fire();
            component.set('v.openCancelPreOrder', false);
        });
       $A.enqueueAction(action);        
    }
})