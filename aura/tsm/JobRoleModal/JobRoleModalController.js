({
    openModel: function(component, event, helper) {
        
        helper.getUserRoles(component, event);
    },
    
    init : function(component, event, helper) {
        console.log('@@Test');
        var objChild = component.find('SelectRoleUtility');
        console.log('@@Test Size'+objChild.get('v.roleSize'));
        component.set("v.userRoleSize", objChild.get('v.roleSize'));
    },
    
    closeModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        component.set("v.isOpen", false);
    },
    
})