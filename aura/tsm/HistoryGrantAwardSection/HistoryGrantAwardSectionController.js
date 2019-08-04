({
    doInit : function(component, event, helper) {
        helper.getArrayDetails(component, event);
    },
    closeGrantAwardSection : function(component, event, helper) {
        component.set("v.openHistoryGrant", false);
    },
    submitGrantContent: function(component, event, helper) {
        helper.grantArrayList(component, event);
    },
    backToGrantSection: function(component, event, helper) {
        component.set("v.openHistoryGrant", false);
    },
    removeCurrentItem: function(component, event, helper) {
        var selectedItemIndex = event.target.dataset.value;
        var itemData = component.get("v.itemData");
        itemData.splice(selectedItemIndex, 1);
        component.set("v.itemData", itemData);
    },
    removeCurrentPack: function(component, event, helper) {
        var selectedItemIndex = event.target.dataset.value;
        var packData = component.get("v.packsData");
        packData.splice(selectedItemIndex, 1);
        component.set("v.packsData", packData);
    },
    validateSubmit: function(component, event, helper) {
        var itemData = component.get("v.itemData");
        var packData = component.get("v.packsData");
        var grantCartDetails = component.find("grantCartDetails");
        var disable = true;
        //validate selection
        if(itemData != undefined){
            if(itemData.length > 0){
                disable = false;
            }
        }
        
        if(packData != undefined){
            if(packData.length > 0){
                disable = false;
            }
        }
        //setting diable property
        grantCartDetails.set("v.disabled", disable);
    },
})