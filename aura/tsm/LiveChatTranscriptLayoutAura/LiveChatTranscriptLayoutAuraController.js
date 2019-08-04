({
    doneRendering: function(component, event, helper){
        console.log(document.getElementsByClassName("slds-textarea runtime_service_liveagentChatInput").length);
        if(document.getElementsByClassName("slds-textarea runtime_service_liveagentChatInput") && 
           document.getElementsByClassName("slds-textarea runtime_service_liveagentChatInput").length > 0){
            document.getElementsByClassName("slds-textarea runtime_service_liveagentChatInput")[0].maxLength=6000;
        }
    }
})