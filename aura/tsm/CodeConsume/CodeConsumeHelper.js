({
	consumeCode : function(component, event) {
        var codeString = component.get("v.code");
        var userId = component.get("v.nucleusId");
        var caseId = component.get("v.caseId");
        var codeSearchData = component.get("v.codeSearchData");
		var accountId = component.get("v.accountId");
        var ofbProductId = component.get("v.selectedProduct");
        var self = this;

        var action = component.get("c.getconsumeKeymasterCode");
        action.setParams({
            codeString : codeSearchData.codeString,
            userId : userId,
            caseId : caseId,
            notes : null,
            ofbProductId : ofbProductId,
            accountId : codeSearchData.sfAccountId,
            codeSetId : codeSearchData.codesetId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var toastEvent = $A.get("e.force:showToast");
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                toastEvent.setParams({                   
                    "message": "The code is added to the account successfully!",
                    "type": "success"
                });
                component.set("v.code", '');
                component.set("v.codeSearchData", {});
                component.set("v.consumeCodes", false);
            }
            else{
                var errorMessage = response.getError();
                toastEvent.setParams({                   
                    "message": errorMessage[0].message,
                    "type": "error"
                });
            }
            toastEvent.fire();
            component.set('v.isSearching', false);
        });
        $A.enqueueAction(action);
    }
})