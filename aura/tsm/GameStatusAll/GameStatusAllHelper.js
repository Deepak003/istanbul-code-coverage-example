({
	getGameStatusAll : function(component, event) {
		var action = component.get("c.getAttachedStatuses");
        var customerId = component.get("v.nucleusId");
        
        var toastEvent = $A.get("e.force:showToast");
        action.setParams({
            strCustomerId : customerId,
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue(),
                    gameStatus = 'Active',
                    suspendObj = '';
                if (storeResponse.userAttachedStatus.length) {
                    storeResponse.userAttachedStatus.forEach( ele => {
                        if (ele.franchise == 'ALL') {
                        	gameStatus = 'Suspend';
                        	var reason = ele.subStatuses.subStatus[0].reasons;
                            reason = reason ? reason.replace(/_/g, ' ') : reason;
                            var endDate = ele.subStatuses.subStatus[0].endDate;
                            endDate = endDate ? endDate.replace("Z", ":00.000Z") : endDate;
                            component.set('v.suspendReason', ele.subStatuses.subStatus[0].reasons);
                            component.set('v.endDateTime', endDate);
                            suspendObj = {'created': this.dateFormat(ele.subStatuses.subStatus[0].dateCreated),
                                          'susEnds': this.dateFormat(ele.subStatuses.subStatus[0].endDate),
                                          'reason': reason};
                        }                       
                    });
                }
                else {
                    gameStatus = 'Active';
                }
                component.set('v.gameStatus', gameStatus);
                
                if (gameStatus != 'Active') {                	
                    component.set('v.gameStatusObj', suspendObj);
                }                
            }
        });
        $A.enqueueAction(action);
	},
    
    //Get reasons for games
    getGameSuspensionReasons : function(component, event) {
        var action = component.get("c.getFranchiseBanReasons");
        
        var toastEvent = $A.get("e.force:showToast");
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set('v.openSpinner', false);
            
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                if (typeof storeResponse === 'string') {
                    storeResponse = JSON.parse(storeResponse);
                }
                var gstatusReason = [],
                	reasonResponse = storeResponse.response ? storeResponse.response : storeResponse;
                reasonResponse.forEach(item => {
                    gstatusReason.push({'label': item.name ? item.name : item.Name, 'value':item.id})
            	});
                component.set('v.gameStatusReasons', gstatusReason);
                //component.set('v.addSuspensionModal', true);
            }
        });
        $A.enqueueAction(action);
    },
    
    //Add Suspension to Games
    addSuspensionToGames : function(component, event) {
    	var reason = component.get('v.suspendReason'),
    		dateTime = component.get('v.endDateTime'),
    		accountId = component.get('v.accountId'),
    		caseId = component.get('v.caseId'),
    		currEndDateTime = component.get('v.currEndDateTime'),
    		currReason = component.get('v.currReason'),
    		editSuspend = component.get('v.editSuspendFlag');
    	
        var action = component.get("c.banAttachedStatus");
        var customerId = component.get("v.nucleusId");
        
        //Mark the edit suspend to false
        component.set('v.editSuspendFlag', false);
        
        var toastEvent = $A.get("e.force:showToast");
        var reqPayload = {
        					type: "FRANCHISE_BAN",
        				    reasons: reason,
        				    readOnly: false,
        				    franchise: "ALL",
        				    endDate: (dateTime != undefined && dateTime != '') ? dateTime.slice(0, 16)+'Z' : '',
        				    title: 'ALL'};
        
               
        var reqParams = {        				
        				AccountId: accountId,
        				customerId: customerId,
        				caseId: caseId,
        				data: JSON.stringify(reqPayload)
        			};
        
        
        
        if (editSuspend) {
        	var action = component.get("c.updateAttachedStatus");
        	var reqParams = {        				
        				AccountId: accountId,
        				customerId: customerId,
        				caseId: caseId,
        				currentEndDate: currEndDateTime.slice(0, 16)+'Z',
        				currentReason: currReason,
        				data: JSON.stringify(reqPayload)
        			};	        
        }
        action.setParams({
            reqParameters: reqParams
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set('v.openSpinner', false);
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                var gameStatus = !storeResponse.pidId ? 'Active' : 'Suspended';
                component.set('v.gameStatus', gameStatus); 
                var datetimeArr = (new Date()).toISOString().slice(0, 16).replace("T", " ");
                var reason = storeResponse.subStatuses.subStatus[0].reasons;
                	reason = reason ? reason.replace(/_/g, ' ') : reason;
                var suspendObj = {'created': this.dateFormat(storeResponse.subStatuses.subStatus[0].dateCreated),
                				  'susEnds': this.dateFormat(storeResponse.subStatuses.subStatus[0].endDate),
                				  'reason': reason};
                component.set('v.gameStatusObj', suspendObj);
                //Fire events for product snapshot page to refresh
                var gameStREvent = $A.get("e.c:GameStatusAllRefresh");
                gameStREvent.setParams({ "gameStatusAllObj" : suspendObj });
				gameStREvent.fire();
            }
            else {
                //ERROR Message
                component.set('v.suspendReason', component.get('v.currReason'));
                component.set('v.endDateTime', component.get('v.currEndDateTime'));
                toastEvent.setParams({
			        type: 'error',
			        message: "All Game Status not updated successfully."
			    });
                toastEvent.fire(); 
            	console.log('ERROR');
            }
            component.set('v.addSuspensionModal', false);
        });
        $A.enqueueAction(action);
    },
    
    resetSuspensionToGames: function(component, event) {
    	var reason = component.get('v.suspendReason'),
    		dateTime = component.get('v.endDateTime'),
    		accountId = component.get('v.accountId'),
    		caseId = component.get('v.caseId');
    	
        var action = component.get("c.unbanAttachedStatus");
        var customerId = component.get("v.nucleusId");
        
        var reqPayload = {
        					type: "FRANCHISE_BAN",        				    
        				    franchise: "ALL",        				    
        				    title: 'ALL'};
        var reqParams = {        				
        				AccountId: accountId,
        				customerId: customerId,
        				caseId: caseId,
        				currentEndDate: dateTime.slice(0, 16)+'Z',
        				currentReason: reason,
        				data: JSON.stringify(reqPayload)
        			};
        
        action.setParams({
            reqParameters: reqParams
        });
        var toastEvent = $A.get("e.force:showToast");
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set('v.openSpinner', false);
            if (state === "SUCCESS") {            	
                var storeResponse = response.getReturnValue();
                //var gameStatus = !storeResponse.pidId ? 'Active' : 'Suspended';
                component.set('v.gameStatus', 'Active'); 
                var datetimeArr = (new Date()).toISOString().slice(0, 16).replace("T", " ");                
                component.set('v.gameStatusObj', {});    
                //Success Message
                toastEvent.setParams({
			        type: 'success',
			        message: "All Game Status successfully updated."
			    });
			     
                //Fire events for product snapshot page to refresh
                var gameStREvent = $A.get("e.c:GameStatusAllRefresh");
                gameStREvent.setParams({ "gameStatusAllObj" : '' });
				gameStREvent.fire();
            }
            else {
                //ERROR Message
                toastEvent.setParams({
			        type: 'error',
			        message: "All Game Status not updated successfully."
			    });
            	console.log('ERROR');
            }
            toastEvent.fire(); 
            component.set('v.restoreSuspensionModal', false);
            component.set('v.addSuspensionModal', false);
        });
        $A.enqueueAction(action);        
    },    
    
    
    dateFormat : function(date) {
    	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    	var datetimeArr = date.slice(0, 16).replace("T", " ");
    	
    	return months[parseInt(datetimeArr.slice(5,7)) -1] + '/' + datetimeArr.slice(8,10) + '/'+datetimeArr.slice(0,4) +' '+datetimeArr.slice(11,16) + 'UTC';
    }
})