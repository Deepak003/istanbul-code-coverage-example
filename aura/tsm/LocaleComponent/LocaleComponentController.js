({
	doInit : function(component, event, helper) {
        var action = component.get("c.getLocaleList");
        action.setCallback(this,function(response) {
        	var state = response.getState();
        	if (state === "SUCCESS") {
                var results = response.getReturnValue();
                console.log(results);
                var listOfOptions = [];
                results.forEach(function (result){
                	listOfOptions.push(result.Name)
                });
                component.set('v.options', listOfOptions);
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },onChangeLocale: function (component,event,helper) {
        var selectedLocale = event.getSource().get("v.value");
        component.set('v.selectedOption', selectedLocale);
        var localeEvent = component.getEvent("localeEvent");
        localeEvent.fire();
    }
})