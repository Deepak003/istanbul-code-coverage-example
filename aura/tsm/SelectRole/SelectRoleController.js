({
    doInit: function(component, event, helper) {
        helper.getRoles(component,helper);  
    },
    closeModel: function(component, event, helper) { 
        component.set("v.isOpen", false); 
    },
    selectRole: function(component, event, helper) {
        var selectedOption = component.get('v.selectedOption'),
            isChangeRole = component.get('v.isChangeRole');
        if(selectedOption != undefined){            
             //helper.getPermissionSet(component); 
             //THOR Specific Get Queue
             var rData = component.get('v.roles').find( function(pData, pIndex) {                
                if (selectedOption == pData.JobRole__c) return pData;
            }),           
            roleLabel = rData ? rData.JobRole__r.Name : '';
            if (roleLabel) {
            	component.set('v.advisorRoleSelect', roleLabel);
                component.set('v.currentJobRole', rData.JobRole__c);
            }          
            // Check for Permission 
            helper.checkPermissionByJobroleId(component, event,'Queue Selection');
            helper.getQueuesByJobRoleId(component);
            helper.getAllPermissionsByJobRoleId(component);
             //component.set("v.isOpen", false);   
        }
    },
    handleRadioClick : function(component, event, helper){
        var selectionButton = component.find('selectButton');
        if(selectionButton && selectionButton.get('v.disabled')){
            selectionButton.set('v.disabled', false);
        }
        component.set('v.selectedOption', event.getSource().get('v.value'));
        /*var selectionButton = component.find('selectButton'),
        	seltedValue = event.getSource().get('v.value');
        if(selectionButton.get('v.disabled')){
            selectionButton.set('v.disabled', false);
        }
        if (component.get('v.selectedOption') != seltedValue) {
        	component.set('v.roleChanged', true);
        }
        component.set('v.selectedOption', seltedValue);*/
    },
    // THOR Specific Changes for Queue Selection
    queueSelected: function(component, event, helper) {
        var qvals = event.getSource().get('v.value'),
            selectionButton = component.find('selectQueuButton');
        if (qvals.length) {
        	if(selectionButton.get('v.disabled')){
	            selectionButton.set('v.disabled', false);
	        }
	        component.set('v.selectedQueueOptions', qvals);              
        }
        else {        	
	        selectionButton.set('v.disabled', true);	        
        }
    },
    selectQueue: function(component, event, helper) {
    	var selectionButton = component.find('selectButton'),
    		selectedQueueOptions = component.get('v.selectedQueueOptions'),
    		queueOptions = component.get('v.queueOptions'),
    		qLabels = [],
            roleLabel = '',
            qLabelLength = 0,
            nMoreLabel = 0,
            rData = '',
            thorPermissionsEvent = $A.get("e.c:ThorPermissionsAppEvent"),
            isManageQueue = component.get('v.isManageQueue'),
            isChangeRole = component.get('v.roleChanged');
        
    	for(var i=0; i<selectedQueueOptions.length; i++) {
           	rData = queueOptions.find(function(pData, pindex) {
                     if (pData.value == selectedQueueOptions[i]) {                 
                         return pData;
                     }
                });
			            // Added undefined condition for THOR-1020
            if(rData != undefined){
										  
            qLabelLength += rData.label?rData.label.length:0;
            if (qLabelLength >= 100) {
                nMoreLabel++;
            }
            qLabels.push(rData.label?rData.label:'');
			}
        }
    	component.set('v.nMoreLabel', nMoreLabel);    	    	
        if(!isManageQueue || isChangeRole) {
            // assign the permission sets 
            helper.assignPermissionSet(component); 
       	}
       	component.set('v.queueNames', qLabels.join(', '));    	
    	component.set("v.isOpen", false);         
        if (thorPermissionsEvent != undefined) {
            thorPermissionsEvent.fire();   
        }
    },
    changeRole: function(component, event, helper) {
    	component.set('v.isManageQueue', false);
        component.set('v.isChangeRole', true);
        component.set('v.isQueue', false);
        //component.set('v.roleChanged', true);      
    },
})