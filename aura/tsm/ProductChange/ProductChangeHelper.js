({
    getProductInfomation : function(component, event, helper) {
        var action = component.get("c.getSpecificProductsByName"); 
        var currentSelection = component.get("v.currentSelection");      
        action.setParams({
            productName : currentSelection
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                component.set("v.openProductChange", false);
                var changedProduct = {
                    Id: storeResponse.id,
                    Name: storeResponse.name,
                    Url_Name__c: currentSelection,
                    studio:storeResponse.studio,
                    isMobile__c : storeResponse.isMobile
                };
                component.set("v.selectedProduct", changedProduct);
            }
        });
        $A.enqueueAction(action);
    },
    //Adding validation to check special characters
    isValidString: function (currentString){
        if (currentString.search(/[\[\]?*+|{}\\()@.\n\r]/) != -1) {
            return false;
        }else{
            return true;
        }
    },
})