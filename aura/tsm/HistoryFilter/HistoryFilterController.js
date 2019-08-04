({
    doInit : function(component, event, helper) {
        helper.getGameMetaData(component, event,"ITEM_TX_CATEGORY");
        helper.loadInitialDate(component, event, 7, new Date());
        helper.modifyHistoryUI(component, event, helper);
        helper.setCurrencyLookupData(component);
    },
    onChangeOfProduct:  function(component, event, helper) {
        helper.getGameMetaData(component, event,"ITEM_TX_CATEGORY");
        helper.setCurrencyLookupData(component);
        component.set("v.cacheBulkData", null);
    },
    
    changeConfigUILayout:  function(component, event, helper) {
        helper.modifyHistoryUI(component, event, helper);
    },
    openModeSelected : function(component, event, helper) {
        var productFilters = [].concat(component.find("productFiltersCheckBox")); 
        var saveButton = component.find("saveFilter"); 
        var startDateTimeValidity = component.find("startDateTime").get("v.validity");
        var endDateTimeValidaity = component.find("endDateTime").get("v.validity");
        var filterType = event.getSource().get('v.name');
        var enableSave= true;
        var transactionfilterlist = [];
        var modefilterlist = [];
        var loginFilterlist = [];
        var currencyFilterlist = [];
        var currencyfilterConstants = ["ADD_CURRENCY_CATEGORY"];
        var modefilterConstants = ["EVENT_CATEGORY","CHALLENGE_CATEGORY","DRAFT_MODES","SET_CATEGORY","MATCH_TYPES"];
        //Opening for the sub categories for filter modes
        if(modefilterConstants.indexOf(filterType) >=0 && filterType!="DRAFT_MODES"){
            if(event.getSource().get('v.checked')){
                helper.getGameMetaData(component, event, filterType); 
                component.set("v."+filterType, true);
            }else{
                component.set("v."+filterType, false);
            }
        }
        if(filterType=="ADD_CURRENCY_CATEGORY"){
            if(event.getSource().get('v.checked')){
                helper.setCurrencyLookupData(component);
                component.set("v."+filterType, true);
            }else{
                component.set("v."+filterType, false);
            }
        }
        //Looping through checkbox to enable and disable save button
        for(var eachObject in productFilters) {
            if(productFilters[eachObject].get("v.checked")){
                enableSave = false;
                var productFilterName = productFilters[eachObject].get("v.name");
                if(modefilterConstants.indexOf(productFilterName) >=0){
                    modefilterlist.push(productFilterName);
                }else if(productFilterName == "All Types"){
                    loginFilterlist.push(productFilterName);
                }else if(productFilterName == "ADD_CURRENCY_CATEGORY"){
                    currencyFilterlist.push(productFilterName);
                }else {
                     transactionfilterlist.push(productFilterName);
                }
            }
        }
        //Checking for name validation
        if(!startDateTimeValidity.valid || !endDateTimeValidaity.valid){
            //Checking for the filter value
            if(!enableSave){
                enableSave = true;
            }
        }
        saveButton.set('v.disabled', enableSave);
        component.set('v.transactionFilterList', transactionfilterlist);
        component.set('v.modeFilterList', modefilterlist);
        component.set('v.loginFilterList', loginFilterlist);
        component.set('v.currencyFilterlist', currencyFilterlist);
    },
    saveFilterValue: function(component, event, helper) {
        component.set("v.isLoading", true);
        var transactionList = component.get('v.transactionFilterList');
        var modeList = component.get('v.modeFilterList');
        var loginFilterList = component.get('v.loginFilterList');
        var WalletsSelectedData = component.get('v.WalletsSelectedData');
        //Clearing the list initially
        component.set("v.bulkDataTransfer", null);
        //If only mode
        if(modeList.length == 0 && transactionList.length > 0){
            helper.getItemTransactionLogHistory(component, event, 0);
            component.set('v.isModeFilterExist',false);
        }
        //If only transaction
        if(transactionList.length == 0 && modeList.length > 0){
            helper.getModeHistory(component, event, 0);
        }
        //Both mode and transaction
        if(transactionList.length > 0 && modeList.length > 0){
            helper.getItemTransactionLogHistory(component, event, 0);
            component.set('v.isModeFilterExist',true);
        }
        //Only login
        if(modeList.length == 0 && transactionList.length == 0 && loginFilterList.length>0){
            helper.getLoginData(component, event);
        }  

        //TSM-4365
        if(component.get("v.ADD_CURRENCY_CATEGORY")){
            if (WalletsSelectedData != "undefined" && WalletsSelectedData != null && WalletsSelectedData.length > 0){
                helper.getWalletTransactionLogHistory(component, event, helper);
            }
        }

        //If nothing disable the spinner
        if(modeList.length == 0 && transactionList.length == 0 && loginFilterList.length==0 && WalletsSelectedData.length==0){
            component.set("v.isLoading", false);
        }
    },
    handlePresentSelectionChange :function(component, event, helper) {
        var currentSelectedDate = new Date(component.find("endDateTime").get("v.value"));
        //Adding condition for 2 hours
        if(event.getParam("value") == "2"){
            helper.loadInitialTime(component, event, event.getParam("value"), currentSelectedDate);  
        }else{
            helper.loadInitialDate(component, event, event.getParam("value"), currentSelectedDate);
        }
    },
    validateDate:  function(component, event, helper) {
        helper.setStartDate(component, event);//Updated TSM - 1622
    },
    clearSelection:  function(component, event, helper) {
        //TSM - 1622
        helper.clearSelectionFromHistory(component, event);
        helper.loadInitialDate(component, event, 7, new Date()); 
    },
    loadCacheValue:  function(component, event, helper) {
        helper.publishCacheToHistoryTab(component, event);
    },
    //Added as apart of TSM-1622 to handle inventory date
    onChangeCurrentInventoryDate:  function(component, event, helper) {
        helper.clearSelectionFromHistory(component, event, helper);
        //Setting the date
        var currentInventoryObject = component.get("v.currentInventoryObject");
        var endDateTime = component.find("endDateTime");
        var currentDate = currentInventoryObject.find((d)=>d.key == 'dateGranted').value;
        if(currentDate.search("PM") >= 0){
            var formatterDate = currentDate.slice(0, -6);
            var formatterDate = formatterDate.split(" ");
            formatterDate[1] = (parseInt(formatterDate[1].split(":")[0]) + 12)+':'+ formatterDate[1].split(":")[1];
            endDateTime.set("v.value", new Date(formatterDate.toString()).toISOString());
            helper.setStartDate(component, event);
        }else{
            endDateTime.set("v.value",new Date(currentDate.slice(0, -6)).toISOString());
            helper.setStartDate(component, event);
        }
        
    },
    handleBubbling : function(component, event, helper) {
        var firedLookupType = event.getParam('type');
        var selectedArray = [];
        var selectedType = "";
        if(firedLookupType == "Events"){
            selectedArray = component.get("v.eventSelectedData");
            selectedType = "v.eventSelectedData";
        }else if(firedLookupType == "Challenges"){
            selectedArray = component.get("v.challengesSelectedData");
            selectedType = "v.challengesSelectedData";            
        }else if(firedLookupType == "Sets"){
            selectedArray = component.get("v.setsSelectedData");
            selectedType = "v.setsSelectedData";            
        }else if(firedLookupType == "WalletTx"){
            selectedArray = component.get("v.WalletsSelectedData");
            selectedType = "v.WalletsSelectedData";            
        }else if(firedLookupType == "Matches"){
            selectedArray = component.get("v.matchesSelectedData");
            selectedType = "v.matchesSelectedData";            
        }
        //Calling the data set if the data exists
        if(selectedType != ""){
            helper.setSelectedData(component, event, selectedArray , selectedType);
        }   
    },
    onFilterClose: function(component, event, helper) {
        var selectedFilterIndex = event.currentTarget.dataset.value;
        var selectedFilterType = event.currentTarget.dataset.name;
        var selectedArray = component.get("v."+selectedFilterType);        
        selectedArray.splice(selectedFilterIndex, 1);   //Removing the index
        component.set("v."+selectedFilterType, selectedArray);
    },
    //TSM-2813 Function to handle pagination
    initiatePagination: function(component, event, helper) {
        helper.initiatePaginationLoad(component, event);
    },
})