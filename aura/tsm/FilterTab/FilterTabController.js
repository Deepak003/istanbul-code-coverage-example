({
	categorySelected : function(component, event, helper) {
		var selectedOptionValue = event.getParam("value");
		component.set('v.categoryVal', selectedOptionValue);
        helper.getFilterEvent(component, event);		          
	},
    productSelected : function(component, event, helper) {
		var selectedOptionValue = event.getParam("value");
        component.set('v.productVal', selectedOptionValue);
        helper.getFilterEvent(component, event);
	},
    personaSelected : function(component, event, helper) {
		var selectedOptionValue = event.getParam("value");
        component.set('v.personaVal', selectedOptionValue);
        helper.getFilterEvent(component, event);
	},
	    filterDataChanged: function(component, event, helper) {
        console.log('FilterDataChanged');
        helper.getFilterEvent(component, event);
    }
})