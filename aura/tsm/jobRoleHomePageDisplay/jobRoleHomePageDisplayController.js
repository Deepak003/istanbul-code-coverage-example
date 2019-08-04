({
	 onRoleChange:function(component,event,helper){ 
      	//component.set("v.target",event.getParam("target")); 
        component.set("v.focusedTabId",event.getParam("focusedTabId"));
        component.set("v.tabsInfo",event.getParam("tabsInfo"));  
        component.set("v.roleName",event.getParam("roleName")); 
        var evtTabId = event.getParam("focusedTabId");
        
        var URLParam = window.location.href;
         if(URLParam.includes("home")){
             component.set('v.isChangeJobRole', true);
         }
    },
    closeAllTabs : function(component,event,helper){
        helper.closeAllTabs(component,event,helper);
    },
    closeChangeJobRole: function(component, event, helper){
        component.set('v.isChangeJobRole', false);
    },
})