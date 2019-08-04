({
    doInit : function(component, event, helper) {
        var codeSearchData = component.get("v.codeSearchData");
        component.set("v.code", codeSearchData.codeString);
    },
    closeConsumeCodes : function(component, event, helper) {
        component.set("v.consumeCodes", false);
        component.set("v.code", '');
        component.set("v.codeSearchData", {});
    },
    confirmConsume : function(component, event, helper) {
        helper.consumeCode(component, event);
    }
})