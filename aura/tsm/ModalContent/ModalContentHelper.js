({
	getQueueListByJobRoleId : function(component, jobRoleId) {
		var action = component.get("c.getQueuesByJobRoleId"),
            spinner = component.find('spinnerQueueJR');
        action.setParams({
            strJobRoleId: jobRoleId
        });        
        $A.util.toggleClass(spinner, 'slds-hide');
        action.setCallback(this, function(response) {
            var state = response.getState();
            $A.util.toggleClass(spinner, 'slds-hide');
            if (state === "SUCCESS") {
                var userRoles = response.getReturnValue(),
                    queueOptions = [];
                if (!userRoles.length) {
                    component.find("overlayLib").notifyClose();
                }
                for(var i=0; i<userRoles.length; i++) {
                    var queueKeys = Object.keys(userRoles[i]),
                        queueKey = '';
                    for (var j=0; j<queueKeys.length; j++) {
                        if (queueKeys[j] && queueKeys[j].indexOf('__r') >=0) {
                            queueKey = queueKeys[j];
                            queueOptions.push({'label':userRoles[i][queueKey] ?userRoles[i][queueKey].Name:userRoles[i].Id , 'value':userRoles[i][queueKey].EmailQueueId__c});
                        }
                    }                    
                }
                if (!queueOptions.length) {
                    var roleQueueEvent = $A.get("e.c:RoleQueueAppEvt");        
                    if (roleQueueEvent != undefined) {
                        roleQueueEvent.setParams({
                            roleQueue : 'queueSelectFooter'
                        });
                        roleQueueEvent.fire();            
                    }
                    component.find("overlayLib").notifyClose();
                }
                window.queueOptions = queueOptions;
                component.set('v.queueOptions', queueOptions);
            }else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
	}
})