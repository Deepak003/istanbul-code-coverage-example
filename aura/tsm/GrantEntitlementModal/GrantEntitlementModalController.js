({    
    doInit : function(component, event, helper) {
        //if(component.get('v.variant') == 'discounts-promos') { 
            helper.formatProductForLookup(component);
            //helper.setDefaultProductToLookup(component);
       // }
        
        if(component.get("v.selectedProduct") != null){
            component.set('v.selectedProductName', component.get("v.selectedProduct").Url_Name__c.replace(/-/g, ' '));
        }
        if(component.get('v.from') != 'Account')
            helper.fetchData(component);
        else
            component.set('v.isLoading', false);
    },   
    onGrantClick : function(component, event, helper) {
        helper.grant(component);
    },
   handleLookupChange : function(component, event, helper) {
        if(event.getParam('type') == 'Categories'){
            component.set('v.selectedCategory', component.get('v.categories').find((c)=>c.Value==event.getParam('Id')));
        }else if(event.getParam('type') == 'Codes'){
            component.set('v.selectedCode', component.get('v.codes').find((c)=>c.Value==event.getParam('Id')));
        }else if(event.getParam('type') == 'Select a Product'){
            const found = component.get('v.lookupProducts').find((c)=>c.Id==event.getParam('Id'));
            if(found !== undefined){
                component.set('v.selectedProduct', found);
                if(component.get('v.from') == 'Account')
                    helper.fetchData(component);
            }
        }
    },
    setCategories : function(component, event, helper) {
        const categoryCodes = component.get('v.categoryCodes');        
        const uniqCategories = new Set(categoryCodes.map((c)=>c.type));
        //uniqCategories.add('KEYMASTER').add('NONKEYMASTER');
        const categoryLookupData = Array.from(uniqCategories).map((c)=>({ Name: { KEYMASTER: "Key Master Codes", NONKEYMASTER: "Third Party Codes" }[c] || c, Value: c }));
        component.set('v.categories', categoryLookupData);
    },
    setCodes : function(component, event, helper) {
        //clear existing code lookup data
        component.set('v.selectedCodeName', '');
        component.set('v.selectedCode', undefined);
        component.set('v.codes', []);
        
        const categoryCodes = component.get('v.categoryCodes');
        const category = event.getParam("value");
        if(category) {
            const filtered = categoryCodes.filter((c)=>c.type==category.Value);     
            component.set('v.codes', helper.formatForLookup(filtered) );
        }      
    },
    closeModal : function(component, event, helper) {
        var appEvent = $A.get("e.c:CloseBookMarkModalEvent");
        appEvent.setParams({
            "eventVal" : 'Add'
        });
        appEvent.fire();
        component.set('v.isOpen', false);
    },
})