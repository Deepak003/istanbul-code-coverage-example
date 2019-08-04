({
    fetchModifySubscriptionOptions: function(component, event, helper) {
        var action = component.get("c.fetchOriginSubscriptionTypes"); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse = response.getReturnValue();
            if (state === "SUCCESS") {
                var result =[];
                for(let i=0; i < storeResponse.length; i++){
                    var resArr={};
                    if(storeResponse[i].Catalog_Offer_ID__c != component.get('v.subscription').offerId){
                        resArr['label'] =  storeResponse[i].Name;
                        resArr['value'] = storeResponse[i].Catalog_Offer_ID__c;
                        result.push(resArr);
                    }
                }
                component.set("v.subscriptionOptions", result);
            }
        });
        $A.enqueueAction(action);
    },
    handleSubscriptionChange: function(component, event) {
        let subscriptionObj = component.get("v.subscription");
        let subscriptionOptions = component.get("v.subscriptionOptions");
        for(var i=0;i<subscriptionOptions.length;i++){
            if(subscriptionOptions[i].value == component.get("v.selectedSubsOption")){
                component.set('v.memberAccLabel',subscriptionOptions[i].label);
            }
        }
        
        const subsChangeAction = component.get("c.fetchMembershipCostAndRefund");   
        subsChangeAction.setParams({ userId: subscriptionObj.userId,
                                    currentOfferId:subscriptionObj.offerId,
                                    newOfferId:component.get("v.selectedSubsOption"),
                                    billingAccountId:subscriptionObj.billingAccountId
                                   });
        subsChangeAction.setCallback(this,function(response){
            let spinnerCmp = component.find("spinnerIcon");
            $A.util.addClass(spinnerCmp,"slds-hide");
            const state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.modifySubscriptionObj",response.getReturnValue());    
                let modifyDataBlock = component.find("modifySubscriptionDataBlock");
                $A.util.removeClass(modifyDataBlock,"slds-hide");
            }
            else{
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(subsChangeAction);     
    },
    fetchBillingAccountOptions: function(component, event, helper) {
        var result =[];
        let subscriptionObj = component.get("v.subscription");
        var action = component.get("c.fetchAllBillingAccountsByUser"); 
        action.setParams({
            'userId' : subscriptionObj.userId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse = response.getReturnValue();
            if (state === "SUCCESS") {
                if(storeResponse != null && storeResponse.length > 0){
                    component.set('v.showModifySubSection',true);
                    for(let i=0; i < storeResponse.length; i++){
                        var resArr={};
                        var cardNo = storeResponse[i].accountNumber.substr(storeResponse[i].accountNumber.length - 4 , 
                                                                           storeResponse[i].accountNumber.length);
                        if(storeResponse[i].cardNumber != '' ){
                            if(storeResponse[i].billingAccountType != 'paypal' && storeResponse[i].billingAccountType != 'EACashWallet'){
                            resArr['label'] =  storeResponse[i].type + ' ('+ cardNo +') '
                            + 'Exp '+ storeResponse[i].expirationMonth +'/'+storeResponse[i].expirationYear;
                            }
                            else{
                                resArr['label'] =  storeResponse[i].type; 
                            }
                            resArr['value'] = storeResponse[i].id;
                            resArr['type'] = storeResponse[i].billingAccountType;
                            resArr['cardNumber'] = storeResponse[i].cardNumber;
                            result.push(resArr);
                        }
                    }
                    component.set('v.billingAccountOptions', result);
                }
                else{
                    component.set('v.showModifySubSection',false);
                }
                this.fetchCurrentBillingAcc(component, event, helper);
            }
        });
        $A.enqueueAction(action);
    },
    fetchCurrentBillingAcc : function(component, event, helper){
        var currentBillingAccId = component.get('v.subscription').billingAccountId;
        var billingAccs = component.get('v.billingAccountOptions');
        var index;
        for(let i=0; i<billingAccs.length; i++){
            if(billingAccs[i].value == currentBillingAccId){
                if(billingAccs[i].label != 'PAYPAL' && billingAccs[i].label != 'EACashWallet'){
                    var formattedBillingAcc = billingAccs[i].label.slice(0, billingAccs[i].label.length-11);
                    component.set('v.billingAccountName',formattedBillingAcc);
                }
                else if(billingAccs[i].label == 'PAYPAL' || billingAccs[i].label == 'EACashWallet'){
                    component.set('v.billingAccountName',billingAccs[i].label);
                }
            }
        }
    },
    formatBillingAccountForComboBox : function(list){
        return list.map((l)=> ({'label': l.cardType+' ('+l.cardNumber.substr(l.cardNumber.length-4, 4)+')'+' Exp '+ l.expirationMonth+'/'+l.expirationYear.substr(l.expirationYear.length-4, 4), 'value' : l.id}));
    },
    formatSubscriptionOptionsForComboBox : function(list){
        return list.map((l)=> ({'label': l.productName, 'value' : l.offerId}));        
    },
    closeModal: function(component) {
        var compEvent = component.getEvent("refundSubscriptionEventAction");
        compEvent.fire();                        
    },
    onClickModifySubscription: function(component, event) {
        var billingAccountType;
        var billAccNumber;
        var billingAccount = component.get("v.billingAccountOptions");
        for(var i=0;i<billingAccount.length;i++){
            if(component.get("v.selectedBillingAccountId") == ''){
               // alert('No Billing Acc ID'); 
               console.log('No Billing Acc ID');            
            }
            else if(billingAccount[i].value == component.get("v.selectedBillingAccountId")){
                billingAccountType = billingAccount[i].type;
                billAccNumber = billingAccount[i].cardNumber;
                break;
            }
        }
        /* While modifying the subscription checking that billing account type is pasing to sovereign. 
         * If not, passing the current billing type --- TSM-3420*/
        if(billingAccountType == null || billingAccountType == ''){
            billingAccountType = component.get("v.billingAccountName");
        }
        let subscriptionObj = component.get("v.subscription");
        const subsChangeAction = component.get("c.modifyOriginSubscription");
        var mapRequestParams = {};
        mapRequestParams["offerId"] = component.get("v.selectedSubsOption");
        mapRequestParams["oldOfferId"] = subscriptionObj.offerId;
        mapRequestParams["billingAccountNumber"] = billAccNumber;
        if(component.get("v.selectedBillingAccountId") == ''){
            mapRequestParams["billingAccountId"] = component.get('v.subscription').billingAccountId; 
        }
        else{
            mapRequestParams["billingAccountId"] = component.get("v.selectedBillingAccountId");
        }
        mapRequestParams["billingAccountType"] = billingAccountType;
        mapRequestParams["oldBillingAccountNumber"] = component.get("v.modifySubscriptionObj.billingAccountNumber");
        mapRequestParams["oldBillingAccountId"] = subscriptionObj.billingAccountId;
       	  //Checking undefined
        mapRequestParams["offerName"] = component.get("v.memberAccLabel"); 
        mapRequestParams["oldOfferName"] = subscriptionObj.productName;
        mapRequestParams["subscriptionId"] = subscriptionObj.subscriptionId;
        mapRequestParams["caseId"] = component.get("v.caseId");
        mapRequestParams["customerId"] = component.get("v.nucleusId");
        mapRequestParams["proratedPrice"] = component.get("v.modifySubscriptionObj.prorationAmount");
        mapRequestParams["accountId"] = component.get("v.accountId");
        subsChangeAction.setParams({ mapRequestParams : mapRequestParams });
        subsChangeAction.setCallback(this,function(response){
            let spinnerCmp = component.find("spinnerIcon");
            $A.util.addClass(spinnerCmp,"slds-hide");
            const state = response.getState();
            if (state === "SUCCESS") {
                var appEvent = $A.get("e.c:RefreshSubscription");
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    type: 'success',
                    message: response.getReturnValue()
                });
                toastEvent.fire();
                appEvent.fire();
                this.closeModal(component);
            }
            else{
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(subsChangeAction);     
    },
     onChangeActionHelper : function(component, event, helper){
        if(component.find("membershipOption").get("v.value")!=null){
            component.set('v.enableNextButton',false);
        }
        else{
            component.set('v.enableNextButton',true);
        }
    }
})