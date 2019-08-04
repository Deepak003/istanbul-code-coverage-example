({
	init : function(component, event, helper) { 
		component.set('v.viewAllFlag', false);
        component.set('v.viewCollapse', false);
        var caseId = component.get('v.caseId');        
        if(caseId != 'undefined'){
            helper.getCaseNotes(component);		
        }        
	},
    getCaseNotes: function(component, event, helper) {
        var caseId = component.get('v.caseId');        
        if(caseId != 'undefined') {
            helper.getCaseNotes(component);		
        }
    },
    viewAllClick: function(component, event, helper) {
        var activities = component.find('activityItem');
        component.set('v.viewAllFlag', false);
        component.set('v.viewCollapse', true);
        for(var i =0; i < activities.length; i++) {
            if($A.util.hasClass(activities[i].getElement(), 'slds-hide')) {
                $A.util.toggleClass(activities[i].getElement(), 'slds-hide');
            }
        }        
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