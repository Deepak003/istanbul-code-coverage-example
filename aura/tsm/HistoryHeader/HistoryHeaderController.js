({
    init : function(component, event, helper) {                         
       if(window.permissionsList){           
             if(window.permissionsList.includes('grant item') || window.permissionsList.includes('grant pack')){
                 component.set('v.hasGrantPermission', true);
             }
         }
    },
    onChangeSearchTerm : function(component, event, helper) {
        const searchTerm = event.getParam('value');
               
        let timer = component.get('v.timer');
        clearTimeout(timer);

        component.set('v.timer', setTimeout(function(){            
            const evt = component.getEvent("onChangeSearchTerm");
            evt.setParams({ searchTerm });
            evt.fire();
        }, 200));
    },
    handleFilterClick : function(component, event, helper) {
        component.getEvent("showFilter").fire();
    },
    handleGrantClick : function(component, event, helper) {
        component.set('v.openHistoryGrant', true);
    },
    setSearchTerm : function(component, event, helper) {
        const searchTerm = event.getParam('arguments').term;
        component.set('v.searchTerm', searchTerm);
    },
    toggleGrantButton: function(component, event, helper) {
        var selectedArray = component.get("v.globalSelectionArray");
        var grantButton = component.find("history-grant-button");
        //Enabling and disabling grant button
        if(grantButton != undefined){
            if(selectedArray.length > 0 && component.get("v.isMultiGrant")){
                grantButton.set('v.disabled', false);
            }else{
                grantButton.set('v.disabled', true);
            }
        }
     },
})