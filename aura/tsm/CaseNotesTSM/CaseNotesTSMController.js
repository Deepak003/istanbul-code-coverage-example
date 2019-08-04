({
    doInit: function(component, event, helper) {
        helper.pullTabInfo(component);
        helper.setTabInfo(component);
        
        if( component.get("v.caseId") ) {
            helper.fetchNotes(component);
            //helper.mockData(component);
        }
    }
})