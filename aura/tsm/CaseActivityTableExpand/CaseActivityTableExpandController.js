({
	init: function(component, event, helper) {
        console.log('v.rows: ', component.get('v.rows').length)
    },    
    expandClick: function(component, event, helper) {
        const items = component.get("v.filteredRows"), index = event.getSource().get("v.value");
        items[index].expanded = !items[index].expanded;
        component.set("v.filteredRows", items);
    },
    toggleStateAll: function(component, event, helper) {
        if(event.getParam("targetComponent").includes(component.getName())) {            
            const items = component.get("v.filteredRows");
        	const currentState = event.getParam("isExpanded");
            items.forEach((item)=>{
                item.expanded = !currentState;
            });
        	component.set("v.filteredRows", items);
        }        	
    }
})