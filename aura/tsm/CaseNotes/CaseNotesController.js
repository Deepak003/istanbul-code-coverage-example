({
	init : function(component, event, helper) {
		//helper.getCaseNotes(component);
	},
    getCaseNote: function(component, event, helper) {
        helper.getCaseNotes(component);
    },
    viewNoteClick: function(component, event, helper) {
        var caseNoteItems = component.find('caseNoteItem');
		component.set('v.viewAllFlag', true);
        for(var i =0; i < caseNoteItems.length; i++) {
            if($A.util.hasClass(caseNoteItems[i].getElement(), 'slds-hide')) {
                $A.util.toggleClass(caseNoteItems[i].getElement(), 'slds-hide');
            }
        }
	},
    collapseNoteClick: function(component, event, helper) {
        var caseNoteItems = component.find('caseNoteItem');
		component.set('v.viewAllFlag', false);
        for(var i =0; i < caseNoteItems.length; i++) {
            if(i > 0) {
                $A.util.toggleClass(caseNoteItems[i].getElement(), 'slds-hide');
            }
        }
	},
})