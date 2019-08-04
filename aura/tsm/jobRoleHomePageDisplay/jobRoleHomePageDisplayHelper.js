({
	 getFocusedTab : function(component, event, helper,evtTabId) {
        var workspaceAPI = component.find("workspace");
        var evtTabId =evtTabId;
        workspaceAPI.getFocusedTabInfo().then($A.getCallback(function(response) {
            var focusedTabId = response.tabId;
            //var tabIdFromEvent = component.get("v.focusedTabId");
            var URLParam = window.location.href;
            if(focusedTabId == evtTabId){
            	component.set('v.isChangeJobRole', true);
            }
            //workspaceAPI.closeTab({tabId: focusedTabId});
       }))
        .catch(function(error) {
            console.log(error);
        });
    }, 
    closeAllTabs:function(component,event,helper){
       helper.closeWorkTab(component,event,helper);
    },
    closeWorkTab: function (component,event,helper) {
        var workspaceAPI = component.find("workspace");
        var tabsInfo = component.get("v.tabsInfo");
        var selectedRoleName = component.get('v.roleName');
		if (tabsInfo) {
			tabsInfo.forEach(function(tabsInfo)
			{ 
				workspaceAPI.getFocusedTabInfo().then(function(response) {
					var focusedTabId = tabsInfo.tabId; //response.tabId;
					workspaceAPI.closeTab({tabId: focusedTabId});
				})
				.catch(function(error) {
					console.log('entered into closeWorkTab->> '+error);
				});
			});
		}
        var successMsg = ' ';
		var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
            	mode: 'dismissible',
				title: 'Job role changed to '+ '" '+ selectedRoleName +' "',
                message: successMsg,
                type : 'success'
             });
        toastEvent.fire();
        component.set('v.isChangeJobRole', false);
        
         var appEvent = $A.get("e.c:revJobroleAppEvt");
		 var tabsInfo = component.get("v.tabsInfo");
         	if(appEvent){
            	appEvent.setParams({
                	"isRoleChangeRequired" : true,
                  });
                 appEvent.fire();
           }
    }       
})