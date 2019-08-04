({
	init : function(component, event, helper) {
		helper.getUserRoles(component, event);		
    },
    selectRole: function(component, event, helper) {
        var stateOptions = component.get("v.stateOptions");
        var target = event.currentTarget;
        var roles = component.get('v.roleOptions'),
        	index = target.getAttribute('data-index');
        var selectedRole = component.get('v.selectedRole');
                
        if(selectedRole != undefined){
			sessionStorage.setItem("isJobRoleSelected", true);
            helper.getAllTabInfo(component,event,helper,target,roles[index].value, roles[index].label);
        }else{
            component.set('v.selectedRole', roles[index].value);
			component.set('v.roleName',roles[index].label);        	
            helper.getPermissionSet(component); 
			helper.getAllPermissionsByJobRoleId(component);
        }
        
    },
    changeRoleToSelect: function(component,event,helper) {
        var roleId = event.getParam("roleName"); 
        component.set('v.selectedRole', roleId);
    },
    onRoleChange : function(component,event,helper){
        var target = component.get("v.target");
        var roles = component.get("v.roleOptions"),
            index = target.getAttribute('data-index');
        var isRoleChange = event.getParam("isRoleChangeRequired");
        if(isRoleChange){
        	component.set('v.selectedRole', roles[index].value);
			component.set('v.roleName',roles[index].label);
            helper.getPermissionSet(component); 
			helper.getAllPermissionsByJobRoleId(component);
        }
    },
})