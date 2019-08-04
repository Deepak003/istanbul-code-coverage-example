module.exports = ({    doInit : function(component, event, helper) {
        helper.setPaymentOptions(component, event);
        helper.setCreditCardTypes(component,event);
    },
    searchPaymentAccount:function(component, event, helper){
        helper.setPaymentAccount();    
    },
    handlePaymentTypeChange:function(component, event, helper){
        let selectedPaymentType = event.getParam("value");
        let creditCardBlock = component.find("creditCardBlock");
        let billingAcctBlock = component.find("billingAcctBlock");
        let retailCardBlock = component.find("retailCardBlock");
        if(selectedPaymentType === 'CreditCard'){
            $A.util.addClass(billingAcctBlock,"slds-hide");  
            $A.util.addClass(retailCardBlock,"slds-hide");  
            $A.util.removeClass(creditCardBlock,"slds-hide");  
        }
        if(selectedPaymentType === 'BillingAccount'){
            $A.util.addClass(creditCardBlock,"slds-hide");  
            $A.util.addClass(retailCardBlock,"slds-hide");  
            $A.util.removeClass(billingAcctBlock,"slds-hide");  
        }
        if(selectedPaymentType === 'RetailCard'){
            $A.util.addClass(billingAcctBlock,"slds-hide");  
            $A.util.addClass(creditCardBlock,"slds-hide");  
            $A.util.removeClass(retailCardBlock,"slds-hide");  
        }
        helper.fireEnableSearchButton(component, event);
    },
    fireEnableSearchButton:function(component, event, helper){
        helper.fireEnableSearchButton(component, event);
    },
    fireValidation:function(component, event, helper){
        helper.validateSearchButtonEnable(component, event);
    },
    handlePaymentOptionEvt:function(component, event, helper){
        if(event.getParam("clearSearch")){
            let paymentTypeBlock = component.find("paymentType");
            $A.util.removeClass(paymentTypeBlock,"slds-hide");
            let noResultBlock = component.find("noResultBlock");
            $A.util.addClass(noResultBlock,"slds-hide");
            let selectedPaymentType = component.get("v.paymentOptionType");
            let creditCardBlock = component.find("creditCardBlock");
            let billingAcctBlock = component.find("billingAcctBlock");
            let retailCardBlock = component.find("retailCardBlock");
            if(selectedPaymentType === 'CreditCard'){
                $A.util.addClass(billingAcctBlock,"slds-hide");  
                $A.util.addClass(retailCardBlock,"slds-hide");  
                $A.util.removeClass(creditCardBlock,"slds-hide");  
            }
            if(selectedPaymentType === 'BillingAccount'){
                $A.util.addClass(creditCardBlock,"slds-hide");  
                $A.util.addClass(retailCardBlock,"slds-hide");  
                $A.util.removeClass(billingAcctBlock,"slds-hide");  
            }
            if(selectedPaymentType === 'RetailCard'){
                $A.util.addClass(billingAcctBlock,"slds-hide");  
                $A.util.addClass(creditCardBlock,"slds-hide");  
                $A.util.removeClass(retailCardBlock,"slds-hide");  
            }
        }else if(event.getParam("errorMsg")){
            component.set("v.errorMsgText",'*'+event.getParam("errorMsg"));
        }
        else{
            let paymentOptionList = event.getParam("paymentOption");
            let paymentTypeBlock = component.find("paymentType");
            let creditCardBlock = component.find("creditCardBlock");
            let  billingAcctBlock= component.find("billingAcctBlock");
            let retailCardBlock = component.find("retailCardBlock");
            $A.util.addClass(paymentTypeBlock,"slds-hide");
            $A.util.addClass(creditCardBlock,"slds-hide");
            $A.util.addClass(billingAcctBlock,"slds-hide");
            $A.util.addClass(retailCardBlock,"slds-hide");
            let noResults = component.find("noResultBlock");
            if($A.util.isEmpty(paymentOptionList)){
                $A.util.removeClass(noResults,"slds-hide");
            }else{
                 $A.util.addClass(noResults,"slds-hide");
                helper.setPaymentAccounts(component, event);
            }
        }
        event.stopPropagation();
    },
    setPaymentOption:function(component, event, helper){
        let setPaymentOptionEvt = $A.get("e.c:SetPaymentOption");
        let paymentId = event.currentTarget.dataset.paymentid;
        setPaymentOptionEvt.setParams({"selectedPaymentOption":paymentId});
        setPaymentOptionEvt.fire();
        component.find("overlayModal").notifyClose();
    },
    openDifferentAccountTab:function(component, event, helper){
        /*let differentAccountEvt = $A.get("e.c:OpenDifferentAccountEvt");
        let nucleusId = event.currentTarget.dataset.nucleusid;
        let paymentId = event.currentTarget.dataset.paymentid;
        let emailAddress = event.currentTarget.dataset.emailaddress;
        differentAccountEvt.setParams({"nucleusId":nucleusId,"paymentId":paymentId,"emailAddress":emailAddress,"uniqueId":component.get("v.uniqueId")});
        differentAccountEvt.fire();
        component.find("overlayModal").notifyClose();*/
    },
    handleErrorMessages:function(component, event, helper){
        if(event.getParam("showBillingAcctEmailError")){
            component.set("v.isBillingError",true);
        }else{
            component.set("v.isBillingError",false);
        }
        if(event.getParam("showRetailCardError")){
            component.set("v.isRetailError",true);
        }else{
            component.set("v.isRetailError",false);
        }
    },
    goBack: function(component, event, helper) {
        let clearSearch = $A.get("e.c:SendPaymentOptionEvt");
        clearSearch.setParams({"clearSearch" : true });
        clearSearch.fire();
    },
    openAccountWithSubtab: function(component, event, helper) {
        const index = event.currentTarget.dataset.index;
        const paymentOption = component.get("v.paymentAccount") || [];     
        const target = paymentOption[index] || {};
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
          workspaceAPI.openSubtab({
            parentTabId: response.tabId,
            recordId: target.sfAccountId,
            focus: true
          }).catch(console.log);
        }).catch(console.log);        
    },
    clearErrorMsg:function(component, event, helper){
        if(!component.get("v.retailCardNumber")){
            component.set("v.errorMsgText","");   
        }
    }
})
