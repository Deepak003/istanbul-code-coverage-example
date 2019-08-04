({
    doInit : function(component, event, helper) {
        component.set('v.columns', [
            { label: 'TITLE', fieldName: 'itemName', type: 'text', initialWidth: 300, cellAttributes: {  
                class: 'tsm-table-row'
            } },
            { label: 'TYPE', fieldName: 'itemType', type: 'text' }
        ]);
        helper.fetchTeamMembers(component);
    },
    closeModal: function(component, event, helper) {
        component.set('v.modalData', {});
    }
})