({
	doInit: function(component,event,helper){
        helper.getAllProduct(component);
        var action = component.get('c.fetchServerStatusDetails');
        action.setCallback(this, function(response){
            var state = response.getState();
            var response;
            if(state === 'SUCCESS' && component.isValid()){
                //get contact list
                component.set('v.serviceStatusList', response.getReturnValue());
                response = response.getReturnValue();
            }else{
                console.log('Error in fetching');
            }
        });
        $A.enqueueAction(action);
    },
    handleBubbling : function(component, event, helper) {
        var firedLookupType = event.getParam('type');
        var productId; 
        if(firedLookupType == "Product"){
        	productId = event.getParam('Id');
            if(productId != undefined){
            	component.set("v.selectedProductId",productId);
            }
        }
        helper.fetchServiceStatusForProduct(component,productId,event);
    },
     openControlTower: function (component, event, helper) {
        var controlTowerURL =   $A.get("$Label.c.TSM_CONTROL_TOWER_APP_URL");
        window.controlTowerURL = window.open(controlTowerURL,"popup1","toolbar=yes,scrollbars=yes,resizable=yes").postMessage;
    }
})