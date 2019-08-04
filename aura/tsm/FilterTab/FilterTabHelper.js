({
	getFilterEvent : function(component, event) {
		var appEvent = $A.get("e.c:FilterQueueEvt"),           
            type = component.get("v.selectedTabId"),
            filterData = component.get('v.filterData'),
            categoryVal = component.get('v.categoryVal'),
            productVal = component.get('v.productVal'),
            personaVal = component.get('v.personaVal'),
            keys = Object.keys(filterData);
        
        if (JSON.stringify(filterData.personas).indexOf(personaVal) == -1) {
            personaVal = '';
        }
        if (JSON.stringify(filterData.categories).indexOf(categoryVal) == -1) {
            categoryVal = '';
        }
        if (JSON.stringify(filterData.products).indexOf(productVal) == -1) {
            productVal = '';
        }
        
        if (appEvent != undefined) {
            appEvent.setParams({
                category: categoryVal,
                product: productVal,
                persona: personaVal,
                type: type
            });
            appEvent.fire();
        }
        var appEvent = $A.get("e.c:CaseMassActionTrigger");
        if (appEvent != undefined) {
            appEvent.setParams({
                eventType: "cancelMassAction"
            });
            appEvent.fire();// Application Event Fire to cancel case mass action
        }
	}
})