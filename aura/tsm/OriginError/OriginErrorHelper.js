({
    setTabInfo: function(component) {
        const workspaceAPI = component.find("workspace");
        
        workspaceAPI.getEnclosingTabId().then(function(tabId) {
            workspaceAPI.getTabInfo({
                tabId: tabId
            }).then(function(response) {
                if(Array.isArray(response.subtabs)) {
                    response.subtabs.forEach(function(subtab){
                        this.setTabDetails(component, subtab);
                    });            
                }else {
                    this.setTabDetails(component, response);
                }
            }.bind(this)).catch(console.log);
        }.bind(this)).catch(console.log);        
        
    },
    setTabDetails: function(component, subtab) {
        const workspaceAPI = component.find("workspace");
        
        const tabId = subtab.tabId;
        const title = subtab.pageReference.state.tabTitle;
        const icon = subtab.pageReference.state.tabIcon;
        
        if(title) {
            workspaceAPI.setTabLabel({
                tabId: tabId,
                label: title
            });    
        }
        
        if(icon) {
            workspaceAPI.setTabIcon({
                tabId: tabId,
                icon: icon
            });  
        }
    },
    fetch: function(component) {
        const action = component.get("c.getOERLogs");
        
        action.setParams({
            strOriginId : component.get("v.originId")
        });
        
        component.set("v.isLoading", true);
        action.setCallback(this, function(response) {
            component.set("v.isLoading", false);
            const state = response.getState();
            if (state === "SUCCESS") {
                const res = JSON.parse(response.getReturnValue() || '{}');
                const logs = res.logs || {};
                const breakdown = res.breakdown || {};
                const logValues = Object.entries(logs).map((obj)=>({value: obj[1],label: obj[0]}));
                
                component.set("v.trackingId", breakdown.trackingId);
                component.set("v.logs", logValues);
                component.set("v.selectedLogValue", logValues[0] ? logValues[0].value : '');
            }else{
                Util.handleErrors(component, response);
            }
        });        
        $A.enqueueAction(action);        
    },
    fetchContent: function(component) {
        const action = component.get("c.getOERLogContent");
        const selectedLogValue = component.get("v.selectedLogValue");
        const selectedLog = component.get("v.logs").find((l)=>l.value==selectedLogValue) || {};
        
        action.setParams({
            strTrackingId: component.get("v.trackingId"),
            strFileName : selectedLog.label
        });
        
        component.set("v.isLoadingContent", true);
        action.setCallback(this, function(response) {
            component.set("v.isLoadingContent", false);
            const state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.logDetails', response.getReturnValue());
            }else{
                Util.handleErrors(component, response);
            }
        });        
        $A.enqueueAction(action);
    }
})