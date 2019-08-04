({
	init: function (component, event, helper) {
        // TODO
    },
    getCompletedCases: function (component, event, helper) {
        // TODO
        helper.fetchCompletedCases(component, event);
    },
    
    viewOldClick: function(component, event, helper) {
        var viewOldEvt = component.getEvent("tabViewCountEvent");
        if (viewOldEvt != undefined) {
            viewOldEvt.fire();
        }
    }
})