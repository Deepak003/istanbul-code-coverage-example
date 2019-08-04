({
	open : function(component) {
        let caseId = component.get("v.caseId");
       	const workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            workspaceAPI.openSubtab({
                parentTabId: response.tabId,
                recordId: caseId,
                focus: true                       
            }).catch(console.log);
        }).catch(console.log);
    } 
})