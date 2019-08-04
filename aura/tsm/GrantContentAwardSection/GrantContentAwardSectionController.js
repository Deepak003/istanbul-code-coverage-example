({
    doInit : function(component, event, helper) {
        helper.checkContainerConfiguration(component);
        helper.initialteLoad(component, event);
    },
    closeGrantAwardSection : function(component, event, helper) {
        component.set("v.openGrantAward", false);
        //Publish the reset event
        var componentEvent = component.getEvent("grantResetEvent");
        componentEvent.setParam("type", "grantReset");
        componentEvent.fire();
    },
    submitGrantContent: function(component, event, helper) {
        helper.grantArrayList(component, event);
    },
    backToGrantSection: function(component, event, helper) {
        component.set("v.openGrantAward", false);
        component.set("v.openGrantContent", true);
        //Bubbling the data back to the Grant container
        var componentEvent = component.getEvent("backActionEvent");
        //componentEvent.setParam("globalMap", component.get("v.globalSelectionMap"));
        //componentEvent.setParam("selectedArray", component.get("v.allFilterData"));
        componentEvent.setParam("type", "backButtonFired");
        componentEvent.fire();  
    },
    removeCurrentSelection: function(component, event, helper) {
        var globalSelectionMap =  component.get("v.globalSelectionMap");
        var allFilterData = component.get("v.allFilterData");
        var selectedOptionId = event.currentTarget.dataset.id;
        var selectedOptionCategory = event.currentTarget.dataset.value;
        var selectedOptionType = event.currentTarget.dataset.name;
        var loadType = 'normalLoad';
            //Removing the current selection from all filter
        for(var eachValue in allFilterData){
            if(allFilterData[eachValue].id == selectedOptionId){
                allFilterData.splice(eachValue, 1);
                //Remove all filter from the global map
                //TSM-2102
                if(selectedOptionType != 'Currency'){
                    globalSelectionMap[selectedOptionType][selectedOptionCategory.toLowerCase()].splice(eachValue, 1);
                }else{
                    globalSelectionMap[selectedOptionType].splice(eachValue, 1);   
                    setTimeout(function() {helper.validateAllParameters(component, event);}, 5);
                }
            }        
        }
        //Function to initilize the data after removal
        helper.initialteLoad(component, event);
    },
    //Function to validate the currency limit
    validateSelection: function(component, event, helper) {
        var currentIndex = event.getSource().get('v.id');
        var currencyArray = component.get("v.currencyData");
        //TSM-2151
        var currencyElementArray = component.find("currency-amount");
        var currentElement;
        if(currencyElementArray.length != undefined){
            currentElement = currencyElementArray[currentIndex];
        }else{
            currentElement = currencyElementArray;
        }
        
        //TSM-2912 - Adding grant permission for limit
        var isCurrencyGreneric = helper.isPresentInCurrencyArray(component.get("v.genericConfigurationData").walletPermissions , currencyArray[currentIndex]); 
        if(isCurrencyGreneric[0]){
            currencyArray[currentIndex].maxCreditableValue = isCurrencyGreneric[1];
        } 

        if(currentElement.get("v.value") > currencyArray[currentIndex].maxCreditableValue){
            currentElement.setCustomValidity("Limit exceeded");
        }else{
            currentElement.setCustomValidity("");
        }
        currentElement.reportValidity(); //Reporting validity
        //Validate all selection
        helper.validateAllParameters(component, event);
    },
    //Function to validate combobox selection
    validateReason: function(component, event, helper) {       
        //Validate all selection
        helper.validateAllParameters(component, event);
    }
})