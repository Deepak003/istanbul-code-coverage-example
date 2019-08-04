({
    //Function initilized on start of component
    doinit : function(component, event, helper) {          
        helper.switchPresenseStatus(component, event, 'Login', '');
    },
    onStatusChanged : function(component, event, helper) {
        helper.switchPresenseStatus(component, event, 'Auxcode', event.getParam('statusName'));
    }, 
    onLogout: function(component, event, helper) {
        helper.switchPresenseStatus(component, event, 'logout','');
    }, 
})