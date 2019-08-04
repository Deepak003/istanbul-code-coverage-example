({
	doInit : function(component, event, helper) { 
        component.set('v.today9AM', new Date().setHours(9,0,0,0));
        var caseId = component.get('v.caseId');        
        if(caseId != 'undefined'){
            helper.getCurrentCaseActivities(component);		
        }   
        
	},
    getCaseNotes: function(component, event, helper) {
        var caseId = component.get('v.caseId');        
        if(caseId != 'undefined') {
            helper.getCaseNotes(component);		
        }
    },
    openCaseTab: function(component, event, helper) {
        var openCaseTabEvent = component.getEvent("viewAllEvent");
        openCaseTabEvent.setParams({ "openCaseTab" : true }); 
        openCaseTabEvent.fire();
    },
    collapseClick: function(component, event, helper) {
        var activities = component.find('activityItem');
        component.set('v.viewAllFlag', true);
        component.set('v.viewCollapse', false);
        for(var i =0; i < activities.length; i++) {
            if(i > 1) {
                $A.util.toggleClass(activities[i].getElement(), 'slds-hide');
            }
        }
    }
})