({
    getRoles: function(component,helper) {
        var action = component.get('c.getJobRoles');
        // Set up the callback
        var self = this;
        action.setCallback(this, function(actionResult) { 
            var state = actionResult.getState();
            if (state === "SUCCESS") {
                var jobRoleList = JSON.parse(actionResult.getReturnValue().jobrolesList);
                component.set('v.roles', jobRoleList);
                component.set('v.currentJobRole', actionResult.getReturnValue().prevSelectedJobrole);
                component.set('v.selectedOption', actionResult.getReturnValue().prevSelectedJobrole);    
                if(jobRoleList.length > 1){
                    component.set("v.isOpen", true);
                }
                else if(jobRoleList.length !=0){
                    helper.assignPermissionSet(component);
                }    
                
            }
        });
        $A.enqueueAction(action);
    },
    /* assignPermissionSet: function(component) {
        var action = component.get('c.assignPermissionSetAndQueues'); 
        // Set up the callback
        action.setParams({
            strJobRoleId : component.get('v.currentJobRole'),
            strSelectedQueueList: null,
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log(state);
                //var storeResponse = response.getReturnValue();
                //component.set("v.permissionSet", storeResponse);
            }
        });
        $A.enqueueAction(action);
    },*/
    assignPermissionSet: function(component) {
        var action = component.get('c.assignPermissionSetAndQueues');
        // THOR Specific Changes
        var selectedQueueOptions = component.get('v.selectedQueueOptions'); 
        // Set up the callback
        action.setParams({
            strJobRoleId : component.get('v.selectedOption'),
            strSelectedQueueList: JSON.stringify(selectedQueueOptions)
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //var storeResponse = response.getReturnValue();
                //component.set("v.permissionSet", storeResponse);
            }
        });
        $A.enqueueAction(action);
    },
    // THOR Specific Functn
    getQueuesByJobRoleId: function(component) {
        //TODO for THOR
        var action = component.get('c.getQueuesByJobRoleId'); 
        // Set up the callback
        action.setParams({
            strJobRoleId : component.get('v.selectedOption')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var queues = response.getReturnValue(),
                    queueOptions = [];
                if (!queues.length) {
                    //component.find("overlayLib").notifyClose();
                }
                for(var i=0; i<queues.length; i++) {
                    var queueKeys = Object.keys(queues[i]),
                        queueKey = '';
                    for (var j=0; j<queueKeys.length; j++) {
                        if (queueKeys[j] && queueKeys[j].indexOf('__r') >=0) {
                            queueKey = queueKeys[j];
                            queueOptions.push({'label':queues[i][queueKey] ?queues[i][queueKey].Name:queues[i].Id , 'value':queues[i][queueKey].EmailQueueId__c});
                        }
                    }                    
                }                
                 component.set('v.isQueue', true);
               // component.set('v.isManageQueue', true);
                component.set('v.queueOptions', queueOptions);                
            }
        });
        $A.enqueueAction(action);
    },
    getAllPermissionsByJobRoleId: function(component) {
    	var getPermAction = component.get('c.getPermissionsByJobroleId');
    	getPermAction.setParams({
            strJobRoleId : component.get('v.selectedOption')
        });
        getPermAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var permsResponse = response.getReturnValue(),
                	i = 0,
                	permsList = [];
                for(i in permsResponse) {
                	if (permsResponse[i].PermissionMasterId__r && permsResponse[i].PermissionMasterId__r.Name) {
                		permsList.push(permsResponse[i].PermissionMasterId__r.Name.toLowerCase());
                	}                					   
				}
				window.permsList = permsList;
                component.set('v.allPermsList', permsList);
                console.log(permsList);
            }
        });
        $A.enqueueAction(getPermAction);
    },
    checkPermissionByJobroleId : function(component, event, permissionName) {       
       var jobRoleId = component.get('v.selectedOption'),
		   action = component.get("c.checkPermissionByJobroleId"),
           thorPermissionsEvent = $A.get("e.c:ThorPermissionsAppEvent");
        action.setParams({	
            "strJobRoleId" : jobRoleId,
            "strPermissionName" : permissionName				
        });        
        action.setCallback(this, function(response) {
            var state = response.getState();            
            if (state === "SUCCESS") {
                var queueSelectionPermission = response.getReturnValue();
                component.set('v.queueSelectionPermission', queueSelectionPermission); 
                if (!queueSelectionPermission) {
                	this.assignPermissionSet(component);
                	//component.set('v.queueOptions', []);
                	//component.set('v.queueNames', '');
                    if (thorPermissionsEvent != undefined) {
                        thorPermissionsEvent.fire();   
                    }
                	component.set('v.isOpen', false);
                	// queueNames for T1 changes
                    component.set('v.queueNames', 'T1 - Petition Queue');      
                }                
            }else{
                console.log(state);
            }
        });
        $A.enqueueAction(action);
    },
})