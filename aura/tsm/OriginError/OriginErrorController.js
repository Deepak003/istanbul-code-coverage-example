({
	doInit : function(component, event, helper) {
		helper.setTabInfo(component);        
        
        const pageReference = component.get("v.pageReference");
        if(pageReference && pageReference.state) {
            const state = pageReference.state;
            component.set("v.originId", state.originId);
        }
	},    
    fetchLogs: function(component, event, helper) {
        helper.fetch(component);
    },
    fetchLogContent: function(component, event, helper) {
        if(component.get("v.trackingId"))
        	helper.fetchContent(component);
    }
})