({    
    doInit: function(component, event, helper) {         
    	helper.getAttachments(component);    
    },
    openTabWithSubtab : function(component, event, helper) {
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
    },
    handleRefreshAttachments:function(component, event, helper){
        var spinnerCmp = component.find("attachmentSpinner");
        if(event.getParam("showSpinner")){
            $A.util.removeClass(spinnerCmp, "slds-hide");
            $A.util.addClass(spinnerCmp, "slds-show");
        }else{
            $A.util.addClass(spinnerCmp, "slds-show");
            helper.getAttachments(component);    
        }
        
            
    }
   
})