({
    pullData: function(component) {
        const action = component.get("c.fetchProratedAmount");
        action.setParams({ userId: component.get('v.nucleusId') });
        
        component.set("v.isLoading", true);
        action.setCallback(this, function(response) {
            component.set("v.isLoading", false);
            
            const totalAmount = component.get('v.data.total');
            const currencySymbol = component.get('v.data.currencySymbol');
            const currencyName = component.get('v.data.currencyName');
            const options = [];
            
            const state = response.getState();
            console.log('component.get("v.subscriptionType") :: ' + component.get("v.subscriptionType"));
            if (state === "SUCCESS") {
                const prorationAmount = (response.getReturnValue() || {}).prorationAmount;                
                if(component.get("v.subscriptionType") == 'Nucleus'){
                    options.push({label: `Full Refund - ${currencySymbol || currencyName}${totalAmount}`, value: "2"});   
                    component.set('v.defaultSelected', '2');
                }
                else{
                    options.push({label: `Prorated Refund - ${currencySymbol || currencyName}${prorationAmount}`, value: "1"});
                    options.push({label: `Full Refund - ${currencySymbol || currencyName}${totalAmount}`, value: "2"});     
                }
            }else {
                //Util.handleErrors(component, response);
                options.push({label: `Full Refund - ${currencySymbol || currencyName}${totalAmount}`, value: "2"});
                component.set('v.defaultSelected', '2');
            }
            component.set("v.options", options);
        });
        $A.enqueueAction(action);
    },
    doFullRefund: function(component){
        const action = component.get("c.refundFullInvoice");
        var mapRequestParams = {};
        mapRequestParams["invoiceId"] = component.get("v.data.invoiceId");
        mapRequestParams["billingAccountId"] = component.get("v.subscription.billingAccountId");
        mapRequestParams["caseId"] = component.get("v.caseId");
        mapRequestParams["customerId"] = component.get("v.subscription.userId");
        mapRequestParams["strCurrency"] = component.get("v.data.currencyName");
        mapRequestParams["amount"] = component.get("v.data.total");
        mapRequestParams["tax"] = component.get("v.data.tax");
        mapRequestParams["subscriptionId"] = component.get("v.subscription.subscriptionId");
        mapRequestParams["subscriptionType"] = component.get("v.subscription.productName");
        mapRequestParams["accountId"] = component.get("v.accountId");

        action.setParams({
            requestParams : mapRequestParams
        });
        
        component.set("v.isLoading", true);
        action.setCallback(this, function(response) {
            component.set("v.isLoading", false);
            const state = response.getState();
            if (state === "SUCCESS") {                
                Util.handleSuccess(component, response.getReturnValue());
                this.closeModal(component);
                $A.get("e.c:RefreshSubscription").fire();
            }else {
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    },
    doProratedRefund: function(component){
        const action = component.get("c.proratedRefundOriginSubscription");
        action.setParams({ 
            mapRequestParams: {
                subscriptionId: component.get('v.subscription.subscriptionId'), 
                caseId: component.get("v.caseId"), 
                customerId: component.get('v.subscription.userId')
            }
        });
        
        component.set("v.isLoading", true);
        action.setCallback(this, function(response) {
            component.set("v.isLoading", false);
            const state = response.getState();
            if (state === "SUCCESS") {
                Util.handleSuccess(component, response.getReturnValue());
                this.closeModal(component);
                $A.get("e.c:RefreshSubscription").fire();
            }else {
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    },
    closeModal: function(component){
        component.set("v.isOpen", false);
    }
})