({
    searchPaymentOptions : function(component,event) {
        let spinnerCmp = component.find("spinnerIcon");
        $A.util.removeClass(spinnerCmp,"slds-hide");
        let paymentTypeValue = component.get("v.paymentType");
        if(paymentTypeValue === 'CreditCard'){
            this.searchCreditCards(component,event);
        }else if(paymentTypeValue === 'BillingAccount'){
            this.searchBillingAccounts(component,event);
        }else if(paymentTypeValue === 'RetailCard'){
            this.searchRetailCards(component,event);
        }
    },
    searchCreditCards:function(component,event){
        const searchCreditCardAction = component.get("c.searchCreditCardAccounts");
        searchCreditCardAction.setParams({strLastName:component.get("v.lastName"),
                                          strCardNumber:component.get("v.fourDigits"),
                                          strCardType:component.get("v.cardType"),
                                         });
        searchCreditCardAction.setCallback(this, function(response) {
            let spinnerCmp = component.find("spinnerIcon");
            $A.util.addClass(spinnerCmp,"slds-hide");
            this.showBackDoneButtons(component,event);
            const state = response.getState();
            if (state === "SUCCESS") {
                //component.set(paymentAccount, response.getReturnValue());
                var paymentOptionEvt = $A.get("e.c:SendPaymentOptionEvt");
                paymentOptionEvt.setParams({
                    "paymentOption" : response.getReturnValue() });
                paymentOptionEvt.fire();
            }
            else{
                 Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(searchCreditCardAction);
    },
    searchBillingAccounts:function(component,event){      
        if(this.validateEmail(component)){  
            const searchBillingAccountsAction = component.get("c.searchBillingAccounts");
            searchBillingAccountsAction.setParams({email:component.get("v.billingEmail"),
                                                   pageSize:"50",
                                                   pageNumber:"1"});
            searchBillingAccountsAction.setCallback(this, function(response) {
                let spinnerCmp = component.find("spinnerIcon");
                $A.util.addClass(spinnerCmp,"slds-hide");
                this.showBackDoneButtons(component,event);
                const state = response.getState();
                if (state === "SUCCESS") {
                    var paymentOptionEvt = $A.get("e.c:SendPaymentOptionEvt");
                    paymentOptionEvt.setParams({
                        "paymentOption" : response.getReturnValue() });
                    paymentOptionEvt.fire();
                }
                else{
                   Util.handleErrors(component, response); 
                }
            });
            $A.enqueueAction(searchBillingAccountsAction);
        }else{
            let spinnerCmp = component.find("spinnerIcon");
            $A.util.addClass(spinnerCmp,"slds-hide");
            /*var errorMessageEvt = $A.get("e.c:ShowErrorMessages");
            errorMessageEvt.setParams({
                "showBillingAcctEmailError" : false });
            errorMessageEvt.fire();*/
        }
    },
    searchRetailCards:function(component,event){
        //if(this.validateRetailCardNumber(component)){
        if(true){
            const searchBillingAccountsAction = component.get("c.searchRetailCard");
            searchBillingAccountsAction.setParams({retailCardNumber:component.get("v.retailNumber")});
            searchBillingAccountsAction.setCallback(this, function(response) {
                let spinnerCmp = component.find("spinnerIcon");
                $A.util.addClass(spinnerCmp,"slds-hide");
                this.showBackDoneButtons(component,event);
                const state = response.getState();
                if (state === "SUCCESS") {
                    let returnValue = (response.getReturnValue() || {}).response;
                    
                    // ******************* Mock Response for Retail card ***********************
                    // 4.Redeem: { amount: available, status: ACTIVE }
                    //returnValue = {"amount":"20.0","status":"ACTIVE","currency_x":"EUR","retailCardNumber":"37298653956366"};
                    
                    // 5.Reverse: { status: REDEEMED, userId: match with current user }
                    //returnValue = {"status":"REDEEMED", "transactionHistory": [{"userId":"1000163250524"}], "amount":"0.0", "currency_x":"EUR","retailCardNumber":"37298653956366"};
                    
                    // 6.Redeem another account: { status: REDEEMED, userId: different user than current user }
                    //returnValue = {"status":"REDEEMED", "transactionHistory": [{"userId":"1000000090520", "email": "irfantest@ea.com"}], "sfAccountId":"0016C00000ARAgaQAH", "amount":"20.0", "currency_x":"EUR","retailCardNumber":"37298653956366"};

                    //8. Inactive
                    //returnValue = {"status":"INACTIVE", "amount":"20.0", "currency_x":"EUR","retailCardNumber":"37298653956366"};
                    
                    var paymentOptionEvt = $A.get("e.c:SendPaymentOptionEvt");
                    let retailPaymentOption = [];
                if(returnValue){
                    // formating response
                    const retailCard= this.formatRetailCard(returnValue);
                    component.set('v.retailCard', retailCard);
                    retailPaymentOption.push(retailCard);
                }
                    paymentOptionEvt.setParams({
                        "paymentOption" : retailPaymentOption });
                    paymentOptionEvt.fire();
                }
                else{
                   //Util.handleErrors(component, response); 
                   this.hideBackDoneButtons(component,event);
                   var errors = response.getError();
                   if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                            let paymentOptionEvt = $A.get("e.c:SendPaymentOptionEvt");
                            paymentOptionEvt.setParams({
                                "errorMsg" : errors[0].message });
                            paymentOptionEvt.fire();
                        }
                   }else {
                        console.log("Unknown error");
                   }
                }
            });
            $A.enqueueAction(searchBillingAccountsAction);     
        }else{
            let spinnerCmp = component.find("spinnerIcon");
            $A.util.addClass(spinnerCmp,"slds-hide");
            /*var errorMessageEvt = $A.get("e.c:ShowErrorMessages");
            errorMessageEvt.setParams({
                "showRetailCardError" : false });
            errorMessageEvt.fire();
            return false; */
        }   
    },
    showBackDoneButtons:function(component,event){
        let cancelBtn = component.find("cancelBtn");
        let searchBtn = component.find("searchBtn");
        let backBtn = component.find("backBtn");
        let doneBtn = component.find("doneBtn");
        let redeemAndReverseBtn = component.find("redeemAndReverseBtn");
        $A.util.addClass(cancelBtn,"slds-hide");
        $A.util.addClass(searchBtn,"slds-hide");
        $A.util.removeClass(backBtn,"slds-hide");
        $A.util.removeClass(doneBtn,"slds-hide");
        
        if(component.get('v.retailNumber')) {
            $A.util.addClass(backBtn,"slds-hide");
            $A.util.addClass(doneBtn,"slds-hide");
            
            $A.util.removeClass(cancelBtn,"slds-hide");
            $A.util.removeClass(redeemAndReverseBtn,"slds-hide");                       
        }
    },
    hideBackDoneButtons:function(component,event){
        let cancelBtn = component.find("cancelBtn");
        let searchBtn = component.find("searchBtn");
        let backBtn = component.find("backBtn");
        let doneBtn = component.find("doneBtn");
        let redeemAndReverseBtn = component.find("redeemAndReverseBtn");
        $A.util.removeClass(cancelBtn,"slds-hide");
        $A.util.removeClass(searchBtn,"slds-hide");
        $A.util.addClass(backBtn,"slds-hide");
        $A.util.addClass(doneBtn,"slds-hide");
        
        if(component.get('v.retailNumber')) {
            $A.util.addClass(redeemAndReverseBtn,"slds-hide");
        }
    },    
        validateEmail:function(component,event){
        let billingEmail = component.get("v.billingEmail");
        let emailRegex = /\S+@\S+\.\S+/ ;
        if(!emailRegex.test(billingEmail)){
            var errorMessageEvt = $A.get("e.c:ShowErrorMessages");
            errorMessageEvt.setParams({
                "showBillingAcctEmailError" : true });
            errorMessageEvt.fire();
            return false; 
        }else{
            var errorMessageEvt = $A.get("e.c:ShowErrorMessages");
            errorMessageEvt.setParams({
                "showBillingAcctEmailError" : false });
            errorMessageEvt.fire();
            return true;    
        }
        
    },
    validateRetailCardNumber:function(component,event){
        let retailNumber = component.get("v.retailNumber");
        let numberRegex = /^\d+$/ ;
        if(!numberRegex.test(retailNumber)){
            var errorMessageEvt = $A.get("e.c:ShowErrorMessages");
            errorMessageEvt.setParams({
                "showRetailCardError" : true });
            errorMessageEvt.fire();
            return false; 
        }else{
           var errorMessageEvt = $A.get("e.c:ShowErrorMessages");
           errorMessageEvt.setParams({
                "showRetailCardError" : false });
           errorMessageEvt.fire();
           return true; 
        }
    },
    formatRetailCard: function(retailCard) {
        const transactionHistories = retailCard.transactionHistory || [];
        const transactionHistory = transactionHistories.sort((a,b)=>new Date(b.dateCreated) - new Date(a.dateCreated))[0] || {};
        return Object.assign({},retailCard, transactionHistory, {
            amount: (retailCard.amount||0).toString().split('.').map((a,i)=>i==0?a:a.padStart(2,0)).join('.')           
        });
    },
    doReverse: function(component){
        //alert("doReverse!!");
        
        const billingAccountId = component.get("v.retailCard.accountId");
        const retailCardNumber = component.get("v.retailCard.retailCardNumber");
        const nucleusId = component.get("v.nucleusId");
        
        const action = component.get("c.reverseRetailCard");
        action.setParams({billingAccountId,retailCardNumber,nucleusId});
        
        $A.util.removeClass(component.find("spinnerIcon"), "slds-hide");
        action.setCallback(this, function(response){
            $A.util.addClass(component.find("spinnerIcon"), "slds-hide");
            if (response.getState() === "SUCCESS") {
                component.find("overlayModal").notifyClose();
                Util.handleSuccess(component, response.getReturnValue().responseMsg);
            }else{
                //Util.handleErrors(component, response);
                let paymentOptionEvt = $A.get("e.c:SendPaymentOptionEvt");
                paymentOptionEvt.setParams({"errorMsg" : response.getError()[0].message});
                paymentOptionEvt.fire();
            }
        });
                          
        $A.enqueueAction(action);
    },
    doRedeem: function(component){
        const strUserId = component.get("v.accountData.id");
        const retailCardNumber = component.get("v.retailCard.retailCardNumber");
        const newWalletAccountDetails = component.get("v.accountData");
        const nucleusId = component.get("v.nucleusId");
        
        const action = component.get("c.redeemRetailCard");
        action.setParams({
            nucleusId,
            strUserId,
            retailCardNumber,
            newWalletAccountDetails: JSON.stringify(newWalletAccountDetails),
            strCurrency: (component.get('v.retailCard')||{}).currency_x
        });
        
        $A.util.removeClass(component.find("spinnerIcon"), "slds-hide");
        action.setCallback(this, function(response){
            $A.util.addClass(component.find("spinnerIcon"), "slds-hide");
            if (response.getState() === "SUCCESS") {
                component.find("overlayModal").notifyClose();
                Util.handleSuccess(component, response.getReturnValue().responseMsg);
            }else{
                //Util.handleErrors(component, response);
                let paymentOptionEvt = $A.get("e.c:SendPaymentOptionEvt");
                paymentOptionEvt.setParams({"errorMsg" : response.getError()[0].message});
                paymentOptionEvt.fire();
            }
        });
                          
        $A.enqueueAction(action);
    }
})