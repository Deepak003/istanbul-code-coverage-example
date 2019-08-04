({
    getRefundReasons : function(component){
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
        });
        $A.enqueueAction(action);
    },    
    confirmRefund : function(component) {
        var refundType = component.get("v.refundModalTitle");
        switch(refundType) {
          case 'Refund':
          case 'Queue Refund':
            this.confirmPartialRefund(component);
            break;
          case 'G3 Refund':
            this.confirmG3Refund(component);
        }
    },
    confirmPartialRefund : function(component) {
        var action = component.get("c.processRefund");
        var refundReason = component.get("v.refundReason");
        var invoiceData = component.get('v.data');
        var caseId = component.get('v.caseId');
        var dataObject = {};
        var lineItemsArray = [];
        var requestObject = {};
        for(var key in  invoiceData.lineItems){
            if(invoiceData.lineItems[key].isChecked){
                var lineItemObject = {};
                lineItemObject.id = invoiceData.lineItems[key].itemId;
                lineItemObject.quantity = invoiceData.lineItems[key].quantity;
                lineItemObject.description = invoiceData.lineItems[key].description;
                lineItemObject.productId = invoiceData.lineItems[key].productId;
                lineItemObject.platform = invoiceData.lineItems[key].platform;
                lineItemObject.isMVPRefundable = invoiceData.lineItems[key].isMVPRefundable;
                lineItemObject.isRefundAcceptable = invoiceData.lineItems[key].isRefundAcceptable;
                lineItemObject.isMVPLineItem = invoiceData.lineItems[key].isMVPLineItem; 
                lineItemObject.amount = invoiceData.lineItems[key].formItemRefundTotal;
                lineItemObject.tax = invoiceData.lineItems[key].tax;
                lineItemsArray.push(lineItemObject);
            }
        }
        dataObject.items = lineItemsArray;
        requestObject.data = JSON.stringify(dataObject);
        requestObject.currency = invoiceData.currencyName;
        requestObject.billingAccountId = invoiceData.billingAccountId;
        requestObject.invoiceId = invoiceData.invoiceId;
        requestObject.customerId = invoiceData.userId;// TSM-2246
        requestObject.caseId = caseId;
        requestObject.invoiceStatus = invoiceData.status;
        requestObject.isRefundable = invoiceData.isRefundable;
        requestObject.refundReasonCode = refundReason;
        requestObject.accountId = component.get('v.accountId');
        requestObject.userActionType = "Partial Refund";        
        
        action.setParams({
            Parameters : requestObject
        });

        component.set("v.isLoading", true);         
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                this.handleSuccess(component);              
                const invoiceId = JSON.parse(response.getReturnValue()).response.invoiceUri.substr(10);
                component.getEvent("onRefund").setParams({invoiceId: invoiceId}).fire();
            } else {
                component.set("v.isLoading", false);
                var toastEvent = $A.get("e.force:showToast");
                var errors = response.getError();
                if (errors[0] && errors[0].message) {
                    toastEvent.setParams({
                        "message": errors[0].message,
                         "type" : "error"
                    });
                } else {
                    toastEvent.setParams({
                        "message": "Refund failed.",
                         "type" : "error"
                    });
                }
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    confirmG3Refund : function(component) {
        var action = component.get("c.processMVPRefund");
        var invoiceData = component.get('v.data');
        var caseId = component.get('v.caseId');
        var dataObject = {};
        var lineItemsArray = [];
        var requestObject = {};
        for(var key in  invoiceData.lineItems){
            var lineItemObject = {};
            lineItemObject.id = invoiceData.lineItems[key].itemId;
            lineItemObject.quantity = invoiceData.lineItems[key].quantity;
            lineItemObject.description = invoiceData.lineItems[key].description;
            lineItemObject.productId = invoiceData.lineItems[key].productId;
            lineItemObject.platform = invoiceData.lineItems[key].platform;
            lineItemObject.isMVPRefundable = invoiceData.lineItems[key].isMVPRefundable;
            lineItemObject.isRefundAcceptable = invoiceData.lineItems[key].isRefundAcceptable;
            lineItemObject.isMVPLineItem = invoiceData.lineItems[key].isMVPLineItem; 
            lineItemObject.amount = invoiceData.lineItems[key].amount;
            lineItemObject.tax = invoiceData.lineItems[key].tax;
            lineItemsArray.push(lineItemObject);
        }
        dataObject.items = lineItemsArray;
        requestObject.currency = invoiceData.currencyName;
        requestObject.data = JSON.stringify(dataObject);
        requestObject.billingAccountId = invoiceData.billingAccountId;
        requestObject.invoiceId = invoiceData.invoiceId;
        requestObject.customerId = invoiceData.userId;
        requestObject.caseId = caseId;
        requestObject.accountId = component.get('v.accountId');
        requestObject.invoiceStatus = invoiceData.status;
        requestObject.isRefundable = invoiceData.isRefundable;
        requestObject.refundReasonCode = '';
        requestObject.userActionType = "G3 Refund";
        
        action.setParams({
            Parameters : requestObject
        });

		component.set("v.isLoading", true);         
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {                
                this.handleSuccess(component);              
                //const invoiceId = JSON.parse(response.getReturnValue()).response.invoiceUri.substr(10);
                var refundResponse = JSON.parse(response.getReturnValue()).response;
                const invoiceId = refundResponse.invoiceId;
				component.getEvent("onRefund").setParams({invoiceId: invoiceId}).fire();
            } else {
                component.set("v.isLoading", false);
                var toastEvent = $A.get("e.force:showToast");
                var errors = response.getError();
                if (errors[0] && errors[0].message) {
                    toastEvent.setParams({
                        "message": errors[0].message,
                         "type" : "error"
                    });
                } else {
                    toastEvent.setParams({
                        "message": "Refund failed.",
                         "type" : "error"
                    });
                }
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    handleSuccess: function(component) {
        var refundType = component.get("v.refundModalTitle");
        var toastEvent = $A.get("e.force:showToast");
        if (refundType == 'Queue Refund') {
            toastEvent.setParams({                   
                "message": "Refund has been queued.",
                "type": "success"
            });
        } else {
            toastEvent.setParams({                   
                "message": "A refund has been successfully processed.",
                "type": "success"
            });
        }
        toastEvent.fire();
        component.set('v.showRefundModal', false);
    },
    /*
    getInvoiceDetailsById : function(component){
        var action = component.get("c.getInvoiceDetailsById");
        var invoiceId = component.get('v.data.invoiceId');
        var refundType = component.get("v.refundModalTitle");
        action.setParams({
            strInvoiceId : invoiceId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse = [];
            storeResponse = response.getReturnValue();
            component.set("v.isLoading", false);
            if (state === "SUCCESS") {
                var invoiceRow = storeResponse[0]; 
                component.set("v.data", invoiceRow);
                var toastEvent = $A.get("e.force:showToast");
                if (refundType == 'Queue Refund') {
                     toastEvent.setParams({                   
                    	"message": "Refund has been queued.",
                    	"type": "success"
                	});
                } else {
                     toastEvent.setParams({                   
                    	"message": "A refund has been successfully processed.",
                    	"type": "success"
                	});
                }
                toastEvent.fire();
                component.set('v.showRefundModal', false);
            }
        });
        $A.enqueueAction(action);
    },
    */
    itemRowClicked : function (component, event) { 
        this.updateTotal(component);
    },
    refundAmountTypeChange : function (component, event) {    
        this.refundAmountChange(component, event);     
    },
    reasonChange : function (component, event) {               
        //var rowCheckBoxId = event.currentTarget.getAttribute('data-id');    
        //var data = component.get("v.data");
        //data.lineItems[rowCheckBoxId].formRemoveAssociatedContent = true;
        //component.set("v.data",data);
        this.validateAll(component);
    },
    refundAmountChange : function (component, event) {               
        var rowCheckBoxId = event.currentTarget.getAttribute('data-id');    
        var data = component.get("v.data");
        var refundType = data.lineItems[rowCheckBoxId].formRefundAmountType;
        var refundValue = data.lineItems[rowCheckBoxId].formRefundAmount;
        var totalRefund = 0;
        this.updateItemTotal(component, data, rowCheckBoxId, refundValue, refundType);
        this.updateTotal(component);
    },
    validateAll : function (component) {  
        var allValid = component.get("v.allItemValid");
		var reasonSelected = this.validateReasonCode(component);
        if (reasonSelected && allValid) {
            component.set('v.disableRefundButton', false);
        } else {
            component.set('v.disableRefundButton', true);
        }
    },
    updateTotal : function (component) {  
        var data = component.get("v.data");
        var items = component.find('row-checkbox');
        var totalRefundSum = 0;
        var itemChecked = false;
        var isValid = false;
        var reasonSelected = this.validateReasonCode(component);
        var validityCheck = [];
        if (items.length > 1) {
            for(var key in items){
                isValid = false;
                itemChecked = items[key].get("v.checked");
                isValid = this.validateItem(component, data, items, key);
                validityCheck.push(isValid);
                totalRefundSum += (itemChecked && isValid) ? +Number(data.lineItems[key].formItemRefundTotal) : 0;
            }
        } else {
            itemChecked = items.get("v.checked");
            isValid = this.validateItem(component, data, items, 0);
            validityCheck.push(isValid);
            totalRefundSum += (itemChecked && isValid) ? +Number(data.lineItems[0].formItemRefundTotal) : 0;
        }

        var allValid = validityCheck.reduce(function(acc, val){return acc && val;});
        component.set("v.allItemValid",allValid);
        component.set("v.totalRefund",totalRefundSum.toFixed(2));
        this.validateAll(component);
    },
    validateReasonCode : function (component) {               
        var refundCombo = component.find('refundReason');
		var refundReason  = refundCombo.get("v.value");
        component.set("v.refundReason",refundReason);
        if (refundReason != '') {
            return true;
        } else {
            return false;
        }
    },
    updateItemTotal : function (component, data,  rowCheckBoxId, refundValue, refundType) {               
        if(isNaN(refundValue)){
           console.log('not a number');
        }else{
            if(refundType == 'percent'){
            	data.lineItems[rowCheckBoxId].formItemRefundTotal = Number((refundValue*data.lineItems[rowCheckBoxId].subtotal) / 100).toFixed(2);  
            } else {
                data.lineItems[rowCheckBoxId].formItemRefundTotal = Number(refundValue).toFixed(2);
            }
        }
    },
    validateItem : function (component, data, items, key) {               
        var allItems = component.find('refundAmount');
        var isValid = false ;
        //var isValid = (typeof allItems !== "undefined") ? true : false ;
        var refundType = data.lineItems[key].formRefundAmountType;
        var refundValue = Number(data.lineItems[key].formRefundAmount);
        var listSubtotal = Number(data.lineItems[key].subtotal);
        var input = (Array.isArray(allItems)) ? allItems[key] : allItems;
        if(!isValid && isNaN(refundValue)) {
            component.set('v.disableRefundButton', true);
        }

        if(typeof input !== "undefined" && !isNaN(refundValue)) {
            isValid = false;
            if(refundValue == 0){
                input.setCustomValidity("");
                isValid = false;
            } else if(refundType == 'percent' && refundValue > 100){
                input.setCustomValidity("Can't exceed 100%");
                isValid = false;
            } else if (refundType == 'currency' && refundValue > listSubtotal) {
                input.setCustomValidity("Can't exceed max amount");
                isValid = false;
            } else {
                isValid = true;
                input.setCustomValidity("");
            }
            input.reportValidity();
        }
        return isValid;
    }
})