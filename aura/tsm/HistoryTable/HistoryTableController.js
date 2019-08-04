({
    doInit : function(component, event, helper) {
        //TSM-2813 Handling the logic for pagination
        if(component.get("v.paginatedNumber") == 0){
            component.set('v.pageNumber', 1);
        }else{
            component.set('v.pageNumber', component.get("v.paginatedNumber"));
        } 
        component.set('v.externalData', {
            selectedProduct : component.get('v.selectedProduct'),
            selectedPersona : component.get('v.selectedPersona'),
            itemList : component.get('v.itemList'),
            packList : component.get('v.packList'),
            globalSelectionArray: component.get("v.globalSelectionArray"),
            grantPermission : component.get("v.productMaskingData.GrantItemsPacksCurrency"),
            caseId: component.get("v.caseId"),
            accountId: component.get("v.accountId"),
            nucleusId: component.get("v.nucleusId")
        });
        helper.setPaginatedData(component);
    },
    handlePageChange : function(component, event, helper) {  
        //TSM-2813 Setting the paginated number
        component.set("v.paginatedNumber", component.get('v.pageNumber'));      
        helper.setPaginatedData(component);
    },
    handleSearchTermChange : function(component, event, helper) {
        component.set('v.pageNumber', 1);
        
        helper.setPaginatedData(component);
    },
    //TSM-2277 - handling selection array change
    handleGlobalSelectionChange: function(component, event, helper) {
        //Changing the external data of the global selection data is null
        if(component.get("v.globalSelectionArray") != null){
            if(component.get("v.globalSelectionArray").length == 0){
                component.set('v.externalData', {
                    selectedProduct : component.get('v.selectedProduct'),
                    selectedPersona : component.get('v.selectedPersona'),
                    itemList : component.get('v.itemList'),
                    packList : component.get('v.packList'),
                    globalSelectionArray: component.get("v.globalSelectionArray")
                }); 
            }
        }
    },
})