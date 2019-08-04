({
    init : function(component, event, helper) {
        helper.initHelper(component, event, helper);
        helper.modifyInventoryUI(component, event, helper);
    },
    //Function used to search for items
    searchItems: function(component, event, helper) {
        let selCurrency = component.get("v.selectedCurrency");
        let categoryValue = component.get("v.categoryValue");
        if(selCurrency == "ITEM_CATEGORY" && event.keyCode == 13 && categoryValue != ""){
            helper.getItems(component, event, helper, categoryValue);
        }
    },
    getSearchResult : function(component, event, helper) {
        let selCurrency = component.get("v.selectedCurrency");
        let data;
        if(selCurrency == "Currency"){
            data = component.get("v.items");
        }
        else if(selCurrency == "ITEM_CATEGORY"){
            data = component.get("v.itemData");
        }
        else if(selCurrency == "Trade Piles"){
           data = component.get("v.tradePilesData")
        }
            else{
                data = component.get("v.packsData");
            }
        // alert('in search logic');
        var searchString = component.get("v.searchString");
        var searchRecords=[];
        if(selCurrency != "ITEM_CATEGORY"){ 
            if(searchString !== ''){
                const items = data;
                for(var eachItem in items){
                    if(selCurrency == "Trade Piles"){
                        try{
                            if( items[eachItem].itemData.name != null){
                                if( items[eachItem].itemData.name.toLowerCase().search(searchString.toLowerCase()) >= 0){
                                    searchRecords.push(items[eachItem]);
                                }
                            }
                        }
                        catch(err){
                            console.log('No results'  + err);
                        }
                    }else{
                        //Enabling Modify Currency Button for Searched Records
                        if(items[eachItem].creditable== true || items[eachItem].debitable == true){
                            items[eachItem].canModify = true;
                        }
                        //loading the search based on entered value  for all products
                        try{
                            if (items[eachItem].name.toLowerCase().search(searchString.toLowerCase()) >= 0) {
                                searchRecords.push(items[eachItem]);
                            }else if(items[eachItem].name != null){
                                if(items[eachItem].name.toLowerCase().search(searchString.toLowerCase()) >= 0){
                                    searchRecords.push(items[eachItem]);
                                }
                            }
                        }
                        catch(err){
                            console.log('No results');
                        }
                    }
                }
                helper.updatePaginationData(component, event, helper, searchRecords);
                component.set("v.searchedcount", searchRecords);
               // component.set("v.paginatedData" , searchRecords);
            }
            else{
                helper.updatePaginationData(component, event, helper, data);

               // component.set("v.paginatedData" , data);
            }
        }
    },
    toggleExpand : function(component, event, helper) {
        const index = event.currentTarget.dataset.index;
       
        var inventoryStats = component.get('v.inventoryStats');
        var pageNumber = component.get('v.pageNumber');
        var perPage = component.get('v.perPage');
        var formattedIndex = Number((pageNumber-1)*perPage)+Number(index);
        //alert(formattedIndex);
        if(Array.isArray(inventoryStats) && inventoryStats[formattedIndex]){
            var inventoryStats = component.get("v.inventoryStats");
            if(inventoryStats[formattedIndex].creditable== true || inventoryStats[formattedIndex].debitable == true){
                //component.set('v.showModifyCurrency',true);
                inventoryStats[formattedIndex].canModify = true;
            }else{
                //component.set('v.showModifyCurrency',false);
                inventoryStats[formattedIndex].canModify = false;
            }
            component.set("v.inventoryStats", inventoryStats);
        }
         helper.toggleRow(component, index);
    },
    handleChange : function(component, event, helper) {
        helper.handleChange(component, event, helper, 'onchange');
    },
    onCategoryChange : function(component, event, helper) {
        helper.onCategoryChange(component, event, helper);
    },
    handlePageChange : function(component, event, helper) {
        let selCurrency = component.get("v.selectedCurrency");
        let data;
        if(component.get("v.searchString") != null && component.get("v.searchString") !== ''){
                data = component.get("v.searchedcount");
                if(component.get("v.searchString") != null && component.get("v.searchString") !== ''&&selCurrency=='ITEM_CATEGORY'){
                    data=component.get("v.itemData");
                }
        }
        else{
            if(selCurrency == "Currency"){
                data = component.get("v.items");
            }
            else if(selCurrency == "ITEM_CATEGORY"){
                data = component.get("v.itemData");
            }
            else if(selCurrency == "Trade Piles"){
                data = component.get("v.tradePilesData");
            }
                else{
                    data = component.get("v.packsData");
                }
        }
        helper.handlePageChange(component, event, helper, data);
    },
    navigateTab : function(component, event, helper) {
        //Getting the current details
        var selectedDetailsIndex = event.getSource().get("v.value");
        var currentElement  = component.get("v.paginatedData")[selectedDetailsIndex];
        //Creating the event
        var appEvent = $A.get("e.c:NavigateToCurrentHistoryEvent");
        appEvent.setParams({ "selectedObject" : currentElement.details }); //TSM -1622
        appEvent.fire();
    },
    modifyCurrency : function(component, event, helper) {
        var item = event.getSource().get("v.value");

        //TSM-2912 - Adding grant permission for limit
        var isCurrencyGreneric = helper.isPresentInCurrencyArray(component.get("v.genericConfigurationData").walletPermissions , item); 
        if(isCurrencyGreneric[0]){
            item.maxCreditableValue = isCurrencyGreneric[1];
            item.maxDebitableValue = isCurrencyGreneric[2];
        } 

        component.set('v.currentBalance',item.balance);
        component.set('v.selectedRowForModal',item);
        component.set('v.isModifyCurrency',true);
    },
    closeModal : function(component, event, helper) {
        component.set('v.isModifyCurrency',false);
    },  
    changeConfigUILayout:  function(component, event, helper) {
        helper.modifyInventoryUI(component, event, helper);
    },
    setPageData : function(component,event,helper){
        if(component.get("v.items") != null){
            if(component.get("v.selectedCurrency")=='Currency'&&component.get("v.items").length>0){
                component.set("v.allItems",component.get("v.items"));
            }
        }
        
        if(component.get("v.itemData") != null){
            if(component.get("v.selectedCurrency")=='ITEM_CATEGORY'&&component.get("v.itemData").length>0){
                component.set("v.allItems",component.get("v.itemData"));
            }
        }
        
        if(component.get("v.packsData") != null){
            if(component.get("v.selectedCurrency")=='PACK_TYPE'&&component.get("v.packsData").length>0){
                component.set("v.allItems",component.get("v.packsData"));
            }
        }
        
        if(component.get("v.tradePilesData") != null){
            if(component.get("v.selectedCurrency")=='Trade Piles'&&component.get("v.tradePilesData").length>0){
                component.set("v.allItems",component.get("v.tradePilesData"));
            }
        }
        if(component.get("v.searchedcount") != null){
            if(component.get("v.searchedcount").length>0){
                component.set("v.allItems",component.get("v.searchedcount"));
            }
        }
    }
})