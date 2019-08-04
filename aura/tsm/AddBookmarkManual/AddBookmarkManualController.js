({
     //Function initilized when the component is loaded
    doInit : function(component, event, helper) {
        helper.doInitHelper(component, event, helper);
    },
    closeModal : function(component, event, helper) {
        var appEvent = $A.get("e.c:CloseBookMarkModalEvent");
        appEvent.fire();
    },
    //Validating the bookmark section for Folder/Link
    validateBookmarkSection : function(component, event, helper) {
        var mode = component.find('mode').get('v.value');
        if(mode=="Folder"){
            component.set('v.showLinkSection',false);
            component.set('v.showFolderSection',true);
        }
        else if(mode=="Link"){
            component.set('v.showFolderSection',false);
            component.set('v.showLinkSection',true);
        }
    },
    //used on adding bookmarks to folder or link if its success
    successModal: function(component, event, helper) {
        if(component.find("mode").get("v.value") === 'Folder'){
            helper.AddBookmarkstoFolder(component, event, helper);
        }
        else{
            helper.AddBookmarkstoLink(component, event, helper);
        }
    },
    //Checking for on change of available folders or to add a new folder
   onchangeAction : function(component, event, helper) {
        var mode = component.find('folders').get('v.value');
        if(mode == 'New'){
            component.set('v.askFolderName',true);
        }
        else{
            component.set('v.askFolderName',false);
        }
        helper.validateLinkDataHelper(component, event, helper);
    },
    validate : function(component, event, helper) {
        helper.validateHelper(component, event, helper);
    }
})