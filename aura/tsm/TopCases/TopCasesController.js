({
    doInit : function(component, event, helper) {
    	helper.getTopCaseDetails(component,event,'All Cases');
    },
    
	handleChange : function(component, event, helper) {
        var selectedOptionValue = event.getParam("value");
        helper.getTopCaseDetails(component,event,selectedOptionValue);
    }
    
})