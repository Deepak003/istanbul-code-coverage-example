({
	init: function (component, event, helper) {
        window.caseHistoryArchiveSF = true;
        helper.getCaseHistoryData(component);
    },
    expandAllClick : function(component, event, helper) {
        var expandAllVal = component.get('v.expandAll');
        component.set('v.expandAll', !expandAllVal);
		console.log("Expand All clicked");
    },
    getAllCasesByAccIdSF: function(component, event, helper) {  
        if (window.caseHistoryArchiveSF) {
            helper.getAllCasesByAccIdSF(component);
        }
        else {
            if (window.caseHistoryArchive) {
            	helper.getCasesFromOmicron(component);
            }
        }     
    },
    caseHistoryRenderCmplt: function(component, event, helper) {
        event.stopPropagation();
        component.set('v.showSpinner', false);
    },    
})