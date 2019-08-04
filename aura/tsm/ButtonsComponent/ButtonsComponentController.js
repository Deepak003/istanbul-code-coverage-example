({
 	handleCancelClick : function (component, event, helper) {
       var resetEvent = component.getEvent("resetEvent");
       resetEvent.fire();
    }
})