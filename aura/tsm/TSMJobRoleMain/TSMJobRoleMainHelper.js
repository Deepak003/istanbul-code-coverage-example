({
    getUserRoles : function(component, event) {        
        var action = component.get("c.getRoles");
        var roleOptions = component.get('v.roleOptions');
        if (roleOptions && roleOptions.length) {
            return;
        }
        action.setCallback(this, function(response) {
            var state = response.getState();                
            if (state === "SUCCESS") {
                var userRoles = JSON.parse(response.getReturnValue().roleslist);               
                var roleOptions = [];
                var currentRoleId = response.getReturnValue().currentRoles;
                for(var i=0; i<userRoles.length; i++) {                    
                    roleOptions.push({'label':userRoles[i].roleName , 'value':userRoles[i].roleId});
                }             
                component.set('v.roleOptions', roleOptions);            
                component.set('v.roleFlag', true);
                component.set('v.selectedRole', currentRoleId);
                
                if (roleOptions && !roleOptions.length) {
                    component.set('v.noRoleDefined', 'No Role is assigned to you. Please contact System Administrator.');
                    component.set('v.selectRoleBtn', '');
                }
                var jobRoleSelected = sessionStorage.getItem("isJobRoleSelected");
                //Single Job role not shows the pop up modal and if the JobRole ID already added in SF
                if (roleOptions.length == 1 && currentRoleId && roleOptions[0].value == currentRoleId) {
                    jobRoleSelected = true;
                    sessionStorage.setItem("isJobRoleSelected", true);
                    component.set('v.selectedRole', currentRoleId);
                    this.getPermissionSet(component); 
                }
                if (currentRoleId) {
                	component.set("v.isSuccessDisable", false);
                }
                
                if (!jobRoleSelected) {
                    component.set('v.isOpen', true);                    
                }                
            }else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },
    getPermissionSet: function(component) {
        var action = component.get('c.getPermissionFromJobRole'); 
        // Set up the callback
        action.setParams({
            jobRoleID : component.get('v.selectedRole'),
            isTSM: component.get('v.isTSM'),
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                component.set("v.permissionSet", storeResponse);
            }
        });
        $A.enqueueAction(action);
    },
    
    getAllTabInfo : function(component, event, helper,target,selectRoleId, roleName) {
        var workspaceAPI = component.find("workspace");
        var target = target;
        component.set('v.selectedRoleName', roleName);
        component.set("v.target",target);
        //component.set("v.showChangeJobRole", true);
        workspaceAPI.getAllTabInfo().then($A.getCallback(function(response) {
            component.set("v.tabsInfo",response);
            var caseList = [],
				liveChatFlag = false;
            response.forEach(tab => { 
			    if (tab.pageReference.attributes.objectApiName == 'LiveChatTranscript') {                     
                    liveChatFlag = true;
                }
                if(tab.pageReference.attributes.objectApiName == 'Case') {
					caseList.push(tab.pageReference.attributes.recordId)
				} 
			});
			if (caseList.length && !liveChatFlag) {
				helper.checkCaseStatus(component, caseList, selectRoleId, response.length, roleName);
			}
			else if(liveChatFlag) {
				helper.jobRoleNotChangedMsg();
			}
			else if(!caseList.length) {
				var omniAPI = component.find("omniToolkit");
				omniAPI.logout().then(function(result) {
					if (result) {
						console.log("Logout successful");
					} else {
						console.log("Logout failed");
					}
				}).catch(function(error) {
					console.log(error);
				})
				component.set('v.selectedRole', selectRoleId);					
                helper.getPermissionSet(component); 
                helper.getAllPermissionsByJobRoleId(component, true);
			}
            
       }))
        .catch(function(error) {
            console.log('errorLog 123-->'+error);
        });
    },
    checkCaseStatus : function (component, caseList, selectRoleId, tabLength, selectRoleName) {
        var action = component.get('c.getOpenCaseStatus'); 
        var self = this;
        // Set up the callback
        action.setParams({
            lstCaseIds : caseList
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                if (storeResponse) {
                    self.jobRoleNotChangedMsg();
                } 
                else {
                    if (tabLength) {
                        //component.set("v.isChangeJobRole", true);
                        $A.get("e.c:JobRoleSelectionCheck").setParams({roleId: selectRoleId, roleName: selectRoleName}).fire();
                    }
                    else {
                        component.set('v.selectedRole', selectRoleId);					
                        self.getPermissionSet(component); 
                        self.getAllPermissionsByJobRoleId(component);
                    }                	
                }               
            }
        });
        $A.enqueueAction(action);
    },    
    
    closeAllTabs:function(component,event,helper,target){
       this.closeWorkTab(component,event,helper);
    },
    closeWorkTab: function (component,event,helper) {
        var workspaceAPI = component.find("workspace");
        var tabsInfo = component.get("v.tabsInfo");
        var roleId = component.get("v.selectedRoleId"),
            roles = component.get('v.roleOptions');
        var selectedRoleName = component.get('v.selectedRoleName');
        workspaceAPI.getAllTabInfo().then($A.getCallback(function(response) {            
            response.forEach(tab => { 
                var focusedTabId = tab.tabId; //response.tabId;
	            workspaceAPI.closeTab({tabId: focusedTabId});
            });            
       }))
        .catch(function(error) {
            console.log('errorLog 123-->'+error);
        });
        component.set('v.selectedRole', roleId)
        var appEvent = $A.get("e.c:jobroleAppEvt");        
        if(appEvent){
            	appEvent.setParams({                	
                	"roleName" :roleId
               });
             appEvent.fire();
        } 
        
        var successMsg = ' ';
		var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
            	mode: 'dismissible',
				title: 'Job role changed to '+ '" '+ selectedRoleName +' "',
                message: successMsg,
                type : 'success'
             });
        toastEvent.fire();
        component.set('v.isChangeJobRole', false);
        component.set('v.isJobRoleChange', false);
        setTimeout(window.location.reload, 500);
    },
    getAllPermissionsByJobRoleId: function(component, noCaseList) {
        var action = component.get('c.getJobRolePermissions');        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue(),
                    i = 0,
                    permissionsList = [];
                if(storeResponse != null){
                    for(i in storeResponse) {
                        if (storeResponse[i].PermissionMasterId__r && storeResponse[i].PermissionMasterId__r.Name) {
                            permissionsList.push(storeResponse[i].PermissionMasterId__r.Name.toLowerCase());
                        }                					   
                    }
                    window.permissionsList = permissionsList;
                    component.set('v.allPermsList', permissionsList);
                    console.log(permissionsList);
                    if (noCaseList) { 
                        window.location.reload();
                    }
                }
            }
            else if(state === "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                        toastEvent.setParams({
                            "message":  errors[0].message,
                            "type" : "error"
                        });  
                        console.log("Failed with state: " + state);
                    }
                    toastEvent.fire();
                }
            }
        });
        $A.enqueueAction(action);
    },
	jobRoleNotChangedMsg: function() {
		var errorMsg = 'You have one or more active cases open. Save and close the cases first. \n';
		var toastEvent = $A.get("e.force:showToast");
			toastEvent.setParams({
				mode: 'dismissible',
				title: 'Job role cannot be changed.',
				message: errorMsg,
				type : 'warning'
			});
		toastEvent.fire(); 
    },
    closeModal:function(component,event,helper){
        $A.get("e.c:JobRoleModalCloseEvent").setParams({closeModal:true}).fire();
                   
    }
})