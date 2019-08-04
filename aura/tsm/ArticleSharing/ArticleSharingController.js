({
    doInit : function(component, event, helper) {
        if(component.get("v.localStorage").length == 1){
            component.set("v.selCase", component.get("v.localStorage")[0].value);
            helper.validateAndEnableSendButton(component, event, helper);
        }
        var selectedArticle = component.get("v.selectedArticle");
        var startStr = selectedArticle.fields.url.substring(0, 1);
        selectedArticle.fields.url = startStr + selectedArticle.fields.locale + selectedArticle.fields.url.substring(6, selectedArticle.fields.url.length);
        component.set("v.selectedArticle", selectedArticle);
        component.set("v.isOpen", true);
    },
    //Function used to close the modal
    closeModal : function(component, event, helper) {
        component.set('v.isOpen',false);
    },
    //checking the validation of send button
    validateAndEnableSendButton : function(component, event, helper) {
        helper.validateAndEnableSendButton(component, event, helper);
    },
    //Function used to open the Article sharing modal
    openModal : function(component, event, helper) {
        component.set('v.isOpen',true);
    },
    //sharing the article by appending post message 
    sendArticle : function(component, event, helper) {
        helper.postMessage(component, event, helper);
    },
    //used to copy the article link and highlight after copying
    copy : function(component, event, helper) {
        var holdtxt = document.getElementById("holdtext");
        holdtxt.select();
        document.queryCommandSupported('copy');
        document.execCommand('copy');
        component.set('v.isLinkCopied',true);
        var url = document.getElementById('text-input-id-1');
        url.select();   
    }
})