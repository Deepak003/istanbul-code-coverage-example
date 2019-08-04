({
    //getCaseUpdates : function(component, event, helper) {
    //    helper.getCaseUpdates(component, event);
    //},
    toggleState: function(component, event, helper) {
        helper.toggleState(component, event);
    },
    toggleStateAll: function(component, event, helper) {
        if(event.getParam("targetComponent").includes(component.getName()))
        	helper.toggleStateAll(component, event);
    },
    handleFilterChange: function(component, event, helper) {
        if(event.getParam("targetComponent").includes(component.getName()))
        	helper.handleFilterChange(component, event);
    },
    //doRefresh : function(component, event, helper) {
    //    if(event.getParam("targetComponent") == component.getName())
    //    	helper.doRefresh(component, event);
    //},
    onSortOrderChange : function(component, event, helper) {
        helper.onSortOrderChange(component, event);
    },
    // onPageNoChange : function(component, event, helper) {
    //     helper.getNextPage(component, event);
    // }
})