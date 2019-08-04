({
	handleNoViolationClick : function(component, event, helper) {		
        var violationEvent = $A.get("e.c:ViolationActionClickEvt");
        if (violationEvent != undefined) {
            violationEvent.setParams({
                violationFlag : component.get('v.violationFlag'),
                lstOfViolationMsg: component.get('v.lstcontentData')
            });            
            violationEvent.fire();
        }
		component.find("overlayLib").notifyClose();        
	},
    // Violation selected event
    violationSelectEvent: function(component, event, helper) {
        var buttonLabelFlg = event.getParam("violationFlg"),
            buttonLabel = "No Violation",
            rValidation = event.getParam("rValidation"),
            qValidation = event.getParam("qValidation"),
            lstOfMsg = event.getParam('lstOfViolationMsg'),
            queueSelectionPermission = component.get('v.queueSelectionPermission');
        if (buttonLabelFlg) {
            buttonLabel = "Violation confirmed";
        }
        if (rValidation) {
            var nextBtn = component.find('next');
            component.set('v.roleValidFlag', true);
            component.set('v.jobRoleId', event.getParam('jobRoleId'));
            $A.util.removeClass(nextBtn, 'thor-disable');
        }
        if (qValidation || qValidation == false) {
            var saveBtn = component.find('save');
            if (qValidation) {
                $A.util.removeClass(saveBtn, 'thor-disable');
            }
            else {
                $A.util.addClass(saveBtn, 'thor-disable');
            }
            component.set('v.queueValidFlag', qValidation);
        }
        if(!queueSelectionPermission) {            
            var saveBtn = component.find('save');            
            $A.util.removeClass(saveBtn, 'thor-disable');
        }
        if (lstOfMsg) {
            component.set('v.lstcontentData', lstOfMsg);
        }
        component.set('v.buttonLabel', buttonLabel);
        component.set('v.violationFlag', buttonLabelFlg);
        event.stopPropagation();
    },
    
    cancelButtonClick: function(component, event, helper) {
        component.find("overlayLib").notifyClose();
    },
    nextButtonClick: function(component, event, helper) {
        var changeRole = component.find('changeRole'),
            nextBtn = component.find('next'),
            saveBtn = component.find('save'),
            roleValidFlag = component.get('v.roleValidFlag');
        
        if (!roleValidFlag) {
            if(!$A.util.hasClass(nextBtn, 'thor-disable')) {
                $A.util.addClass(nextBtn, 'thor-disable');
            }
            return;
        }
        else {
            $A.util.removeClass(nextBtn, 'thor-disable');
        }
        var nextSaveFlag = component.get('v.nextSaveFlag');
        component.set('v.nextSaveFlag', !nextSaveFlag);
        var roleQueueEvent = $A.get("e.c:RoleQueueAppEvt");
        
        if (roleQueueEvent != undefined) {
            roleQueueEvent.setParams({
                roleQueue : 'roleSelect'
            });
            roleQueueEvent.fire();            
        } 
    },
    
    changeRoleButtonClick: function(component, event, helper) {
        var changeRole = component.find('changeRole'),
            nextBtn = component.find('next'),
            saveBtn = component.find('save'),
            roleQueueEvent = $A.get("e.c:RoleQueueAppEvt");        
        if (roleQueueEvent != undefined) {
            roleQueueEvent.setParams({
                roleQueue : 'changeRole'
            });
            roleQueueEvent.fire();            
        }
        //$A.util.toggleClass(changeRole, 'slds-hide');
        //$A.util.toggleClass(nextBtn, 'slds-hide');
        //$A.util.toggleClass(saveBtn, 'slds-hide');
        var nextSaveFlag = component.get('v.nextSaveFlag');
        component.set('v.nextSaveFlag', !nextSaveFlag);
    },
    saveButtonClick: function(component, event, helper) {        
        var roleQueueEvent = $A.get("e.c:RoleQueueAppEvt"),
            //queueSelectionPermission = component.get('v.queueSelectionPermission'),
            queueValidFlag = component.get('v.queueValidFlag'),
            saveBtn = component.find('save'),
            jobRoleId = component.get('v.jobRoleId');
        helper.checkPermissionByJobroleId(component, event,'Queue Selection');      
        
        /*if (!queueValidFlag) {
            if(!$A.util.hasClass(saveBtn, 'thor-disable')) {
                $A.util.addClass(saveBtn, 'thor-disable');
            }
            return;
        }
        else {
            $A.util.removeClass(saveBtn, 'thor-disable');
        }       
        if (roleQueueEvent != undefined && queueSelectionPermission) {
            roleQueueEvent.setParams({
                roleQueue : 'queueSelectFooter'
            });
            roleQueueEvent.fire();            
        }
        component.find("overlayLib").notifyClose();*/
    },
    onQueueSelectionPermissionChange: function(component, event, helper) {
        
        var roleQueueEvent = $A.get("e.c:RoleQueueAppEvt"),
            queueSelectionPermission = component.get('v.queueSelectionPermission'),
            queueValidFlag = component.get('v.queueValidFlag'),
            saveBtn = component.find('save'),
            jobRoleId = component.get('v.jobRoleId');
        helper.assignPermissionSetAndQueues(component,jobRoleId); //"a3Tq0000000jvO5" 
        
        if (roleQueueEvent != undefined && queueSelectionPermission) {
            roleQueueEvent.setParams({
                roleQueue : 'roleSelect'
            });
            roleQueueEvent.fire();            
        } 
        /*if (roleQueueEvent != undefined && queueSelectionPermission) {
            roleQueueEvent.setParams({
                roleQueue : 'queueSelectFooter'
            });
            roleQueueEvent.fire();            
        }*/
       // component.find("overlayLib").notifyClose();
    }
})