({
    doInit: function(component, event, helper) {          
        helper.fetchInteractions(component);
    },
    toggleState: function(component, event, helper) {
        helper.toggleState(component, event);
    },
    toggleStateAll: function(component, event, helper) {
       	helper.toggleStateAll(component);
    },
    openNotes: function(component, event, helper) {
        helper.openSubTab(component, 'note');
    },
    openEmailTranscript: function(component, event, helper) {
        helper.openSubTab(component, 'email');
    },
    openChatTranscript: function(component, event, helper) {
        helper.openSubTab(component, 'chat');
    },
    openPhoneTranscript: function(component, event, helper) {
        helper.openSubTab(component, 'phone');
    }
})