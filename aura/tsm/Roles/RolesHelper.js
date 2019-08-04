({
	getUserRoles : function(component, event) {
		var action = component.get("c.getJobRoles");
        action.setCallback(this, function(response) {
            var state = response.getState();                
            if (state === "SUCCESS") {
                var userRoles = response.getReturnValue();               
                var roleOptions = [];
                for(var i=0; i<userRoles.length; i++) {
                    roleOptions.push({'label':userRoles[i].JobRole__r.Name , 'value':userRoles[i].JobRole__c});
                }             
                component.set('v.roleOptions', roleOptions);            
                component.set('v.roleFlag', true);
                if (roleOptions && !roleOptions.length) {
                    component.set('v.noRoleDefined', 'No Role is assigned to you. Please contact System Administrator.');
                }                
            }else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
	}
})