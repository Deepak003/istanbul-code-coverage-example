({
    pullTabInfo: function(component) {
        const pageReference = component.get("v.pageReference");
        if(pageReference && pageReference.state) {
            const state = pageReference.state;
            component.set("v.caseId", state.c__caseId);
            component.set("v.caseNumber", state.c__caseNumber);            
            component.set("v.isArchiveCase", state.c__isArchiveCase == "true");            
        }
    },
    setTabInfo: function(component) {
        const workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            if(Array.isArray(response.subtabs)) {
                response.subtabs.forEach(function(subtab){
                    const tabId = subtab.tabId;
                    const title = subtab.pageReference.state.c__tabTitle;
                    const icon = subtab.pageReference.state.c__tabIcon;
                    
                    
                    workspaceAPI.setTabLabel({
                        tabId: tabId,
                        label: title
                    });
                    workspaceAPI.setTabIcon({
                        tabId: tabId,
                        icon: icon
                    });                
                });            
            }else {
                const tabId = response.tabId;
                const title = response.pageReference.state.c__tabTitle;
                const icon = response.pageReference.state.c__tabIcon;
                
                workspaceAPI.setTabLabel({
                    tabId: tabId,
                    label: title
                });
                workspaceAPI.setTabIcon({
                    tabId: response.tabId,
                    icon: icon
                });
            }
        })
        .catch(console.log);  
    },
})