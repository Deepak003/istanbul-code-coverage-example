({
    doInit : function(component, event, helper) {
        var accountData = component.get('v.accountDetails');
        component.set("v.accountDetailModel", accountData);
        var accountDataStr = JSON.stringify(accountData);
        component.set("v.oldAccountDetailModel", accountDataStr);
        component.set("v.cancelButtonName", "Close");
        component.set("v.showSaveButton", "");
        if(component.get('v.variant') == "edit"){
            component.set("v.isEditMode", true);
            component.set("v.isViewMode", false);
            component.set("v.formHeading", "Edit Card Details");
            component.set("v.showSaveButton", "Save");
            component.set("v.cancelButtonName", "Close");
        }
        console.log("card data");
        console.log(accountData);
        if(accountData.hasOwnProperty('expirationYear')) {
            component.set("v.dateSeparator", "/");
        }
        if(accountData.billingAccountType == 'paypal' || accountData.billingAccountType == 'EACashWallet') {
            component.set("v.accountTypeCard", false);
        } else {
            component.set("v.accountTypeCard", true);
        }
        helper.populateWWCEObjects(component, event, helper);
        helper.setupData(component, event, helper);
    },
    openEditView : function(component, event, helper) {
        component.set("v.variant", "edit");
		component.set("v.isEditMode", true);
        component.set("v.isViewMode", false);
        component.set("v.formHeading", "Edit Card Details");
        component.set("v.showSaveButton", "Save");
        component.set("v.cancelButtonName", "Close");
        helper.setupData(component, event, helper);
    },
    handleAccountChange : function(component, event, helper) {

    },
    applyPersona : function(component, event, helper) {
        helper.applyPersona(component, event);
    },
    removePersona:function(component, event, helper) {
        helper.removePersona(component, event);
    },
    handleCountryChange : function(component, event, helper) {
		helper.handleCountryChange(component, event);
    },
    handleAutomaticAccountUpdateStatus : function(component, event, helper) {
		helper.handleAutomaticAccountUpdateStatus(component, event);
    },
    handleUpdateData : function(component, event, helper) {
        var billingState = '';
        var stateValidity = '';
        var stateCombo = component.get("v.showStateList");
        
        var allValid = component.find('addressField').reduce(function (validSoFar, inputCmp) {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        
        //validate state
        if(stateCombo) {
            billingState = component.find("addressFieldStateCombo");
            stateValidity = billingState.get("v.validity");
            billingState.reportValidity();
        } else {
            billingState = component.find("addressFieldStateText");
            stateValidity = billingState.get("v.validity");
            billingState.reportValidity();
        }
        
        // update data
        if (allValid && stateValidity.valid) {
            helper.handleSaveData(component, event);
        }
    },
    handleCancelUpdate : function(component, event, helper) {
        helper.handleCancelSaveData(component, event);
        component.set("v.isOpen", false);
    }
})