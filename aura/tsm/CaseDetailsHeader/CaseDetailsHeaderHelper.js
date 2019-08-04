({
     searchCaseData : function(component,event,helper) {
            var action = component.get("c.searchCaseDetailsByTranscriptId");
            action.setParams({
                transcriptId : component.get("v.recordId")
               });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue(); 
                component.set("v.currentCase", storeResponse);
            }
        });
        $A.enqueueAction(action);
    },
     getEnclosingTabId : function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var currentObject = component.get("v.currentCase"); 
        workspaceAPI.getEnclosingTabId().then(function(tabId) {
          workspaceAPI.getTabInfo({
                tabId: tabId
            }).then(function(response) {
              //Setting up the label for the tab
                  if(currentObject.CaseNumber != undefined){
                    workspaceAPI.setTabLabel({
                    tabId: tabId,
                    label: currentObject.CaseNumber
                  });
               }
              //Changing the icon to case
              workspaceAPI.setTabIcon({
                tabId: tabId,
                icon: "standard:case"
              });
               //Hiding the sub-tabs
                var subTabs = response.subtabs;
                for(var eachSubTab in subTabs){
                    workspaceAPI.closeTab({tabId: subTabs[eachSubTab].tabId});
               }  
            });         
       }).catch(function(error) {
            console.log(error);
        });
    }
})