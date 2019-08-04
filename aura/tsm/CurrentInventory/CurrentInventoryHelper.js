({
    initHelper : function(component, event, helper){
         component.set("v.cols",['NAME','CATEGORY','QUANTITY']);
         if(window.permissionsList){
             var selectedProduct = component.get("v.selectedProduct").Url_Name__c;
            if(window.permissionsList.includes('grant currency to wallet') || window.permissionsList.includes('remove currency from wallet')){
                component.set('v.hasModifyCurrencyPermission', true);
            }
            if(selectedProduct.includes('fifa') && window.permissionsList.includes('add or remove fifa draft token')){
                 component.set('v.hasModifyDraftTokenPermission', true);
            }
        } 
        var inventoryStats = component.get('v.inventoryStats');
        for(var i in inventoryStats) {
            inventoryStats[i].canModify = false;
        }
        helper.updatePaginationData(component, event, helper, component.get("v.items"));
        helper.handleChange(component, event, helper, 'init');
    },
    toggleRow: function(component, index) {
        const items = component.get("v.paginatedData");
        if(Array.isArray(items) && items[index]){
            items[index].expanded = !items[index].expanded;          
            component.set("v.paginatedData", items);           
        }      
    },
    handleChange : function(component, event, helper, action) {
        component.set("v.itemData", null);
        component.set("v.packsData", null);
        component.find("categories").set("v.value", '');
        var selectedOptionValue = event.getParam("value");
        if(component.get("v.types") != null){
            for(var i=0; i < component.get("v.types").length; i++){
                if(component.get("v.types")[i].value === selectedOptionValue)
                    component.set("v.selectedCurrencyText",component.get("v.types")[i].label);
            }
        }
        
        //component.set("v.selectedCurrencyText",component.find("types").get("v.label"));
        if(action == 'init'){
            selectedOptionValue = 'Currency';
            component.find("types").set("v.value", 'Currency');
        }
        component.set("v.selectedCurrency",selectedOptionValue);
        if(selectedOptionValue == 'Trade Piles'){
            component.set("v.cols",['NAME','CATEGORY','RATING','STATE']);
            helper.getTradePiles(component, event, helper);
        }
        else{
            component.set("v.cols",['NAME','CATEGORY','QUANTITY']);
        }
        if(selectedOptionValue == 'ITEM_CATEGORY' || selectedOptionValue == 'PACK_TYPE'){
            component.set("v.disableCategories",false);
            
            let selectedPersona = component.get("v.selectedPersona");
            var action = component.get("c.getGameMetaData"); 
            var requestMap = {};
            requestMap["datatype"] = selectedOptionValue;
            requestMap["crmProductName"] = component.get("v.selectedProduct").Url_Name__c;
            requestMap["userId"] = component.get("v.nucleusId");
            requestMap["platform"] = selectedPersona.object.platform;
            action.setParams({
                requestParams : requestMap
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS" && response.getReturnValue().status === "SUCCESS") {
                    var storeResponse = response.getReturnValue();
                    var result =[];
                    if(storeResponse.response.values !== undefined)
                        for(let i=0; i < storeResponse.response.values.length; i++){
                            var resArr={};
                            resArr['value'] =  storeResponse.response.values[i].key;
                            resArr['label'] = storeResponse.response.values[i].value;
                            result.push(resArr);
                        }
                    component.set("v.categories", result);
                    //if(selectedOptionValue == 'ITEM_CATEGORY' || selectedOptionValue == 'PACK_TYPE')
                    //  component.set("v.paginatedData" , null);
                }
                else{
                    component.set("v.categories", null);
                }
                component.set("v.paginatedData" , null);
            });
            $A.enqueueAction(action);
        }
        else{
            helper.updatePaginationData(component, event, helper, component.get("v.items"));
            component.find("categories").set("v.value", '');
            component.set("v.disableCategories",true);
        }
    },
    onCategoryChange : function(component, event, helper) {
        var selectedOptionValue = event.getParam("value");
        var itemsOrPacks = component.find("types").get("v.value");
        if(itemsOrPacks == 'ITEM_CATEGORY')
            helper.getItems(component, event, helper, selectedOptionValue);
        else if(itemsOrPacks == 'PACK_TYPE')
            helper.getPacks(component, event, helper, selectedOptionValue);
    },
    getItems : function(component, event, helper, itemCategory) {
        component.set('v.isLoading', true);
        let selectedPersona = component.get("v.selectedPersona");
        let gameMode = '';
        var action = component.get("c.getInventoryItems");
        if(selectedPersona.gameMode == "WCClub"){
            gameMode = "WC";
        }else{
            gameMode = "FUT";
        }
        var getInventoryMap = {};
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        getInventoryMap["customerId"] = component.get("v.nucleusId");
        getInventoryMap["userId"] = component.get("v.nucleusId");
        getInventoryMap["crmProductName"] = component.get("v.selectedProduct").Url_Name__c;
        
        if(component.get("v.selectedPersona").object.idType != undefined){
            getInventoryMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
        }
        getInventoryMap["textFilter"] =  component.get("v.searchString"); //TSM-3872
        getInventoryMap["gamerId"] = gamerID;
        getInventoryMap["platform"] = selectedPersona.object.platform;
        getInventoryMap["pageNumber"] = '1';
        getInventoryMap["pageSize"] = '20';
        getInventoryMap["itemCategory"] = itemCategory;
        getInventoryMap["gameMode"] = gameMode;
        action.setParams({
            requestParams : getInventoryMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set('v.isLoading', false);
            if (state === "SUCCESS") {
                var inventoryDetails = response.getReturnValue().inventoryDetails;
                if(inventoryDetails != undefined && inventoryDetails.length > 0) {
                    /*for(var i in inventoryDetails) {
                        inventoryDetails[i].canModify = false;
                    }*/
                    component.set("v.itemData", inventoryDetails);
                } else {
                    component.set("v.itemData", null);
                }
                helper.updatePaginationData(component, event, helper, component.get("v.itemData"));
            }
             else{
                component.set('v.paginatedData', null);
            }
        });
        $A.enqueueAction(action);
    },
    getPacks : function(component, event, helper, packCategory) {
        component.set('v.isLoading', true);
        let selectedPersona = component.get("v.selectedPersona");
        let gameMode = '';
        if(selectedPersona.gameMode == "WCClub"){
            gameMode = "WC";
        }else{
            gameMode = "FUT";
        }
        var action = component.get("c.getUserPacks"); 
        var getInventoryMap = {};
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        getInventoryMap["customerId"] = component.get("v.nucleusId");
        getInventoryMap["userId"] = component.get("v.nucleusId");
        getInventoryMap["crmProductName"] = component.get("v.selectedProduct").Url_Name__c;
        
        if(component.get("v.selectedPersona").object.idType != undefined){
            getInventoryMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
        }
        
        getInventoryMap["gamerId"] = gamerID;
        getInventoryMap["platform"] = selectedPersona.object.platform;
        getInventoryMap["packType"] = packCategory;       
        getInventoryMap["gameMode"] = gameMode;     
        action.setParams({
            requestParams : getInventoryMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set('v.isLoading', false);
            if (state === "SUCCESS") {
                if(response.getReturnValue().inventoryDetails != undefined && response.getReturnValue().inventoryDetails.length > 0)
                    component.set("v.packsData", response.getReturnValue().inventoryDetails);
                else
                    component.set("v.packsData", null);
                helper.updatePaginationData(component, event, helper, component.get("v.packsData"));
            }
            else{
                component.set('v.paginatedData', null);
            }
        });
        $A.enqueueAction(action);
    },
    updatePaginationData: function(component, event, helper, data) {
        component.set('v.pageNumber', 1);
        const perPage = component.get('v.perPage');
        const rows = data;
        component.set('v.BUitems' , rows);
        if(rows!=null && rows!='undefined'){
            for(var i=0; i< rows.length; i++){
                rows[i].expanded = false;
                if(rows[i].details != undefined){
                    for(var j=0; j< rows[i].details.length; j++){
                        if((rows[i].details[j].key == 'dateGranted' || rows[i].details[j].key == 'dateClaimed' || rows[i].details[j].key == 'lastUpdatedDate')
                           && rows[i].details[j].value != undefined && rows[i].details[j].value != '')
                            rows[i].details[j].value = Util.getFormattedDateTime(rows[i].details[j].value);
                    }
                }
                if(rows[i].contents != undefined){
                    for(var k=0; k< rows[i].contents.length; k++){
                        if(rows[i].contents[k].details != undefined){
                            if(rows[i].contents[k].details.rewardStartDate != undefined && rows[i].contents[k].details.rewardStartDate != ''){ 
                                if(Util.getFormattedDateTime(rows[i].contents[k].details.rewardStartDate) != ""){
                                    rows[i].contents[k].details.rewardStartDate = Util.getFormattedDateTime(rows[i].contents[k].details.rewardStartDate);
                                }else{
                                    rows[i].contents[k].details.rewardStartDate = rows[i].contents[k].details.rewardStartDate;
                                }
                            }
                            
                            if(rows[i].contents[k].details.rewardEndDate != undefined && rows[i].contents[k].details.rewardEndDate != ''){
                                if(Util.getFormattedDateTime(rows[i].contents[k].details.rewardEndDate) != ""){
                                    rows[i].contents[k].details.rewardEndDate = Util.getFormattedDateTime(rows[i].contents[k].details.rewardEndDate);
                                }else{
                                    rows[i].contents[k].details.rewardEndDate = rows[i].contents[k].details.rewardEndDate;
                                }  
                            }   
                        }
                    }
                }
            }
        }
        component.set('v.paginatedData', null);
        if(rows && Array.isArray(rows)) {
            component.set('v.paginatedData', rows.slice(0, perPage));
        }
    },
    handlePageChange : function(component, event, helper, data) {
        const perPage = component.get('v.perPage');
        const pageNumber = component.get('v.pageNumber');
        const start = (pageNumber-1)*perPage;
        //const rows = component.get('v.items');
        component.set('v.paginatedData', null);
        if(data && Array.isArray(data)) {    
            component.set('v.paginatedData', data.slice(start, start+perPage));
        }else {
            component.set('v.paginatedData', []);
        }
    },
    modifyInventoryUI : function(component, event, value) {
        //Checking the change event for Config UI
        var types = [];
        if(component.get("v.configUIData") !=null){
            var tabObject = component.get("v.configUIData").tabs;
            for (var eachtab in tabObject){
                if(tabObject[eachtab].name == "Current Inventory"){
                    var configUIObject = tabObject[eachtab].sections;
                    for (var eachObject in configUIObject){
                        if(configUIObject[eachObject].name == "Items"){
                            types.push({label: 'Items', value: 'ITEM_CATEGORY'});
                        }
                        if(configUIObject[eachObject].name == "Packs"){
                            types.push({label: 'Packs', value: 'PACK_TYPE'});
                        }
                        if(configUIObject[eachObject].name == "Currencies"){
                            types.push({label: 'Currency', value: 'Currency'});
                        }
                        if(configUIObject[eachObject].name == "Trade Piles"){
                            types.push({label: 'Trade Piles', value: 'Trade Piles'});
                        }
                    }
                }
            }
            component.set('v.types', types);
        }
    },
    getTradePiles : function(component, event, helper) {
        component.set('v.isLoading', true);
        let selectedPersona = component.get("v.selectedPersona");
        var action = component.get("c.getInventoryTradePile"); 
        var getInventoryMap = {};
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        getInventoryMap["customerId"] = component.get("v.nucleusId");
        getInventoryMap["userId"] = component.get("v.nucleusId");
        getInventoryMap["crmProductName"] = component.get("v.selectedProduct").Url_Name__c;
        
        if(component.get("v.selectedPersona").object.idType != undefined){
            getInventoryMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
        }
        
        getInventoryMap["gamerId"] = gamerID;
        getInventoryMap["platform"] = selectedPersona.object.platform;
        getInventoryMap["auctionType"] = 'TradePiles';
        action.setParams({
            requestParams : getInventoryMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set('v.isLoading', false);
            if (state === "SUCCESS") {
                var storeResponse = JSON.parse(response.getReturnValue());
                if(storeResponse != null && storeResponse.response != null){
                    component.set("v.tradePilesData", storeResponse.response.auctionInfo); 
                    console.log(storeResponse.response.auctionInfo);
                    helper.updatePaginationData(component, event, helper, component.get("v.tradePilesData"));
                }
                else{
                    component.set('v.paginatedData', null);
                }                    
            }
            else if(state === "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                        toastEvent.setParams({
                            "message":  errors[0].message,
                            "type" : "error"
                        });  
                        console.log("Failed with state: " + state);
                    }
                    toastEvent.fire();
                }
                component.set('v.paginatedData', null)
            }
            else{
                component.set('v.paginatedData', null);
            }
        });
        $A.enqueueAction(action);
    },
    //TSM-2912 - Function to validate against grantable values
    isPresentInCurrencyArray: function(arrayToValidate, valueToValidate){
        var returnValue = false;
        var maxGrantableLimit = valueToValidate.maxCreditableValue;
        var maxDebitableValue = valueToValidate.maxDebitableValue;
        
        //Checking for creditable true
        for (var eachConfig in arrayToValidate){
            //Checking for creditable
            if(arrayToValidate[eachConfig].creditable){
                //Checking for id and name
                if(arrayToValidate[eachConfig].walletId == valueToValidate.walletId){
                    returnValue = true;
                    maxGrantableLimit = arrayToValidate[eachConfig].maxCreditableLimit;
                }else if(arrayToValidate[eachConfig].walletName == valueToValidate.name){
                    returnValue = true;
                    maxGrantableLimit = arrayToValidate[eachConfig].maxCreditableLimit;
                }
            }
            
            //Checking for debitable
            if(arrayToValidate[eachConfig].debitable){
                //Checking for id and name
                if(arrayToValidate[eachConfig].walletId == valueToValidate.walletId){
                    returnValue = true;
                    maxDebitableValue = arrayToValidate[eachConfig].maxDebitableLimit;
                }else if(arrayToValidate[eachConfig].walletName == valueToValidate.name){
                    returnValue = true;
                    maxDebitableValue = arrayToValidate[eachConfig].maxDebitableLimit;
                }
            }        
            
            //Return if any data is true
            if(returnValue){
                return [returnValue, maxGrantableLimit, maxDebitableValue]; 
            }
        }
        //Retrun is the data is false
        return [returnValue, maxGrantableLimit, maxDebitableValue];        
    },  
})