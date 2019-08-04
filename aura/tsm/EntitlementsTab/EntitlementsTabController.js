({
    init : function(component, event, helper) {
        if(component.get("v.from") != 'Account') //TSM-3024
            helper.getCustomerProducts(component, event, helper); //TSM-3024
        component.set("v.searchString", '');
        helper.init(component, event, helper);
    },
    refreshEntitlement : function(component, event, helper) {
        component.set("v.loaded" , false);
        component.set('v.paginatedData', []);
        component.set("v.isSpinner" , true);
        component.set("v.isDisabled", true);
        
        helper.init(component, event, helper);
    },
    onCheck : function(component, event, helper) {
        event.stopPropagation();
        event.preventDefault();
        
        helper.onCheck(component, event.getSource().get("v.value"), event.getSource().get("v.name"));
    },
    updateStatus: function(component, event, helper) {
        component.set("v.showUpdateStatus" , true);
    },
    addNewEntitlement: function(component, event, helper) {
        component.set("v.inGameEntitlement" , true);
    },
    toggleExpand : function(component, event, helper) {
        helper.toggleExpand(component, event, helper);
    },
    closeModal : function(component, event, helper){
        if(event.getParam("eventVal") == 'Add'){
            component.set('v.inGameEntitlement',false);
        }
        else{
            component.set('v.showUpdateStatus',false);
        }
        component.set("v.loaded" , false);
        component.set('v.paginatedData', []);
        component.set("v.isSpinner" , true);
        component.set("v.isDisabled", true);
        helper.init(component, event, helper);
    },
    handlePageChange : function(component, event, helper) {
        helper.handlePageChange(component, event, helper);
    },
    getSearchResult : function(component, event, helper) {
        helper.getSearchResult(component, event, helper);
    },
    sortByName: function(component, event, helper) {
        component.set("v.isNameDescending", !component.get("v.isNameDescending"));
        if(component.get("v.isNameDescending"))
            helper.sortTableData(component, event, helper , 'name', 'desc');
        else            
            helper.sortTableData(component, event, helper , 'name','asc');
    },
    sortByDate: function(component, event, helper) {
        component.set("v.isDescending", !component.get("v.isDescending"));
        if(component.get("v.isDescending"))
            helper.sortTableData(component, event, helper , 'date', 'desc');
        else            
            helper.sortTableData(component, event, helper , 'date','asc');
    },
    resetTrialClick : function(component, event, helper) {
        var selEntitlement = event.getSource().get("v.value");
        component.set('v.selectedEntitlement',selEntitlement);
        console.log(selEntitlement);
        component.set('v.showResetTrial', true);
    },
    
    transferEvent : function(component, event, helper) {
        component.set('v.isTransfer', true);
    },
    closeTransfer : function(component, event, helper) {
        component.set('v.isTransfer', false);
    },
    
    handleChange : function(component, event, helper) {
        var getTypes = component.find("types");
        var searchTypes = getTypes.get("v.value");
        component.set("v.selectedEntitlements", null);
        if(searchTypes == 'PC')
            component.set('v.isTransferButton', false);
        else
            component.set('v.isTransferButton', true);
        helper.getSearchPlatform(component, event, helper);
    },
    
    transferEntitlement : function(component, event, helper) {
        helper.transferEntitlement(component,event,helper);
    },
    onChangeAll: function(component, event, helper) {
        helper.onChangeAll(component, event)
    },
    handleBubbling : function(component, event, helper) {
        var firedLookupType = event.getParam('type');
        if(firedLookupType == "Filter"){
            if(!event.getParam('isEmpty')){
                
                //Closing platform
                var searchTypes = event.getParam('Id');
                component.set("v.selectedEntitlements", null);
                if(searchTypes == 'PC')
                    component.set('v.isTransferButton', false);
                else
                    component.set('v.isTransferButton', true);
                helper.getSearchPlatform(component, event, helper, searchTypes);
            }
        }  
    },  
})