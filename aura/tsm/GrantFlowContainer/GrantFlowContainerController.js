({
    handleBackPress : function(component, event, helper) {
        var firedGrantType = event.getParam('type');
        if(firedGrantType == "backButtonFired"){
            component.set("v.backButtonPress", true);
        }else if(firedGrantType == "publishDataFired"){
            component.set("v.openGrantAward", false);
            component.set("v.openGrantResponse", true);
            //Adding the data's
            component.set("v.successData", event.getParam('successData'));
            component.set("v.failedData", event.getParam('failedData'));
            
            //Resetting the global datas
            component.set("v.allFilterData", []);
            component.set("v.globalSelectionMap", null);
        }       
    },
    resetValues: function(component, event, helper) {
        component.set("v.allFilterData", []);
        component.set("v.globalSelectionMap", null);
        component.set("v.successData", []);
        component.set("v.failedData", []);
    },
})