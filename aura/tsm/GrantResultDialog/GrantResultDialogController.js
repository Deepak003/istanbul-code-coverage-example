({
    doInit: function(component, event, helper) {
    },
    closeConfirmation : function(component, event, helper) {
        component.set("v.openGrantResponse", false);
        //Bubbling the data back to the Grant container
        var componentEvent = component.getEvent("grantResetEvent");
        componentEvent.setParam("type", "grantReset");
        componentEvent.fire(); 
    },
})