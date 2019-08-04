({
	init : function(component, event, helper) {
		helper.getUserRoles(component, event);
	},
    
    selectRole: function(component, event, helper) {
        var target = event.currentTarget,
            roles = component.get('v.roleOptions'),
            index = target.getAttribute('data-index');
        component.set('v.selectedRole', roles[index]);
    }
})