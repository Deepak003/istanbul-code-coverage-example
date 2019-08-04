({
    doInit: function(component, event, helper) {
        var selectedProduct = component.get("v.selectedProduct");
        if(window.permissionsList != undefined){  
            if(selectedProduct.includes('fifa') && window.permissionsList.includes('add or remove fifa draft token')){
                 component.set('v.hasModifyDraftTokenPermission', true);
            }
        }
        helper.populateContentTypes(component, event);
        //Initilizing the columns - Was replace with the standard component
        component.set('v.columns', [
            {label: 'ITEM', fieldName: 'name', type: 'text'},
            {label: 'DESCRIPTION', fieldName: 'description', type: 'List'},
            {label: 'ID', fieldName: 'id', type: 'Object'},
            {label: 'CATEGORY', fieldName: 'category', type: 'text'}
        ]);
    },
    closeGrantContent : function(component, event, helper) {
        component.set("v.openGrantContent", false);
        //Turning off the back button
        component.set('v.backButtonPress', false);
        //Publish the reset event
        var componentEvent = component.getEvent("grantResetEvent");
        componentEvent.setParam("type", "grantReset");
        componentEvent.fire(); 
    },
    openGrantCartAward : function(component, event, helper) {
        component.set("v.openGrantAward", true);
        component.set("v.openGrantContent", false);
        //Turning off the back button
        component.set('v.backButtonPress', false);
    },
    changeGrantType : function(component, event, helper) {
        var grantTypeCombo = component.find("grant-type-change");
        var grantCategoryComboBox = component.find('grant-category-change');
        component.set('v.loadData', []);
        component.set('v.data', []);
        component.set("v.showTypeError", false); 
        component.set("v.showCategoryError", false);
        //Calling the backend only if the data is items and packs
        if(grantTypeCombo.get("v.value") != "Currency"){
            helper.getGrantCategories(component, event, grantTypeCombo.get("v.value"));
        }else{
            grantCategoryComboBox.set('v.disabled', true);
            component.set("v.selectedCategorylist",[]);
            helper.loadCurrenctList(component, event);             
        }
        
    },
    clearCacheData : function(component, event, helper) {
        component.set("v.ITEM_DEF_CATEGORY", []);
        component.set("v.PACK_DEF_TYPE", []);
        component.set("v.Currency", []);
    },
    changeGrantCategory : function(component, event, helper) {
        var selectedOptionValue = event.getParam("value");
        var itemsOrPacks = component.find("grant-type-change").get("v.value");
        component.set("v.showCategoryError", false);
        if(itemsOrPacks == 'ITEM_DEF_CATEGORY'){
            helper.getItems(component, event, helper, selectedOptionValue); //TSM-2099 - Removing unassigned condition
        }    
        else if(itemsOrPacks == 'PACK_DEF_TYPE'){
            helper.getPacks(component, event, helper, selectedOptionValue);
        }    
    },
    //Function to handle row click
    updateSelectedText: function (component, event, helper) {
        var dataRows = component.get('v.loadData');
        if(event.getSource().get('v.checked')){
            //Adding row to list if checked 
            helper.addSelectedRow(component, event, dataRows[event.getSource().get('v.name')]);  
        }else{
            //Removing row from list if unchecked
            helper.removeSelectedRow(component, event, dataRows[event.getSource().get('v.name')]);  
        }
        
    },
    //Function to handle filter close
    onFilterClose: function (component, event, helper) {
        var dataRows = component.get('v.allFilterData');
        var selectedFilter = event.currentTarget.dataset.value;
        //TSM - 1896
        var selectedFilterValue = dataRows[selectedFilter];
        var globalMap  = component.get("v.globalSelectionMap");
        
        dataRows.splice(selectedFilter, 1);       
        //Setting the data to the display
        component.set('v.allFilterData', dataRows);
        
        //Finding the category - TSM - 1896
        if(selectedFilterValue.subject == "Items"){
            selectedFilterValue.subject = "ITEM_DEF_CATEGORY";
        }else if(selectedFilterValue.subject == "Packs"){
            selectedFilterValue.subject = "PACK_DEF_TYPE";
        }
        
        //Handling the error case for currencies
        if(selectedFilterValue.subject == "ITEM_DEF_CATEGORY" || selectedFilterValue.subject == "PACK_DEF_TYPE"){
            var currentGlobalMapArray = globalMap[selectedFilterValue.subject][(event.currentTarget.dataset.name).toLowerCase()];
            //Finding the index
            for(var i = 0 ; i<currentGlobalMapArray.length ; i++){
                //Finding the index of the removal element
                if(currentGlobalMapArray[i].id == selectedFilterValue.id){
                    globalMap[selectedFilterValue.subject][(event.currentTarget.dataset.name).toLowerCase()].splice(i, 1); 
                }
            }            
        }else{
            var currentGlobalMapArray = globalMap["Currency"];
            for(var i = 0 ; i<currentGlobalMapArray.length ; i++){
                if(currentGlobalMapArray[i].id == selectedFilterValue.id){
                    globalMap["Currency"].splice(i, 1);
                }
            }
        }
        
        //Change of the selection
        if(dataRows.length > 0){
            component.set('v.showFilterCart', true);
        }else{
            component.set('v.showFilterCart', false);
        }
        //Setting the global map
        component.set("v.globalSelectionMap", globalMap);
        
        //Preloading the data if the grid is present
        if(component.get("v.showDataTable")){
            //Removing the data from the grid
            helper.removeLoadData(component, event, selectedFilterValue);
        }  
    },
    enableNextButton: function (component, event) {
        var allFilterData  = component.get("v.allFilterData"); 
        var selectCartButton = component.find("viewGrantCart");
        if(allFilterData.length > 0){   
            selectCartButton.set('v.disabled', false);
        }else{
            selectCartButton.set('v.disabled', true);
        }
    },
    reInitGrantInfo: function (component, event) {
        var dataRows = component.get('v.allFilterData');
        //Performing the re-init function
        if(component.get("v.backButtonPress")){
            //Opening the show filter component
            if(dataRows.length > 0){
                component.set('v.showFilterCart', true); 
                component.find("viewGrantCart").set("v.disabled", false); //TSM-2100
            }           
        }
    },
    grantSearchKeyUp: function (component, event, helper) {
        //Getting all the products information based on the search string
        var grantTypeComboValue = component.find("grant-type-change").get("v.value");
        var categoryComboValue = component.find("grant-category-change").get("v.value").toLowerCase();
        if(grantTypeComboValue != "" && categoryComboValue != ""){
            var searchRecords=[];
            var searchString = component.get("v.grantSearchString");
            var allProducts = component.get("v.data");
            var timer = component.get('v.keyPressTimer');
            clearTimeout(timer);
            timer = setTimeout(function() {
                //Looping through products to get the specific result
                if(helper.isValidString(searchString)){              
                    if(searchString == ""){
                        searchRecords = allProducts;
                    }else{
                        for(var eachProduct in allProducts){
                            //loading the search based on entered value  for all products
                            if (allProducts[eachProduct].name.toLowerCase().search(searchString.toLowerCase()) >= 0) {
                                searchRecords.push(allProducts[eachProduct]);
                            }
                        }
                    }
                }
                clearTimeout(timer);
                component.set('v.keyPressTimer', 0);
                //Calling the per-load data
                component.set("v.isSearchData", true);
                if(searchRecords.length > 0){
                    component.set('v.isDataNull', false);
                    helper.populateSearchData(component, event, searchRecords);
                }else{
                    component.set('v.isDataNull', true);
                    component.set('v.errorMessage', "No result found for "+searchString);
                }
                
            }, 100);
            component.set('v.keyPressTimer', timer);
            event.stopPropagation();
            event.preventDefault();
        }else{
            //Display error
            if(grantTypeComboValue == ""){
                component.set("v.showTypeError", true);
                component.set("v.showCategoryError", true);
            }else{            
                //TSM-1952
                if(categoryComboValue == "" && grantTypeComboValue != "Currency"){
                    component.set("v.showTypeError", false);
                    component.set("v.showCategoryError", true);
                }
            }
        }
    },
    toggleTypeBorder: function (component, event, helper) {
        if(component.get("v.showTypeError")){
            $A.util.addClass(component.find("grant-type-change"),"warning-border");
        }else{
            $A.util.removeClass(component.find("grant-type-change"),"warning-border"); 
        }
    },
    toggleCategoryBorder: function (component, event, helper) {
        if(component.get("v.showCategoryError")){
            $A.util.addClass(component.find("grant-category-change"),"warning-border");
        }else{
            $A.util.removeClass(component.find("grant-category-change"),"warning-border");
        }        
    },
    handlePageChange: function(component, event, helper){
        //Generating start index and end index
        var startIndex = (component.get("v.pageNumber") - 1) * 20;
        var endIndex = (component.get("v.pageNumber"))*20;
        //Calling the pagenation if no search has been initilized
        helper.populatePageNationList(component, event, component.get('v.data'), startIndex, endIndex);        
    },
    reloadGridData: function(component, event, helper){
        setTimeout(function() {
            helper.preloadData(component, event); 
        }, 50); 
    },
})