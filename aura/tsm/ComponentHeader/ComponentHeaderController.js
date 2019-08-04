({
    doInit : function(component, event, helper) {
        component.get("v.show").forEach(function(l){  
            $A.util.removeClass(component.find(l), 'slds-hide');
        })
    },
    
    toggleExpandAll : function(component, event, helper) {
        console.log("toggleExpandAll");
                
        const currentState = event.getSource().get("v.value");                        
        $A.get("e.c:Expand")
        	.setParams({ "isExpanded" : currentState, targetComponent : component.get("v.targetComponent") })
        	.fire();
        
        event.getSource().set("v.value", !currentState);
    },
    
    onChangeFilter : function(component, event, helper) {	
        $A.get("e.c:Filter")
        	.setParams({ 
                "type" : component.find("activity-filter").get("v.value"), 
                targetComponent : component.get("v.targetComponent"),
                searchTerm : component.find("activity-search").get("v.value")
            })
        	.fire();
    },
    
    doRefresh : function(component, event, helper) {
        $A.get("e.c:Refresh")
        	.setParams({ targetComponent : component.get("v.targetComponent") })
        	.fire();
    }
})