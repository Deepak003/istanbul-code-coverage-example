({
    checkAmountHelper : function(component, event, helper) {
        //To Block Charecters
        var inputBox = component.find('amountInput');
        var inputValue = ''+inputBox.get("v.value")+'';
        inputValue = inputValue.replace(/\D+/g, '');
        inputBox.set("v.value",inputValue);
        var value = parseInt(inputValue);
        
        var selectedAction = component.find('actions').get('v.value');
        var selectedReason;
        if(component.get('v.showReasons')){
            selectedReason = component.find('reasons').get('v.value');    
        }        
        
        var maxCreditableValue = component.get('v.maxCreditableValue');
        var maxDebitableValue = component.get('v.maxDebitableValue');
        
        //Conditionally Enable Apply Button
        if((selectedAction!=null|| component.get('v.actionPlaceholder')=='Grant' ||component.get('v.actionPlaceholder')=='Debit') 
           && (value!=null || value!='') && (((component.get('v.showReasons') && (selectedReason!=null || selectedReason!=undefined)) 
                               || !component.get('v.showReasons')))){
            component.set('v.disableApplyButton',false);
        }
        else{
            component.set('v.disableApplyButton',true);
        }
        //Dynamic Message for Limits
        if(selectedAction=='credit' || component.get('v.actionPlaceholder')=='Grant'){
            var msg = '(Grant Limitation is '+maxCreditableValue+')';
            component.set('v.amountLimitMessage',msg);
        }
        else if(selectedAction=='debit' || component.get('v.actionPlaceholder')=='Debit'){
            var msg = '(Grant Limitation is '+maxDebitableValue+')'; //TSM-2594
            component.set('v.amountLimitMessage',msg);
        }
        //Validations for input amount
        if ((selectedAction=='credit' || component.get('v.actionPlaceholder')=='Grant') && value > maxCreditableValue) {
            component.set('v.requiredVal',true);
            component.set('v.disableApplyButton',true);
            inputBox.setCustomValidity('The number exceeds the maximum.');
            inputBox.reportValidity();
        }
        else if((selectedAction=='debit' || component.get('v.actionPlaceholder')=='Debit') && value > maxDebitableValue){ //TSM-2594
            component.set('v.requiredVal',true);
            component.set('v.disableApplyButton',true);
            inputBox.setCustomValidity('The number exceeds the maximum.');
            inputBox.reportValidity();
        }
            else {
                inputBox.setCustomValidity('');
                inputBox.reportValidity();
                component.set('v.requiredVal',false);
                if((selectedAction=='credit'||component.get('v.actionPlaceholder')=='Grant') && component.get('v.selectedAmount')!=''){
                    component.set("v.showDefault",false);
                    var newBalance = Number(component.get('v.selectedAmount')) + Number(component.get('v.currentBalance'));
                    component.set('v.formattedAmount','+'+component.get('v.selectedAmount'));
                    component.set('v.newBalance',newBalance);
                }
                else if((selectedAction=='debit'||component.get('v.actionPlaceholder')=='Debit') && component.get('v.selectedAmount')!==''){
                    component.set("v.showDefault",false);
                    var newBalance =  component.get('v.currentBalance') - component.get('v.selectedAmount');
                    component.set('v.formattedAmount','-'+component.get('v.selectedAmount'));
                    component.set('v.newBalance',newBalance);
                }
                    else if(component.get('v.selectedAmount') == ''){
                        component.set("v.showDefault",false);
                        component.set('v.formattedAmount',0);
                        component.set('v.newBalance',component.get('v.currentBalance'));
                    }
            }
    },
    onApplyHelper : function(component, event, helper) {
        console.log('onApplyHelper');
        let selectedPersona = component.get("v.selectedPersona");
        console.log(selectedPersona);
        console.log(component.get("v.selectedRowForModal"));
        let wallet = component.get("v.selectedRowForModal");
        var getModifiedCurrencyMap = {};
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        var appEvent = $A.get("e.c:CloseModifyCurrencyModal");
        var appEvent1 = $A.get("e.c:RefreshProductTabEvent");
        getModifiedCurrencyMap["customerId"] = component.get("v.nucleusId");
        getModifiedCurrencyMap["caseId"] = component.get("v.caseId");
        getModifiedCurrencyMap["crmProductName"] = component.get("v.selectedProduct").Url_Name__c;
        if(component.get("v.selectedPersona").object.idType != undefined){             
            getModifiedCurrencyMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
        }
        getModifiedCurrencyMap["gamerId"] = gamerID;
        getModifiedCurrencyMap["platform"] = selectedPersona.object.platform;
        getModifiedCurrencyMap["balance"] = ""+component.get('v.currentBalance')+"";
        getModifiedCurrencyMap["amount"] = ""+component.get('v.selectedAmount')+"";
        if(component.find('actions').get('v.value') == undefined)
            getModifiedCurrencyMap["transactionType"] = component.get('v.actionPlaceholderValue');
        else
            getModifiedCurrencyMap["transactionType"] = component.find('actions').get('v.value');
        if(component.get('v.showReasons'))
            getModifiedCurrencyMap["reason"] = component.find('reasons').get('v.value');
        else
            getModifiedCurrencyMap["reason"] = '';
        
        getModifiedCurrencyMap["walletId"] = wallet.walletId;
        getModifiedCurrencyMap["walletName"] = wallet.name;
        getModifiedCurrencyMap["GrantName"] = "Currency";
                
        var action = component.get("c.modifyCurrencyOfWallet");
        action.setParams({
            mapRequestParams : getModifiedCurrencyMap
        });
        var toastEvent = $A.get("e.force:showToast");
        action.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse = response.getReturnValue();
            if(storeResponse != null){
                if(state=== "SUCCESS"){
                    //Adding action to capture events
                    var eventsAction = component.get("c.publishDataForEventsForModifyCurrency");
                    eventsAction.setParams({
                        mapRequestParams : getModifiedCurrencyMap
                    });        
                    $A.enqueueAction(eventsAction);
                }
                appEvent.fire();
                toastEvent.setParams({
                    type: 'success',
                    message: component.get("{!v.selectedRowForModal.name}") + ' successfully modified.'
                });
                toastEvent.fire();
                appEvent1.fire();
            }
            else{
                appEvent.fire();
                toastEvent.setParams({
                    type: 'error',
                    message: component.get("{!v.selectedRowForModal.name}") +' modification failed. (error code)'
                });
                toastEvent.fire();
            }
            console.log(response.getReturnValue());
        });
        
        $A.enqueueAction(action);
    },
    hideReasonField: function(component) {
        let cfgUIData = component.get("v.configUIData");
        let hideReason =true;
        for (var tabObj of cfgUIData.tabs) {
            if(tabObj.name == 'Wallets'){
                for (var sectionObj of tabObj.sections) {
                    if(sectionObj.name && sectionObj.name == 'Wallet Reason'){
                        hideReason = false;
                        return hideReason;    
                    }   
                }
            }
        }
        return hideReason;
    }
})