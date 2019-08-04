({
	doInit: function(component, event, helper) {
        var customerId = component.get("v.nucleusId");
        if (customerId) {
            helper.getGameStatusAll(component, event);
        }                
    },
    
    addSuspension : function(component, event, helper) {
    	var banReasons = component.get('v.gameStatusReasons');
    	component.set('v.addSuspensionModal', true);
    	//Check if the reasons are already fetched
    	if (!banReasons) {
    		component.set('v.openSpinner', true);    	
    		helper.getGameSuspensionReasons(component, event);
    	}
    	
	},
    addSuspendClick : function(component, event, helper) {
        //helper.getGameSuspensionReasons(component, event);
		helper.addSuspensionToGames(component, event); 
		component.set('v.openSpinner', true);
		component.set('v.suspendButton', 'Suspend');
	},
    editDurationGameStatus : function(component, event, helper) {
    	var currReason = component.get('v.suspendReason'),
    		currEndDateTime = component.get('v.endDateTime'),
    		banReasons = component.get('v.gameStatusReasons');
    	
    	//Check if the reasons are not fetched already
    	if (!banReasons) {
    		component.set('v.openSpinner', true);    	
    		helper.getGameSuspensionReasons(component, event);
    	}
    	component.set('v.suspendButton', 'Save');
    	component.set('v.isSuccessDisable', true);
    	component.set('v.currEndDateTime', currEndDateTime);
    	component.set('v.currReason', currReason);
    	component.set('v.editSuspendFlag', true);
    	component.set('v.addSuspensionModal', true);	
    	//helper.editSuspensionToGames(component, event, currEndDateTime, currReason);
		
	},
	
    resetGameStatus : function(component, event, helper) {
		component.set('v.restoreSuspensionModal', true);
	},
    
    closeSuspendModal: function(component, event, helper) {
		component.set('v.addSuspensionModal', false);
	},
	
	restoreSuspendClick: function(component, event, helper) {		
		component.set('v.openSpinner', true);
		helper.resetSuspensionToGames(component, event);
	},
	
	closeRestoreModal: function(component, event, helper) {
		component.set('v.restoreSuspensionModal', false);
	},
	
	validateDate: function(component, event, helper) {
		//Validate date
		var validityCmp = component.find("endDateTime"),
			currDate = new Date(),
    		dateTime = component.get('v.endDateTime'),
    		returnFlg = true,
    		reason = component.get('v.suspendReason'),
            editSuspendFlag = component.get('v.editSuspendFlag'),
            validityMsg = editSuspendFlag ? 'New end date/time must be greater than Current' : 'End date/time must be greater than current date/time';
		
        //TSM-4467 - Adding undefined check to prevent component error
        if(dateTime != undefined){
    		if (dateTime <= currDate.toISOString()) {
    			validityCmp.setCustomValidity(validityMsg);
    			returnFlg = false;
                component.set("v.isSuccessDisable", true); //TSM-4467 - For turning the button disable
    		}		
    		else {
    			validityCmp.setCustomValidity("");			
    		}
    		if (!reason) {
    			returnFlg = false;
    		}		
    		if (returnFlg) {
    			component.set("v.isSuccessDisable", false);
    		}
        }else{
            returnFlg = false;
        }		

		return returnFlg;		
	},
	validateReason : function(component, event, helper) {
		var reason = component.get('v.suspendReason'),
    		dateTime = component.get('v.endDateTime'),
    		suspendReason = component.find('suspendReason');
    	if (!reason) {
    		console.log('False');
    	}
	},
    gameStatusFocusIn: function(component, event, helper) {
        var tooltipFlg = component.get("v.displayTooltip");
        component.set("v.displayTooltip",!tooltipFlg);
        
        console.log('IN');
    },
    getGameStatus: function(component, event, helper) {
    	var params = event.getParam('arguments');
        if (params) {
            var gameStatObj = params.gameStatus;
            var status = gameStatObj ? 'Suspended' : 'Active';
            component.set('v.gameStatus', status);
            component.set('v.gameStatusObj', gameStatObj);
        }
    }
})