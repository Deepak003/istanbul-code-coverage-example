({
    doInit: function(component, event, helper) {
        helper.doInit(component, event, helper);
    },
    closeModal: function(component, event, helper) {
        component.set('v.isOpen', false);
    },
    successModal: function(component, event, helper) {
        helper.addBookmark(component, event, helper);
    },
    //Handling to check the selected options 
    handleChange: function(component, event, helper) {
        component.set("v.isNewFolder" , false);
        var selectedOptionValue = event.getParam("value");
        if(selectedOptionValue == 'new'){
            component.set("v.isNewFolder" , true);
        }
        helper.validateHelper(component, event, helper);
    },
    validate: function(component, event, helper) {
        helper.validateHelper(component, event, helper);
    }
})