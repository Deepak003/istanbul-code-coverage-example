({
	getAllEvents : function(component, event) {
        //commented as not able to commit a case , as it is throwing exception
        var caseEventAction = component.get('c.getAllEventsForCase'),
            simpleCase = component.get('v.simpleCase');
        
        if (simpleCase && caseEventAction) {
                caseEventAction.setParams({'caseId': simpleCase.Id});
            //CallBack of the func
            caseEventAction.setCallback(this, function(response) {
                var state = response.getState(),
                    evntsVal = response.getReturnValue(),
                    lastEvent = '',
                    eventsLength = 0,
                    caseStatus = component.get('v.caseStatus'),
                    actionSummary = {};
                evntsVal = JSON.parse(evntsVal);
                if(evntsVal != null)
                eventsLength = evntsVal.length;
                if (state === "SUCCESS") {
                    component.set('v.lastActionLength', eventsLength);
                    if (eventsLength) {
                        for(var item of evntsVal) {
                            if (item.eventList && item.eventList.length) {
                                for(var eItemList of item.eventList) {
                                    if (eItemList.strEventCategory.toLowerCase() == 'casenoteaddition') {
                                        actionSummary.caseNote = eItemList.strEventNote;
                                    }
                                    if (eItemList.strEventCategory.toLowerCase() == 'accountnoteaddition') {
                                        actionSummary.accNote = eItemList.strEventNote;
                                    }
                                    if (eItemList.strEventCategory.toLowerCase() == 'hide') {
                                        actionSummary.contentAction = 'Hide';
                                        actionSummary.contentActionComment = eItemList.strReason;
                                    }
                                    if (eItemList.strEventCategory.toLowerCase() == 'unhide') {
                                        actionSummary.contentAction = 'Un Hide';
                                        actionSummary.contentActionComment = eItemList.strReason;
                                    }
                                    if (eItemList.strEventCategory.toLowerCase() == 'ban') {
                                        actionSummary.accActionLabel = 'Account Action(s)';
                                        actionSummary.accActionVal = 'Account suspende, ';
                                    }
                                    if (eItemList.strEventCategory.toLowerCase() == 'majorstrike') {
                                        var msval = '';
                                        if(eItemList.accountEventDetailList && eItemList.accountEventDetailList[0]) {
                                            msval = eItemList.accountEventDetailList[0].strNewValue - eItemList.accountEventDetailList[0].strOldValue;
                                        }
                                        actionSummary.accActionVal = actionSummary.accActionVal + msval+' Major Strike';
                                    }
                                    if (eItemList.strEventCategory.toLowerCase() == 'minorstrike') {
                                        var msval = '';
                                        if(eItemList.accountEventDetailList && eItemList.accountEventDetailList[0]) {
                                            msval = eItemList.accountEventDetailList[0].strNewValue - eItemList.accountEventDetailList[0].strOldValue;
                                        }
                                        actionSummary.accActionVal = actionSummary.accActionVal + msval+' Minor Strike';
                                    }
                                    
                                }
                                actionSummary.status = item.caseInteraction.Status_Out__c;
                                break;
                            }                            
                            if (caseStatus == 'Active' && item.caseInteraction.Status_Out__c) {                            
                                caseStatus = item.caseInteraction.Status_Out__c;
                                component.set('v.caseStatus', caseStatus);
                            }
                        }
                        component.set('v.lastAction', actionSummary);
                    }
                    console.log("Success with state: " + state);                
                }
                else {
                    console.log("Failed with state: " + state);
                }
            });
            // Send action off to be executed
            $A.enqueueAction(caseEventAction);
        }
	}
})