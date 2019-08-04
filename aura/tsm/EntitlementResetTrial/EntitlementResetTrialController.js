({
	doInit : function(component, event, helper) {
        console.log(component.get('v.selectedEntitlement'));
	},
    closeModal : function(component, event, helper) {
        component.set('v.isOpen', false);
    },
    successModal : function(component, event, helper) {
        helper.resetFreeTrail(component, event, helper);
    },
})