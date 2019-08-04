({
    doInit : function(component, event, helper) {
        helper.onInit(component);
        /*setTimeout(function() { 
            if (component.find('datagridtable')) {
            	component.find('datagridtable').setSelection(1)
        	}
        }, 0);*/
    },
    
    setSelection: function(component,event,helper) {
        component.find('datagridtable').setSelection(event.getParam('arguments').Id);
    }
}) 