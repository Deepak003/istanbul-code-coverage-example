({
    getItemPackDetails: function(component, event) {
        this.getGrantCategories(component, event, "ITEM_CATEGORY");
        this.getGrantCategories(component, event, "PACK_TYPE");
    },
    
    getGrantCategories : function(component, event, typeSelected) {
        component.set("v.isLoading", true); 
        var action = component.get("c.getGameMetaData"); 
        var selectedPersona = component.get("v.selectedPersona");
        //Generation the request
        var requestMap = {};
        requestMap["datatype"] = typeSelected;
        requestMap["crmProductName"] = component.get("v.selectedProduct").Url_Name__c;
        requestMap["userId"] = component.get("v.nucleusId");
        requestMap["platform"] = selectedPersona.object.platform;
        action.setParams({
            requestParams : requestMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.isLoading", false);
            if (state === "SUCCESS") {  
                if(response.getReturnValue().status  != "ERROR"){
                    var storeResponse = response.getReturnValue().response.values;                
                    if(typeSelected == "ITEM_CATEGORY"){
                        component.set("v.itemList",storeResponse);
                    }else{
                        component.set("v.packList",storeResponse);
                    }       
                }
            }
        });
        $A.enqueueAction(action);
    },    
})