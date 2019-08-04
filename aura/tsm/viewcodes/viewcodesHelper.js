({
    initHelper : function(component, event, helper) {
        console.log('initHelper');
        var nucleusId =  component.get("v.nucleusId");
        var productName = component.get('v.selectedProduct');
        var formattedName = component.get("v.selectedProduct").replace(/-/g, ' ');
        
        formattedName = formattedName.toUpperCase();
        component.set("v.formattedProdName", formattedName);
        component.set("v.cols",['CODE','DESCRIPTION','GRANT DATE']);
        console.log('nucleusId:: '+ nucleusId);
        console.log('productName:: '+ productName);
        var action = component.get("c.getCodesForCustomer");
        action.setParams({
            strNucleusId : nucleusId,
            strProductName : productName,
        });
        component.set("v.isLoading", true);
        action.setCallback(this, function(response) {
            component.set("v.isLoading", false);
            var state = response.getState();
            console.log(state);
            if (state === "SUCCESS") {
                console.log(response.getReturnValue());
                var storeResponse = response.getReturnValue();
                
                if(storeResponse.length > 0){
                    component.set("v.isViewCode",true);
                    for(var res of storeResponse){
                        var trimmedDate = res.grantDate.substring(0,10);
                        res.grantDate = $A.localizationService.formatDateUTC(trimmedDate, "MMM/dd/yy");
                    }
                }
                else{
                    component.set("v.isViewCode",false);
                }
                component.set("v.items",storeResponse);
            }
            else{
                component.set("v.isViewCode",false);
            }
        });
        $A.enqueueAction(action);
    }
})