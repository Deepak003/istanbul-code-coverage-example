({
    fetchData: function(component) {
        component.set('v.isLoading', true);
        Promise.all([
            this.serverCall(component, 'c.getProductCodes'),
            this.serverCall(component, 'c.getEntitlementsAndBundles')
        ])
        .then((response)=>[].concat.apply([], response))
        .then($A.getCallback((data)=>component.set('v.categoryCodes', data)))
        .catch($A.getCallback((err)=>Util.handleErrors(component, err)))
        .finally($A.getCallback(()=>component.set('v.isLoading', false)));
    },
     formatProductForLookup: function(component) {   
        if(component.get("v.products") == null){
            var action = component.get("c.getAllProducts");  
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var storeResponse = response.getReturnValue();   
                    console.log(storeResponse);
                    console.log(JSON.parse(storeResponse));
                    component.set("v.allProducts", storeResponse);
                    
                    const products = JSON.parse(storeResponse).response;
                    console.log('products :: ' + products);
                    component.set('v.lookupProducts', products.map((p)=> ({ 
                        Id: p.id,
                        Name: p.name,
                        Url_Name__c: p.urlName
                    }) ));
                }
            });
            $A.enqueueAction(action);
        }
        else{
            const products = JSON.parse(component.get("v.products")).response;
            console.log('products :: ' + products);
            component.set('v.lookupProducts', products.map((p)=> ({ 
                Id: p.id,
                Name: p.name,
                Url_Name__c: p.urlName
            }) ));
        }
    },
    //setDefaultProductToLookup: function(component) {
        //const name = component.get('v.lookupProducts').find((lp)=>lp.Id==component.get("v.selectedProduct.Id")).Name;
        //component.set('v.selectedProductName', name.replace(/-/g, ' '));
    //},
    serverCall: function(component, methodName) { 
         console.log('serverCall' );
        console.log( component.get('v.selectedProduct'));
        const action = component.get(methodName);
        var productName = '';
        if(component.get('v.selectedProduct') != null)
            productName = component.get('v.selectedProduct.Url_Name__c');
        action.setParams({
            crmProductName: productName,//component.get('v.selectedProduct.Url_Name__c'),
            category: this.getCategory(component)
        });
        return new Promise(function(resolve, reject) {
            action.setCallback(this, function(response) {
                if (response.getState() === "SUCCESS") {
                    resolve(response.getReturnValue());
                } else {
                    reject(response);
                }
            });
            $A.enqueueAction(action);
        });
    },
    getCategory: function(component) {
        return {
            "new": "GAMEENTITLEMENT",
            "discounts-promos": "OTHERENTITLEMENTS",
            "default": "INGAMECONTENT"
        }[component.get('v.variant')];
    },
    formatForLookup: function(list) {
        return list.map((l)=>Object.assign({}, l, { Name: l.name, Value: l.id }));
    },
    grant: function(component) {
        const selectedProduct = component.get('v.selectedProduct'),
            selectedCategory = component.get('v.selectedCategory'),
            selectedCode = component.get('v.selectedCode'),
            nucleusId = component.get('v.nucleusId');
        var selCaseId = component.get('v.caseId');
        if(selCaseId == ""){
            selCaseId = null;
        }
        let action = component.get('c.grantEntitlements');
        let payload = {
            customerId: nucleusId,
            crmProductName: selectedProduct.Url_Name__c,
            caseId : selCaseId ,
            accountId : component.get('v.accountId'),
            category: this.getCategory(component)
        };
        
        const isCodeApi = selectedCategory.Value.includes('KEYMASTER');
        
        // if code type is KEYMASTER (or) NONKEYMASTER
        if(isCodeApi) {
            action = component.get('c.grantCodeEntitlements');
            Object.assign(payload, {
                ofbProductId: selectedCode.ofbProductId,
                codeSetId: selectedCode.Value,
                codeSetName: selectedCode.Name,
                system: selectedCategory.Value,
                email: component.get('v.email')
            })
        }else {
            Object.assign(payload, {
                data: JSON.stringify({entitlementTemplateIds: selectedCode.id.split(',')})                
            })
        }        
        
        action.setParams({
            reqParameters: payload
        });
        
        component.set('v.isLoading', true);
        action.setCallback(this, function(response) {
            component.set('v.isLoading', false);
            component.set('v.isOpen', false);
            
            if (response.getState() === "SUCCESS") {
                var result =  response.getReturnValue();
                if(result.includes('failed')){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "message":  result,
                        "type" : "error"
                    }); 
                    toastEvent.fire();
                }
                else{
                    Util.handleSuccess(component, result);
                }
                var appEvent = $A.get("e.c:CloseBookMarkModalEvent");
                appEvent.setParams({
                    "eventVal" : 'Add'
                });
                appEvent.fire();
            } else {
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    }
})