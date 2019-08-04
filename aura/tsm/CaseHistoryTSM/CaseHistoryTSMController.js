({
	init: function (component, event, helper) {
        helper.getCaseHistoryData(component);
    },
    handleFilterChange : function(component, event, helper) {
    	// TODO : Implementation of search funcationality
        if(event.getParam("targetComponent").includes(component.getName())) {
         	component.set("v.searchTerm", event.getParam("searchTerm"));
            console.log("searchTerm : ",component.get("v.searchTerm"));
        }
    }
})