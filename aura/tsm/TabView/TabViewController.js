({
	updateQueuedLabel: function(cmp, event, helper) {
        var count = cmp.get('v.queueCnt'),
            label = 'Queued - ' + count,
            tab = cmp.find('petitionQueue'),
            roleQueueEvent = $A.get("e.c:RoleQueueAppEvt");        
        cmp.set('v.queuedLabel', label);
        /*if (count === 0) {     
            roleQueueEvent.setParams({
                roleQueue : 'queueSelect',
                roleQueueObj: window.rqLabelObj
            });
            roleQueueEvent.fire();
        }*/        
    },
    
    handleComponentEvent: function(cmp, event) {
        //var completedCnt = event.getParam("completedCnt");
        //cmp.set("v.completedCnt", completedCnt);
        cmp.find('ptabs').set('v.selectedTabId', 'petitionQueue');
        if (!cmp.get('v.data').length) {
            var cmpTarget = cmp.find('qList').find('begin-message');
            $A.util.addClass(cmpTarget, 'slds-hide');
            cmp.set('v.ackMsg', true);
        }
    },
    
    setTabFlagQueued: function(component, event, helper) {
    	var spinner = component.find('TabViewSpinner');
    	$A.util.removeClass(spinner, "slds-hide")
        component.set('v.tabFlag', 'Queued');
        helper.tabViewEventFire(component, event, 'Queued');
        window.tabFlag = 'Queued';
        if (window.CatProdPersonaQueTab) {
            component.set('v.filterData', window.CatProdPersonaQueTab);
        }
        window.setTimeout(function(){
        	$A.util.addClass(spinner, "slds-hide");
        }, 500);        
    },
    
    setTabFlagCompleted: function(component, event, helper) {
    	var spinner = component.find('TabViewSpinner');
    	$A.util.removeClass(spinner, "slds-hide");
        component.set('v.tabFlag', 'Completed');
        window.tabFlag = 'Completed';
        // Application Event tabview Fire
        helper.tabViewEventFire(component, event, 'Completed');        
        helper.fetchCompletedCases(component, event);
        if (window.CatProdPersonaComTab) {
            component.set('v.filterData', window.CatProdPersonaComTab);
        }
        window.setTimeout(function() {
        	$A.util.addClass(spinner, "slds-hide");
        }, 500);
    },
    handleRowClickAppEvent: function(cmp, event, helper){        
        var tabFlag = cmp.get('v.tabFlag'),
            appEvent = $A.get("e.c:RowClickAppEvent"),            
            caseId = event.getParam('pk');        
        if(tabFlag == "Queued"){            
            helper.acceptAgentWork(cmp, event, caseId);
        }
        else{
            if (appEvent != undefined) {
                appEvent.setParams({
                    pk : caseId
                });
                appEvent.fire();
            }
        }
    }    
    
})