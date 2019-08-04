({
    openDifferentAccountTab : function(component, event, helper) {
        const nucleusId = component.get("v.nucleusId");
        const paymentId = component.get("v.paymentId");
        const source = component.get("v.source");
        
        const accountAction = component.get("c.accountIdSearch");
        accountAction.setParams({strCustomerId:nucleusId});
        
        component.set('v.isLoading', true);
        
        accountAction.setCallback(this,function(response){
            component.set('v.isLoading', false);
            
            const state = response.getState();
            if (state === "SUCCESS") {
                let object = response.getReturnValue();
                
                const accountId = (object && object.accountId) ? object.accountId : '';
                const emailAddress = (object && object.email) ? object.email : '';
                
                var workspaceAPI = component.find("workspace");
                workspaceAPI.getFocusedTabInfo().then(function(response) {
                    workspaceAPI.openSubtab({
                        parentTabId: response.tabId,
                        recordId: accountId,
                        focus: true,
                        pageReference: {
                            "type": "standard__component",
                            "attributes": {
                                "componentName":"c__TSMAccountWrapper"
                            },                            
                            "state": Object.assign({}, object, {
                                c__paymentId: paymentId,
                                c__openFrom: source,
                                c__emailAddress: emailAddress,
                                c__sfAccountId: accountId
                            })
                        }
                    }).catch(console.log);
                }).catch(console.log);
            }
            else {
                Util.handleErrors(component, response);
            }    
        });
        $A.enqueueAction(accountAction);
    }
})