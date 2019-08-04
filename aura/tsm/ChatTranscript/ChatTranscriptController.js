({
	doInit : function(component, event, helper) {
        helper.pullTabInfo(component);
        helper.setTabInfo(component);
        
		helper.pullTranscripts(component);
		//helper.mockData(component);
	}
})