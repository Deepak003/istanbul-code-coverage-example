({
    //using the postmessage appEvent to append the url of the selected article
    postMessage: function(component, event, helper){
        var appEvent = $A.get("e.c:PostMessage");
        appEvent.setParams({
            selectedCaseIndex : component.find("cases").get("v.value"),
            URL: component.get("v.selectedArticle.fields.url"),
            ID: component.get("v.selectedArticle.id").split("_")[0] + '@' + component.get("v.selectedArticle.fields.title")
        });
        component.set("v.isOpen" , false);
        appEvent.fire();
    },
    validateAndEnableSendButton : function(component, event, helper) {
        if(component.find('cases').get('v.value') != null){
            component.set('v.disableSendButton',false);
        }
        else{
            component.set('v.disableSendButton',true);
        }
    }
})