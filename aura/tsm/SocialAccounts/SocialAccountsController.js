({
    doInit: function(component, event, helper) {
        const actions = [
            { label: 'Remove External Referencce', name: 'remove_reference' }
        ];
        
        component.set('v.socialColumns', [
            { label: 'TYPE', fieldName: 'referenceType', type: 'text' },
            { label: 'ID', fieldName: 'referenceId', type: 'text' },
            { label: 'VALUE', fieldName: 'referenceValue', type: 'text' },
            { label: 'BESL SCREENNAME', fieldName: 'beslScreenName', type: 'text' },
            { type: 'action', typeAttributes: { rowActions: actions } }
        ]);
        
        if(component.get('v.nucleusId')){
            helper.getExternalReferences(component);            
        }
    },
    handleRowAction: function (component, event) {        
        component.set('v.selectedRow', event.getParam('row'));
        const action = event.getParam('action');
        switch (action.name) {
            case 'remove_reference':
                component.set('v.isOpen', true);
                break;
        }
    },
    handleRemoveClick: function (component, event, helper) {
        helper.removeReference(component);
    }
})