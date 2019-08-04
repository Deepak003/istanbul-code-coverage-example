({
	expandClick: function(component, event, helper) {
        var currTarget = event.currentTarget,
            domauraId = 'evcontent',
            domContent = '';   
        if (!$A.util.hasClass(currTarget,'caseEvents')) {
            currTarget = currTarget.closest('.caseEvents');            
        }
        $A.util.toggleClass(currTarget, 'slds-is-open');
    },
    popUpShow: function(component, event, helper) {
        var currTarget = event.currentTarget,
            selData = '',
            popUpCmp =  component.find('popUpCmp');   
        if (!$A.util.hasClass(currTarget,'slds-text-link')) {
            currTarget = currTarget.closest('.slds-text-link');            
        }
        if (currTarget) {
            selData = currTarget.getAttribute('data-model');
        }        
        if (popUpCmp && selData) {
            popUpCmp.set('v.content', selData);
            popUpCmp.set('v.isPopUp', true);
        }
    },
})