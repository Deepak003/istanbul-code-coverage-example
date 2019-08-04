({
	doInit : function(component, event, helper) {
		helper.doInit(component, event, helper);
	},
    closeModal : function(component, event, helper) {
        //component.set('v.isOpen', false);
        var appEvent = $A.get("e.c:CloseBookMarkModalEvent");
        appEvent.fire();
    },
    successModal : function(component, event, helper) {
        helper.successModal(component, event, helper);
    },
    getStatus : function(component, event, helper) {
        component.set("v.selStatus", event.getParam("value"));
        if(component.get("v.selStatus") != '' && component.get("v.selReason") !='')
            component.set("v.isSuccessDisable", false);
            
    },
    getReason : function(component, event, helper) {
        component.set("v.selReason", event.getParam("value"));
        if(component.get("v.selStatus") != '' && component.get("v.selReason") !='')
            component.set("v.isSuccessDisable", false);
    }
})