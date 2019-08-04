({
    init: function(component, event, helper) {        
        helper.formatData(component);
    },
    expandClick: function(component, event, helper) {
        const index = event.getSource().get("v.value");
        helper.toggleRow(component, index);
    },  
    //new tsm2929
    expandRow1:function(component, event, helper) {
        console.log('expanded row');
        var selectedSection = event.currentTarget;
        var index = selectedSection.dataset.index;
        console.log('index--1',index);
        helper.toggleRow(component, index);
    },
    sortAsc: function(component, event, helper) {
        helper.sortRows(component, event, 'asc');
    },
    sortDesc: function(component, event, helper) {
        helper.sortRows(component, event, 'desc');
    },
    handleExpand: function(component, event, helper) {
        if(event.getParam("targetComponent").includes(component.getName())) {
            const currentState = event.getParam("isExpanded");
            if(!currentState) {
                const id = event.getParam("id");
                const index = component.get("v.rows").findIndex((r)=>r.pk == id);
                setTimeout($A.getCallback(()=>helper.toggleRow(component, index)), 100);
                //helper.toggleRow(component, index);
            }
        }        
    },
    onmouseover: function(component, event, helper) {
        const index = event.currentTarget.dataset.index;
        component.set('v.mouseoverIndex', parseInt(index));
    },
    onmouseout: function(component, event, helper) {
        component.set('v.mouseoverIndex', -1);
    }
})