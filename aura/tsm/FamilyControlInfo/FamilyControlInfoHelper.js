({
	getFamilyInfoUnderage : function(component) {
        var familyControlObj = {};
        component.set('v.familyControlObj', familyControlObj);
		//TODO after SF Aura method completes and Delete above new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(5.7)
        var action = component.get("c.fetchFamilyControls");
        var customerId = component.get("v.nucleusId");
        
        var toastEvent = $A.get("e.force:showToast");
        action.setParams({
            nucleusID : customerId,
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue(),
                    familyControlObj = {
                                       singlePurchase: 'N/A',
                                       microContent: 'N/A'};
                if (storeResponse && typeof storeResponse === 'string') {
                    storeResponse = JSON.parse(storeResponse);                    
                }
                if (storeResponse && storeResponse.status && storeResponse.status.toLowerCase() == 'success') {
                    var familyResponse = storeResponse.response ? storeResponse.response : storeResponse;
                    familyControlObj = {
                                        singlePurchase:  familyResponse.singlePurchaseAmount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: familyResponse.singlePurchaseCurrency }).format(familyResponse.singlePurchaseAmount) : 'N/A',
                                        microContent: familyResponse.microContentAmount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: familyResponse.microContentCurrency }).format(familyResponse.microContentAmount): 'N/A'};
                }                 
                component.set('v.familyControlObj', familyControlObj);
            }
            else {
                console.log('Error');
            }
        });
        $A.enqueueAction(action);
	}
})