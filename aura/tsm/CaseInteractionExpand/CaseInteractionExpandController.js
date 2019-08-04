({
    doInit : function(component, event, helper) {
        const interaction = component.get("v.interaction") || {};
        var eventId = component.get("v.eventId");
        if(interaction.channel == "Phone") {
            // setting call duration
            (interaction.phoneDetails || []).forEach(function(pd){
                if(pd.key=='Call Duration' && pd.value){
                    const time = helper.formatDuration(pd.value);
                    const duration = (time.m ? time.m + "min " : "") + time.s + "seconds";
                    component.set("v.callDuration", duration);
                }
            });
        }
        if(interaction.eventId || typeof eventId !== 'undefined'){
            var evtId = (typeof eventId !== 'undefined') ? eventId : interaction.eventId;
            component.set("v.eventId", evtId);
            helper.getOmegaEventDetails(component, interaction, evtId);
        }
    },
    openAttachmentWithSubtab : function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
        var idx = event.target.id;  
        var tabName = event.target.innerText;  
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            workspaceAPI.openSubtab({
                parentTabId: response.tabId,
                url: idx
            });
            
        })
        .catch(function(error) {
            console.log(error);
        });
        
        /*set sub tab name and icon*/
        setTimeout(function(){
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                console.log(response);
                workspaceAPI.setTabLabel({
                    tabId: response.tabId,
                    label: tabName
                });
                workspaceAPI.setTabIcon({
                    tabId: response.tabId,
                    icon: "doctype:attachment",
                    iconAlt: ""
                });
            }).catch(function(error) {
                console.log(error);
            });
        }, 1000);
    }
})