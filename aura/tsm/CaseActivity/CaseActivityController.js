({
    getCaseUpdates : function(component, event, helper) {
        helper.getCaseUpdates(component, event);
    },
    doRefresh : function(component, event, helper) {
        if(event.getParam("targetComponent").includes(component.getName()))
        	helper.doRefresh(component, event);
    },
    currentCaseSelected : function(component, event, helper) {
        helper.toggleExpand(component,event,'currentCaseActivity');
    },    
    otherCaseSelected : function(component, event, helper) {
        helper.toggleExpand(component,event,'otherCaseActivity');
    },
    onCaseUpdatesList : function(component, event, helper) {
        const updates = component.get("v.caseUpdatesList");
        
        component.set("v.caseUpdatesEmail", updates.filter((update)=>update.type == 'EMAIL'));
        component.set("v.caseUpdatesChat", updates.filter((update)=>update.type == 'CHAT'));
        component.set("v.caseUpdatesNote", updates.filter((update)=>update.type == 'NOTE'));
        component.set("v.caseUpdatesAttachment", updates.filter((update)=>update.type == 'ATTACHMENT'));
    }
})