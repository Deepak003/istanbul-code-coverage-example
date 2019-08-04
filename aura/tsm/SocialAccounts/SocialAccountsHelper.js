({
    getExternalReferences: function(component) {
        const action = component.get("c.getExternalReferences");
        
        action.setParams({
            strUserId : component.get('v.nucleusId')
        });
        component.set('v.isLoading', true);
        action.setCallback(this, function(response) {
            component.set('v.isLoading', false);
            const state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.socialData', response.getReturnValue());
            }else{
                Util.handleErrors(component, response);
            }
        });
        
        $A.enqueueAction(action);
    },
    removeReference: function(component) {
        const action = component.get("c.deleteExternalReference");
        const selectedRow = component.get('v.selectedRow');
        
        action.setParams({
            strUserId: component.get('v.nucleusId'),
            strReferenceId: selectedRow.referenceId,
            strReferenceType: selectedRow.referenceType,
            strCaseId: component.get('v.caseId'),
            strAccountId: component.get('v.strAccountId')
        });
        component.set('v.isLoading', true);
        action.setCallback(this, function(response) {
            component.set('v.isLoading', false);
            const state = response.getState();
            if (state === "SUCCESS") {
                Util.handleSuccess(component,  response.getReturnValue());
                component.set('v.isOpen', false);
                this.getExternalReferences(component);
            }else{
                Util.handleErrors(component, response);
            }
        });
        
        $A.enqueueAction(action);
    }
})