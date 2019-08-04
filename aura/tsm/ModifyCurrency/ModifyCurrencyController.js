({
    doInit : function(component, event, helper) {
        var options = [];
        if(window.permissionsList){
            if(window.permissionsList.includes('grant currency to wallet')){
                options.push({label: 'Grant', value: 'credit'});
            }
            if(window.permissionsList.includes('remove currency from wallet')){
                options.push({label: 'Debit', value: 'debit'});
            } 
            component.set("v.options",options);
            component.set("v.showDefault",true);
            var item = component.get('v.selectedRowForModal');
            if((item.creditable == true && item.debitable == false ||(window.permissionsList.includes('grant currency to wallet') && window.permissionsList.includes('remove currency from wallet') == false))||item.balance == 0){
                component.set('v.actionPlaceholder','Grant');
                component.set('v.actionPlaceholderValue','credit');
                component.set('v.disableActions',true);
            }
            else if(item.creditable == false && item.debitable == true ||(window.permissionsList.includes('remove currency from wallet') && window.permissionsList.includes('grant currency to wallet') == false)){
                component.set('v.actionPlaceholder','Debit');
                component.set('v.actionPlaceholderValue','debit');
                component.set('v.disableActions',true);
            }
        }
        component.set('v.maxCreditableValue',item.maxCreditableValue);
        component.set('v.maxDebitableValue',item.maxDebitableValue);
        console.log(component.get("v.selectedRowForModal"));
        if(helper.hideReasonField(component)){
            
        }else{
            var action = component.get("c.fetchAddCreditToWalletReasons"); 
            action.setCallback(this, function(response) {
                var state = response.getState();
                var storeResponse = response.getReturnValue();
                console.log(response.getReturnValue());
                if (state === "SUCCESS") {
                    var result =[];
                    for(let i=0; i < storeResponse.length; i++){
                        var resArr={};
                        resArr['label'] =  storeResponse[i].name;
                        resArr['value'] = storeResponse[i].id;
                        result.push(resArr);
                    }
                    console.log(result);
                    component.set("v.reasons", result);
                    if(component.get('v.reasons').length>0){
                        component.set('v.showReasons',true);
                    }
                }
            });
            $A.enqueueAction(action);    
        }
        
    },
    validate  : function(component, event, helper) {
        var inp = component.get("v.selectedAmount");
        console.log(component.find("amountInput").get("v.value"));
        if(inp != undefined && isNaN(inp))
            component.set('v.selectedAmount', inp.substring(0, inp.length - 1));
    },
    closeModal : function(component, event, helper) {
        var appEvent = $A.get("e.c:CloseModifyCurrencyModal");
        appEvent.fire();
    },
    checkAmount : function(component, event, helper) {
        helper.checkAmountHelper(component, event, helper);
    },
    onApply : function(component, event, helper) {
        helper.onApplyHelper(component, event, helper);
    },
    onActionChange : function(component, event, helper) {
        component.set('v.selectedAmount',null);
        component.set('v.requiredVal',false);
        helper.checkAmountHelper(component, event, helper);
    }
})