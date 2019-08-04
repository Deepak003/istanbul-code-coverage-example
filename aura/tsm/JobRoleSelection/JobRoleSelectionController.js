({
	checkForJobRole: function(component, event, helper) {
        const isJobRoleSelected = sessionStorage.getItem("isJobRoleSelected");        
        if(!isJobRoleSelected) {
            helper.getUserRoles(component, event, helper);
        }else{
            helper.getAllPermissionsByJobRoleId(component);
        }  
	},
    
    doInit: function(component, event, helper) {
        const isJobRoleSelected = sessionStorage.getItem("isJobRoleSelected");        
        if(!isJobRoleSelected) {
            helper.getUserRoles(component, event, helper);
        }else{
            helper.getAllPermissionsByJobRoleId(component);
        }  
    },
    
    handleActionClick: function(component, event, helper) {
        const selectedRole = component.get("v.selectedRole");
        if(selectedRole) {
            sessionStorage.setItem("isJobRoleSelected", true);
            component.set("v.isOpen", false);
            helper.getPermissionSet(component); 
            helper.getAllPermissionsByJobRoleId(component);
        }
    },
    
    selectRole: function(component, event, helper) {
        var target = event.currentTarget;
        var roles = component.get('v.roleOptions'),
            index = target.getAttribute('data-index');
        var selectedRole = component.get('v.selectedRole');
        component.set('v.selectedRole', roles[index].value);
        component.set("v.isSuccessDisable", false);        
    },        
    showPopUpModal: function(component, event, helper) {
        component.set("v.selectedRoleId", event.getParam('roleId'));
        component.set("v.selectedRoleName", event.getParam('roleName'))
    	component.set("v.isJobRoleChange", true);        
    },
    
    closeAllTabs : function(component,event,helper){
        var target = component.get("v.target");
        helper.closeAllTabs(component,event,helper,target);
    },
    closeChangeJobRole: function(component, event, helper){
        //component.set('v.isJobRoleChange', false);
        helper.closeModal(component,event,helper);
    },
    closeModals:function(component, event, helper){
        component.set('v.isJobRoleChange', false);
    }
})