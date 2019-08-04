({
    init : function(component, event, helper){
        helper.getFraudState(component, event);
    },
    
    closeModal : function(component, event, helper) {
        component.set('v.isOpen', false);
    },
    
    activateCooldownClick : function(component, event, helper){
        component.set('v.isOpen', true);
    },
    
    activateClick : function(component, event, helper){
    	helper.activateCooldown(component, event);
	}
})