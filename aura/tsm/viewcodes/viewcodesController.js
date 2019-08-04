({
    doInit : function(component, event, helper) {
        helper.initHelper(component, event, helper);
    },
    closeviewcodes : function(component, event, helper) {
        component.set("v.viewcodes", false);
    }
})