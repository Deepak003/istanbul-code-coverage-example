({
	 getUserRoles : function(component, event) {
        var action = component.get("c.getRoles");
         action.setCallback(this, function(response) {
             var state = response.getState();                
             if (state === "SUCCESS") {
                 var userRoles = JSON.parse(response.getReturnValue().roleslist);       
                 console.log("userRoles==>",userRoles);
                 var roleOptions = [];
                 for(var i=0; i<userRoles.length; i++) {
                     roleOptions.push({'label':userRoles[i].roleName , 'value':userRoles[i].roleId});
                 }             
                 component.set('v.roleOptions', roleOptions);  
                 console.log("roleOptions==>",roleOptions);
                 component.set('v.roleFlag', true);
                 component.set('v.selectedRole', response.getReturnValue().currentRoles);
                 if (roleOptions && !roleOptions.length) {
                     component.set('v.noRoleDefined', 'No Role is assigned to you. Please contact System Administrator.');
                 }
                 
                 component.set('v.userRoleSize',userRoles.length);
                 if(userRoles.length>0){
                     component.set("v.isOpen", true);
                 }
                 else{
                     component.set("v.isOpen", false);
                 }
             }else{
                 console.log("Failed with state: " + state);
             }
         });
        $A.enqueueAction(action);
    },
})