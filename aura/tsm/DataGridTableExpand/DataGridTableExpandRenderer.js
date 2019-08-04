({    
    rerender : function( component, helper ) {
        this.superRerender();
        component.set('v.renderComp', true);
        var caseRenderEvent = $A.get("e.c:CaseHistoryRenderEvt");//component.getEvent('caseHistoryRender');
        if(caseRenderEvent) {                     
            caseRenderEvent.fire();
        }
        //$A.util.addClass(component.find('caseHistoryLoader'), 'slds-hide');  
    }	  
})