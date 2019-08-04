({
	getCaseEventsData : function(component, event, helper) {		
        var caseType = component.get('v.caseType'),
            isArchived = component.get('v.isArchived');
        if (caseType && caseType.toLowerCase() != 'petition') {
            helper.getTranscripts(component);
            helper.getArchivedDetailsCase(component);
        }
        else {
            if (isArchived) {
                helper.getEventsOmnicron(component);
            }
            else {
                helper.getAllEvents(component, event);
            }                     
        }
	},
    expandClick: function(component, event, helper) {
        var currTarget = event.currentTarget,
            domauraId = 'evcontent',
            domContent = '';   
        if (!$A.util.hasClass(currTarget,'caseEventsData')) {
            currTarget = currTarget.closest('.caseEventsData');            
        }
        domauraId = domauraId + currTarget.getAttribute('data-id');
        domContent = component.find(domauraId);
        if (domContent) {            
            $A.util.toggleClass(domContent, 'slds-hide');
        }
    },
    expandClickTest: function(component, event, helper) {
        console.error('ERRRR');
    },
    popUpChatClicked: function(component, event, helper) {
        var currTarget = event.currentTarget,
            selData = component.get('v.chatTransArr'),
            popUpCmp =  component.find('popUpCmpCEV');   
        if (!$A.util.hasClass(currTarget,'slds-text-link')) {
            currTarget = currTarget.closest('.slds-text-link');            
        }
        
        if (popUpCmp && selData) {
            popUpCmp.set('v.isContentArray', true);
            popUpCmp.set('v.content', selData);
            popUpCmp.set('v.isPopUp', true);
        }
    },
})