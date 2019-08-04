({
    closeSearchCodes : function(component, event, helper) {
        component.set("v.searchCodes", false);
        component.set("v.code", '');
        component.set('v.codeSearchData', {});
    },
    handleOpenAccount : function(component, event, helper) {
        helper.openAccountTab(component, event);
    },
    handleSearch: function (component, event, helper) {
        helper.searchCode(component, event);
    },
    handleConsumeCode : function(component, event, helper) {
        component.set("v.searchCodes", false);
        component.set("v.consumeCodes", true);
    }
})