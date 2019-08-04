({
    //TSM-2577 - Funciton to get the making details for the account tab
    doInit:function(component, event, helper){
        helper.getDataMaskConfigurations(component, event);
    },
    //Handling the opening of application event
    handleOpenAccountNotesTab:function(component, event, helper){
        var openAccountNotes = event.getParam("openAccountNotesTab");
        var openSessionNotes = event.getParam("openSessionInfoTab");
        if(openAccountNotes){
            component.set("v.selectedTab","three");
        }  
        if(openSessionNotes){
            component.set("v.selectedTab","two");
        }
	},
})