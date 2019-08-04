({
	//gets all products function used for lookup - Product
    getAllProduct: function (component, event) {
        var productList;
        var action = component.get("c.getAllProducts"); 
        var self = this;
        action.setCallback(self, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var mapProducts = response.getReturnValue();   
                component.set("v.mapProducts",mapProducts);
                productList = Object.values(mapProducts);
                component.set("v.lookupProducts", productList);
            }
        });
        $A.enqueueAction(action);
    },
    
    fetchServiceStatusForProduct: function(component, productId,event){
        //var productId = component.get("v.selectedProductId");
        var mapProducts = component.get("v.mapProducts");
        var strProductName; var allProductsStatuses;
        var productDisplayName;
        if(productId != undefined){
        	if(mapProducts.hasOwnProperty(productId)){
        		strProductName = mapProducts[productId].Url_Name__c;
            	productDisplayName = mapProducts[productId].Name;
            }
        }else{
            component.set("v.serviceStatusForProductList", allProductsStatuses);
        }
        var action = component.get("c.getServerStatusForProduct"); 
        var self = this;
        action.setParams({
            strProductName: strProductName
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {  
                
                allProductsStatuses = response.getReturnValue();  
                var isALLUP =allProductsStatuses.isAllUP;
                component.set("v.isAllUPForProduct",allProductsStatuses.isAllUP);
                component.set("v.serviceStatusForProductList", allProductsStatuses);
                component.set("v.selectedProduct",productDisplayName);
            }else{
				component.set("v.serviceStatusForProductList", allProductsStatuses);
			}
        });
        $A.enqueueAction(action);
    }
})