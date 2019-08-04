({
    setCurrencyLookupData: function(component, event, helper) {
        const inventoryStats = component.get("v.inventoryStats") || [];       
        component.set("v.walletTxCategoryData", inventoryStats.map((is, i)=>({ "Id": is.walletId, "Name": is.name })));
    },
    //Clearing the selection
    clearSelectionFromHistory : function(component, event, type) {
        //Clear selection
        var saveButton = component.find("saveFilter");
        //Remove all the check boxes
        var productFilters = [].concat(component.find("productFiltersCheckBox")); 
        //Looping through checkbox to enable and disable save button
        if(component.find("productFiltersCheckBox") != null){
            for(var eachObject in productFilters) {
                productFilters[eachObject].set("v.checked", false);
                var filterType = productFilters[eachObject].get('v.name');
                component.set("v."+filterType, false);
                //TSM-1622
                component.set("v.eventSelectedData", []);
                component.set("v.challengesSelectedData", []);
                component.set("v.setsSelectedData", []);
                component.set("v.WalletsSelectedData", []);
                component.set("v.matchesSelectedData", []);
            }
        }
        saveButton.set('v.disabled', true);
        //Reset Time Range
        component.find("presentSelections").set("v.value", "7");
        //Reset Failed data TSM - 1622
        component.set("v.failedData", []);
    },
    //Function used to get the Meta-data
    getGameMetaData : function(component, event, type) {
        var action = component.get("c.getGameMetaData");
        var gameDataMap = {};
        gameDataMap["customerId"] = component.get("v.nucleusId");
        gameDataMap["productName"] = component.get("v.selectedProduct.Url_Name__c");
        gameDataMap["datatype"] = type;
        gameDataMap["platform"] = component.get("v.selectedPersona").object.platform;
        action.setParams({
            data : gameDataMap,
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                if(response.getReturnValue() != null){
                    if(response.getReturnValue().length > 0){
                        if(response.getReturnValue().status  != "ERROR"){
                            var parsedData = response.getReturnValue();
                            //var parsedData = JSON.parse(storeResponse).response.values;
                            if(type == "ITEM_TX_CATEGORY"){
                                component.set("v.transactionFilterData", parsedData);
                            }else if(type == "EVENT_CATEGORY"){
                                var parsedString = JSON.stringify(parsedData);
                                parsedString = parsedString.replace(/key/g, "Id");
                                parsedString = parsedString.replace(/value/g, "Name");
                                component.set("v.eventCategoryData", JSON.parse(parsedString));
                            }else if(type == "CHALLENGE_CATEGORY"){
                                var parsedString = JSON.stringify(parsedData);
                                parsedString = parsedString.replace(/key/g, "Id");
                                parsedString = parsedString.replace(/value/g, "Name");
                                component.set("v.challengesCategoryData", JSON.parse(parsedString));
                            }else if(type == "DRAFT_MODES"){
                                var parsedString = JSON.stringify(parsedData);
                                parsedString = parsedString.replace(/key/g, "Id");
                                parsedString = parsedString.replace(/value/g, "Name");
                                component.set("v.draftCategoryData", JSON.parse(parsedString));
                            }else if(type == "SET_CATEGORY"){
                                var parsedString = JSON.stringify(parsedData);
                                parsedString = parsedString.replace(/key/g, "Id");
                                parsedString = parsedString.replace(/value/g, "Name");
                                component.set("v.setsCategoryData", JSON.parse(parsedString));
                            }else if(type == "MATCH_TYPES"){
                                var parsedString = JSON.stringify(parsedData);
                                parsedString = parsedString.replace(/key/g, "Id");
                                parsedString = parsedString.replace(/value/g, "Name");
                                component.set("v.matchesCategoryData", JSON.parse(parsedString));
                                console.log('matches ::'+parsedString);
                            }
                        }
                    }else{
                        //Checking if the category filter to false
                        if(type == "CHALLENGE_CATEGORY"){
                            component.set("v.challengesCategoryData", "No Category");
                        }
                    }
                }
            }
        });
        $A.enqueueAction(action); 
    },
    getItemTransactionLogHistory : function(component, event, indexValue, isModeFilterExist) {
        var action = component.get("c.getItemTransactionLogHistory");
        var gameMode = '';
        var loginFilterList = component.get('v.loginFilterList');   
        var isMobileProduct = component.get('v.isMobileProduct');   
        var selectedIdentity = component.get('v.selectedIdentity');   
        var transactionDataMap = {};
        var transactionList =  component.get('v.transactionFilterList');
        
        //TSM-2813 Getting the paginated list
        var paginatedProducts = $A.get("$Label.c.PRODUCT_FOR_TSM_HISTORY_LOG_PAGINATION");
        
        if(paginatedProducts != "" && paginatedProducts != undefined && paginatedProducts != null){
            paginatedProducts = paginatedProducts.split(",");
        }
        
        transactionDataMap["customerId"] = component.get("v.nucleusId");
        transactionDataMap["productName"] = component.get("v.selectedProduct.Url_Name__c");
        transactionDataMap["txCategory"] = transactionList[indexValue];
        transactionDataMap["pageNumber"] = "1";
        
        //TSM-2813 Adding the final paginated number
        transactionDataMap["pageSize"] = $A.get("$Label.c.TSM_DEFAULT_SOV_PAGE_SIZE");
        transactionDataMap["isPaginated"] = false;
        
        //TSM-2813 checking for paginated product
        if(paginatedProducts.indexOf(transactionDataMap["productName"])!= -1){
            transactionDataMap["pageSize"] = $A.get("$Label.c.TSM_PAGINATION_SOV_PAGE_SIZE");
            transactionDataMap["isPaginated"] = true;
        }
        
        if(!isMobileProduct){
            transactionDataMap["platform"] = component.get("v.selectedPersona").object.platform;
            //Handling for all games
            if(component.get("v.selectedPersona").object.id != null){
                transactionDataMap["gamerId"] = component.get("v.selectedPersona").object.id;
            }else if(component.get("v.selectedPersona").object.uid != null){
                transactionDataMap["gamerId"] = component.get("v.selectedPersona").object.uid;
            }
            
            if(component.get("v.selectedPersona").object.idType != undefined){               
                transactionDataMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
            } 
            
        }  
        else{
            transactionDataMap["gamerId"] =  component.get("v.selectedProduct").object.id;
            transactionDataMap["gamerIdType"] =  component.get("v.selectedProduct").object.idType; 
        }
        transactionDataMap["textFilter"] = ""; 
        transactionDataMap["startDate"] = component.find("startDateTime").get("v.value"); 
        transactionDataMap["endDate"] = component.find("endDateTime").get("v.value");   
        //Formatting startdate and end date
        transactionDataMap["startDate"] = transactionDataMap["startDate"].split(":")[0]+':'+transactionDataMap["endDate"].split(":")[1]+'Z';
        transactionDataMap["endDate"] = transactionDataMap["endDate"].split(":")[0]+':'+transactionDataMap["endDate"].split(":")[1]+'Z';
        var toastEvent = $A.get("e.force:showToast");
        
        //TSM-1989
        if(!isMobileProduct && component.get("v.selectedPersona").gameMode != undefined){
            if(component.get("v.selectedPersona").gameMode == "WCClub"){
                gameMode = "WC";
            }else{
                gameMode = "FUT";
            }            
            transactionDataMap["gameMode"] = gameMode;   
        }
        action.setParams({
            data : transactionDataMap,
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var isModeFilterExist = component.get("v.isModeFilterExist");
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                
                //TSM-2813 Adding the transaction data map to the final value
                if(transactionDataMap["isPaginated"] && storeResponse.length == parseInt($A.get("$Label.c.TSM_PAGINATION_SOV_PAGE_SIZE"))){
                    storeResponse[parseInt($A.get("$Label.c.TSM_PAGINATION_SOV_PAGE_SIZE")) - 1].transactionDataMap = transactionDataMap;
                    storeResponse[parseInt($A.get("$Label.c.TSM_PAGINATION_SOV_PAGE_SIZE")) - 1].isPagination = true;
                }else if(storeResponse.length == parseInt($A.get("$Label.c.TSM_DEFAULT_SOV_PAGE_SIZE"))){//This is the condition in existing omega where they check the item.length to the default size of 15 as per UI
                    storeResponse[parseInt($A.get("$Label.c.TSM_DEFAULT_SOV_PAGE_SIZE")) - 1].transactionDataMap = transactionDataMap;
                    storeResponse[parseInt($A.get("$Label.c.TSM_DEFAULT_SOV_PAGE_SIZE")) - 1].isNextCall = true;                    
                }//Games which does not give the response of the expected size sent will not do pagination
                
                //Merging the data
                var bulkDataArray = component.get("v.bulkDataTransfer");
                if(bulkDataArray == null){
                    component.set("v.bulkDataTransfer",storeResponse);
                }else{
                    bulkDataArray = bulkDataArray.concat(storeResponse);
                    component.set("v.bulkDataTransfer",bulkDataArray);
                }  
                //Checking for the next transcation
                if(transactionList.length != indexValue+1){
                    this.getItemTransactionLogHistory(component, event, indexValue + 1);
                }else{
                    //Checking of the mode filter exists
                    if(isModeFilterExist){
                        this.getModeHistory(component, event, 0);
                    }else if(loginFilterList.length > 0){
                        //Checking of login filter exists
                        this.getLoginData(component, event);
                    }else{
                        //Publishing of nothing else is selected
                        this.publishDataToHistoryTab(component, event);
                    }
                }
            }else{
                //TSM -1622 - Updated for enhancement
                var failedMessage = {};
                
                //TSM-2772 - Adding error state
                if(response.getError()[0] != undefined){
                    failedMessage["ErrorMessage"] = transactionList[indexValue]+" - " + response.getError()[0].message;
                }else{
                    failedMessage["ErrorMessage"] = transactionList[indexValue]+" filter failed to load";
                }
                
                //Appending the failure result
                var failedData = component.get("v.failedData");
                failedData = failedData.concat(failedMessage);
                component.set("v.failedData", failedData);
                
                //Similar publish pattern for the error
                if(transactionList.length != indexValue+1){
                    this.getItemTransactionLogHistory(component, event, indexValue + 1);
                }else{
                    if(isModeFilterExist){
                        this.getModeHistory(component, event, 0);
                    }else if(loginFilterList.length > 0){
                        this.getLoginData(component, event);
                    }else{
                        //Publishing of nothing else is selected
                        this.publishDataToHistoryTab(component, event);
                    }
                }
            }
        });
        $A.enqueueAction(action); 
    },
    getWalletTransactionLogHistory : function(component, event, helper) {
        var action = component.get("c.getWalletTransactions");
        var gameMode = '';
        var loginFilterList = component.get('v.loginFilterList');   
        var transactionDataMap = {};
        var transactionList =  component.get('v.transactionFilterList');
        var isMobileProduct = component.get('v.isMobileProduct');   
        var selectedIdentity = component.get('v.selectedIdentity');  
        transactionDataMap["customerId"] = component.get("v.nucleusId");
        transactionDataMap["productName"] = component.get("v.selectedProduct.Url_Name__c");
        //transactionDataMap["txCategory"] = transactionList[indexValue];
        //transactionDataMap["walletId"] = 'COINS';        
        transactionDataMap["walletId"] = component.get('v.WalletsSelectedData').map((wd)=>wd.Id).join(",");
        transactionDataMap["pageNumber"] = "1";
        transactionDataMap["pageSize"] = "50";   
        
        if(!isMobileProduct){
            transactionDataMap["platform"] = component.get("v.selectedPersona").object.platform;
            //Handling for all games
            if(component.get("v.selectedPersona").object.id != null){
                transactionDataMap["gamerId"] = component.get("v.selectedPersona").object.id;
            }else if(component.get("v.selectedPersona").object.uid != null){
                transactionDataMap["gamerId"] = component.get("v.selectedPersona").object.uid;
            }
            
            if(component.get("v.selectedPersona").object.idType != undefined){
                transactionDataMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
            } 
        }
        else{
            transactionDataMap["gamerId"] =  component.get("v.selectedPersona").object.id;
            transactionDataMap["gamerIdType"] =  component.get("v.selectedPersona").object.idType; 
        }
            
        transactionDataMap["textFilter"] = ""; 
        transactionDataMap["startDate"] = component.find("startDateTime").get("v.value");
        transactionDataMap["startDate"] = transactionDataMap["startDate"].split(":")[0]+':'+transactionDataMap["startDate"].split(":")[1]+'Z' ;
        transactionDataMap["endDate"] = component.find("endDateTime").get("v.value");   
        transactionDataMap["endDate"] = transactionDataMap["endDate"].split(":")[0]+':'+transactionDataMap["endDate"].split(":")[1]+'Z' ; 
        var toastEvent = $A.get("e.force:showToast");
        //TSM-1989
        if(!isMobileProduct){
            if(component.get("v.selectedPersona").gameMode == "WCClub"){
                gameMode = "WC";
            }else{
                gameMode = "FUT";
            }
            transactionDataMap["gameMode"] = gameMode;   
        }
        action.setParams({
            inputMap : transactionDataMap,
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                console.log("storeResponse : "+storeResponse);
                //Merging the data
                
                var bulkDataArray = component.get("v.bulkDataTransfer");
                if(bulkDataArray == null){
                    component.set("v.bulkDataTransfer",storeResponse);
                }else{
                    bulkDataArray = bulkDataArray.concat(storeResponse);
                    component.set("v.bulkDataTransfer",bulkDataArray);
                }
                this.publishDataToHistoryTab(component, event);
            }else{
                //TSM -1622 - Updated for enhancement
                var failedMessage = {};
                failedMessage["ErrorMessage"] = "Currency Transaction filter failed to load";
                //Appending the failure result
                var failedData = component.get("v.failedData");
                failedData = failedData.concat(failedMessage);
                component.set("v.failedData", failedData);
                
                this.publishDataToHistoryTab(component, event);
            }
        });
        $A.enqueueAction(action); 
    },
    getModeHistory : function(component, event, indexValue) {   
        var modeList =  component.get('v.modeFilterList');
        var currentModeCategoriesList; 
        var categoryList = [];
        var categoryNameList = [];
        var selectedType = "";
        //Changing logic for pills
        switch(modeList[indexValue]) {
            case "CHALLENGE_CATEGORY" :
                if(component.get("v.challengesCategoryData") == "No Category"){
                    categoryList.push("CHALLENGE_CATEGORY");
                }else{
                    selectedType = "v.challengesSelectedData";
                }
                break;
            case "DRAFT_MODES" :
                categoryList.push("DRAFT_MODES");
                break;
            case "SET_CATEGORY" :
                selectedType = "v.setsSelectedData";
                break;
            case "EVENT_CATEGORY" :
                selectedType = "v.eventSelectedData";
                break;
            case "MATCH_TYPES" :
                if(component.get("v.matchesCategoryData") == "No Category"){
                    categoryList.push("MATCH_TYPES");
                }else{
                    selectedType = "v.matchesSelectedData";
                }
            break;
        }
        
        if(selectedType != ""){
            currentModeCategoriesList = component.get(selectedType);            
            for(var eachCategory in currentModeCategoriesList){
                  /* Added this Code for TSM-3589*/
                var categoryId = currentModeCategoriesList[eachCategory].Id;
                if(selectedType == "v.matchesSelectedData" && currentModeCategoriesList[eachCategory].Name == 'Rivals'){                    
                    if(categoryId.indexOf("|")){                      
                        categoryList.push(categoryId.split("|")[0]);
                    }                    
                }else{
                   categoryList.push(currentModeCategoriesList[eachCategory].Id); 
                }
                /* End of Code for TSM-3589*/
                categoryNameList.push(currentModeCategoriesList[eachCategory].Name);
            }
        }
        component.set('v.subCategoryFilterList',categoryList);
        
        //Calling the fetch function with first index
        if(categoryList.length >0){
            this.getCurrentModeData(component, event, categoryList, categoryNameList, 0, indexValue);
        }else{
            if(modeList.length != indexValue +1){
                this.getModeHistory(component, event, indexValue + 1);
            }else{
                component.set("v.isLoading", false);
            }
        }
    },
    getCurrentModeData : function(component, event, categoryList, categoryNameList, categoryIndex, modeIndex) {
        var modeList =  component.get('v.modeFilterList');
        var modeMapping = {"SET_CATEGORY":"getSetsHistory","CHALLENGE_CATEGORY":"getChallengesHistory", "EVENT_CATEGORY": "getEventsHistory", "DRAFT_MODES": "getDraftsHistory", "MATCH_TYPES":"getMatchDetails"};
        var backEndCallString = modeMapping[modeList[modeIndex]];
        var loginFilterList = component.get('v.loginFilterList');
        var isMobileProduct = component.get('v.isMobileProduct');   
        var selectedIdentity = component.get('v.selectedIdentity');  
        var action = component.get("c."+backEndCallString);
        var gameMode = '';     
        var modeDataMap = {};
        modeDataMap["customerId"] = component.get("v.nucleusId");
        modeDataMap["productName"] = component.get("v.selectedProduct.Url_Name__c");        
        switch(backEndCallString) {
            case "getSetsHistory" :
                modeDataMap["setCategory"] = categoryList[categoryIndex];
                break;
            case "getChallengesHistory" :
                if(component.get("v.challengesCategoryData") == "No Category"){
                    modeDataMap["challengeCategory"] = "";
                }else{
                    modeDataMap["challengeCategory"] = categoryList[categoryIndex];
                }  
                break;
            case "getEventsHistory" :
                modeDataMap["eventCategory"] = categoryList[categoryIndex];
                break;
            case "getDraftsHistory" :
                // TSM-1169
                modeDataMap["draftCategory"] = "";
                break;
            case "getMatchDetails" :
                if(component.get("v.matchesCategoryData") == "No Category"){
                    modeDataMap["matchTypes"] = "";
                }else{
                    modeDataMap["matchTypes"] = categoryList[categoryIndex];
                } 
            break;
        }
        
        if(!isMobileProduct){
            modeDataMap["platform"] = component.get("v.selectedPersona").object.platform; 
            //Handling for all games
            if(component.get("v.selectedPersona").object.id != null){
                modeDataMap["gamerId"] = component.get("v.selectedPersona").object.id;
            }else if(component.get("v.selectedPersona").object.uid != null){
                modeDataMap["gamerId"] = component.get("v.selectedPersona").object.uid;
            }
            
            if(component.get("v.selectedPersona").object.idType != undefined){
                modeDataMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
            }
        }
        else{
            modeDataMap["gamerId"] = component.get("v.selectedPersona").object.id;
            modeDataMap["gamerIdType"] = component.get("v.selectedPersona").object.idType; 
        }
        modeDataMap["textFilter"] = ""; 
        modeDataMap["startDate"] = component.find("startDateTime").get("v.value"); 
        modeDataMap["endDate"] = component.find("endDateTime").get("v.value"); 
        //Formatting startdate and end date
        modeDataMap["startDate"] = modeDataMap["startDate"].split(":")[0]+':'+modeDataMap["endDate"].split(":")[1]+'Z';
        modeDataMap["endDate"] = modeDataMap["endDate"].split(":")[0]+':'+modeDataMap["endDate"].split(":")[1]+'Z';
        var toastEvent = $A.get("e.force:showToast");
        if(!isMobileProduct){
            //TSM-1989
            if(component.get("v.selectedPersona").gameMode == "WCClub"){
                gameMode = "WC";
            }else{
                gameMode = "FUT";
            }
            modeDataMap["gameMode"] = gameMode; 
        }
        //Capturing the selected category - TSM-1622
        var selectedCategory = categoryNameList[categoryIndex];
        
        //TSM-3056 - Adding date plus the value in labels
        if(selectedCategory == "RIVALS"){
            //setting end date
            var currentEndDate = new Date(modeDataMap["endDate"]);
            modeDataMap["endDate"] = new Date(currentEndDate.setDate(currentEndDate.getDate() + parseInt($A.get("$Label.c.TSM_RIVALS_END_DATE")))).toISOString();
            
            //setting start date
            var currentStartDate = new Date(modeDataMap["startDate"]);
            modeDataMap["startDate"] = new Date(currentStartDate.setDate(currentStartDate.getDate() - parseInt($A.get("$Label.c.TSM_RIVALS_END_DATE")))).toISOString();
        }

        action.setParams({
            inputMap : modeDataMap,
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();  
                //Merging the data
                var bulkDataArray = component.get("v.bulkDataTransfer");
                if(bulkDataArray == null){
                    component.set("v.bulkDataTransfer",storeResponse);
                }else{
                    bulkDataArray = bulkDataArray.concat(storeResponse);
                    component.set("v.bulkDataTransfer",bulkDataArray);
                }            
                //Checking of next category exists
                if(categoryList.length != categoryIndex +1){
                    this.getCurrentModeData(component, event, categoryList, categoryNameList, categoryIndex+1, modeIndex); 
                }else{
                    //Checking of next mode exists
                    if(modeList.length != modeIndex +1){
                        this.getModeHistory(component, event, modeIndex + 1);
                    }else if(loginFilterList.length > 0){
                        //Checking if login data exists
                        this.getLoginData(component, event);
                    }else{
                        //Publishing of nothing else is selected
                        this.publishDataToHistoryTab(component, event);
                    }
                }
            }else{
                //TSM -1622 - Updated for enhancement
                var failedMessage = {};
                //TSM-2772 - Adding error state
                if(response.getError()[0] != undefined){
                    failedMessage["ErrorMessage"] = selectedCategory+" - " + response.getError()[0].message;
                }else{
                    failedMessage["ErrorMessage"] = selectedCategory+" filter failed to load";
                }
                //Appending the failure result
                var failedData = component.get("v.failedData");
                failedData = failedData.concat(failedMessage);
                component.set("v.failedData", failedData);
                
                //Similar publish pattern for the error
                if(categoryList.length != categoryIndex +1){
                    this.getCurrentModeData(component, event, categoryList, categoryNameList, categoryIndex+1, modeIndex); 
                }else{
                    if(modeList.length != modeIndex +1){
                        this.getModeHistory(component, event, modeIndex + 1);
                    }else if(loginFilterList.length > 0){
                        this.getLoginData(component, event);
                    }else{
                        //Publishing of nothing else is selected
                        this.publishDataToHistoryTab(component, event);
                    }
                }
            }
        });
        $A.enqueueAction(action); 
    },
    getLoginData : function(component, event) {
        var action = component.get("c.getLoginHistory");
        var isMobileProduct = component.get('v.isMobileProduct');   
        var selectedIdentity = component.get('v.selectedIdentity');  
        var gameMode = '';     
        var transactionDataMap = {};
        transactionDataMap["customerId"] = component.get("v.nucleusId");
        transactionDataMap["productName"] = component.get("v.selectedProduct.Url_Name__c");
         
        if(!isMobileProduct){
            transactionDataMap["platform"] = component.get("v.selectedPersona").object.platform;
            //Handling for all games
            if(component.get("v.selectedPersona").object.id != null){
                transactionDataMap["gamerId"] = component.get("v.selectedPersona").object.id;
            }else if(component.get("v.selectedPersona").object.uid != null){
                transactionDataMap["gamerId"] = component.get("v.selectedPersona").object.uid;
            }  

            if(component.get("v.selectedPersona").object.idType != undefined){
                transactionDataMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
            }            
        }
        else{
            transactionDataMap["gamerId"] = component.get("v.selectedPersona").object.id;
            transactionDataMap["gamerIdType"] = component.get("v.selectedPersona").object.idType; 
        }
        transactionDataMap["startDate"] = component.find("startDateTime").get("v.value"); 
        transactionDataMap["endDate"] = component.find("endDateTime").get("v.value");   
        //Formatting startdate and end date
        transactionDataMap["startDate"] = transactionDataMap["startDate"].split(":")[0]+':'+transactionDataMap["endDate"].split(":")[1]+'Z';
        transactionDataMap["endDate"] = transactionDataMap["endDate"].split(":")[0]+':'+transactionDataMap["endDate"].split(":")[1]+'Z';
        var toastEvent = $A.get("e.force:showToast");
        if(!isMobileProduct){
            //TSM-1989
            if(component.get("v.selectedPersona").gameMode == "WCClub"){
                gameMode = "WC";
            }else{
                gameMode = "FUT";
            }
            transactionDataMap["gameMode"] = gameMode;  
        }  
        action.setParams({
            requestParams : transactionDataMap,
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue(); 
                //Merging the data
                var bulkDataArray = component.get("v.bulkDataTransfer");
                if(bulkDataArray == null){
                    component.set("v.bulkDataTransfer",storeResponse);
                }else{
                    bulkDataArray = bulkDataArray.concat(storeResponse);
                    component.set("v.bulkDataTransfer",bulkDataArray);
                }
                this.publishDataToHistoryTab(component, event);
            }else{
                //TSM -1622 - Updated for enhancement
                var failedMessage = {};
                //TSM-2772 - Adding error state
                if(response.getError()[0] != undefined){
                    failedMessage["ErrorMessage"] = response.getError()[0].message;
                }else{
                    failedMessage["ErrorMessage"] = "Login filter failed to load";
                }
                //Appending the failure result
                var failedData = component.get("v.failedData");
                failedData = failedData.concat(failedMessage);
                component.set("v.failedData", failedData);
                
                this.publishDataToHistoryTab(component, event);
            }
        });
        $A.enqueueAction(action); 
    },
    publishDataToHistoryTab : function(component, event) {
        var bulkData = component.get("v.bulkDataTransfer") || [];
        var failedData = component.get("v.failedData"); //TSM-1622
        var returnFilterMap = this.getAllFilterValues(component, event); //Updated TSM-1622
        this.publishPlatFormEventForHistoryFilterCriteria(component, event); 
        //setting the global cache
        component.set("v.cacheBulkData", bulkData); 
        component.set("v.cacheFilterData", returnFilterMap); //TSM-2121
        component.getEvent("onHistoryData").setParams({"historyData" :  bulkData, "failedData":failedData, "filterData":returnFilterMap}).fire(); //TSM-1622
        component.set("v.isLoading", false);
    },
    publishCacheToHistoryTab : function(component, event) {
        var cacheBulkData = component.get("v.cacheBulkData");
        var failedData = component.get("v.failedData");
        var returnFilterMap = component.get("v.cacheFilterData");//TSM-2121
        //setting the global cache   
        if(cacheBulkData != null){
            component.getEvent("onHistoryData").setParams({"historyData" :  cacheBulkData, "failedData":failedData, "filterData":returnFilterMap}).fire(); //TSM-1622
            component.set("v.isLoading", false); 
        }
    },
    loadInitialDate : function(component, event, value, currentDate) {
        var currentDate = currentDate;
        component.find("endDateTime").set("v.value",currentDate.toISOString()); 
        //Getting the past n days   
        currentDate.setDate(currentDate.getDate() - value);  
        component.find("startDateTime").set("v.value",currentDate.toISOString());     
    },
    loadInitialTime : function(component, event, value, currentDate) {
        var currentDate = currentDate;
        component.find("endDateTime").set("v.value",currentDate.toISOString()); 
        //Getting the past 2 hours   
        currentDate.setHours(currentDate.getHours() - value);  
        component.find("startDateTime").set("v.value",currentDate.toISOString());     
    },
    modifyHistoryUI : function(component, event, value) {
        //Checking the change event for Config UI
        component.set("v.isTransactonExist", false);
        component.set("v.isLoginExist", false);
        component.set("v.isDraftsExist", false);
        component.set("v.isEventExist", false);
        component.set("v.isSetsExist", false);
        component.set("v.isChallengesExist", false);
        component.set("v.isCurrencyTransactionExist", false);
        
        //Checking the response
        if(component.get("v.configUIData") !=null){
            var tabObject = component.get("v.configUIData").tabs;
            for (var eachtab in tabObject){
                if(tabObject[eachtab].name == "History"){
                    var configUIObject = tabObject[eachtab].sections;
                    for (var eachObject in configUIObject){
                        if(configUIObject[eachObject].name == "Transactions"){
                            component.set("v.isTransactonExist", true);
                            if ( configUIObject[eachObject].IsCurrencyTransactionEnabled ) {
                                component.set("v.isCurrencyTransactionExist", true);
                            }
                        }else if(configUIObject[eachObject].name == "Login"){
                            component.set("v.isLoginExist", true);
                        }else if(configUIObject[eachObject].name == "Drafts"){
                            component.set("v.isDraftsExist", true);
                        }else if(configUIObject[eachObject].name == "Events"){
                            component.set("v.isEventExist", true);
                        }else if(configUIObject[eachObject].name == "Sets"){
                            component.set("v.isSetsExist", true);
                        }else if(configUIObject[eachObject].name == "Challenges"){
                            component.set("v.isChallengesExist", true);
                        }else if(configUIObject[eachObject].name == "Matches"){
                            component.set("v.isMatchesExist", true);
                            //Checking if the category filter is true
                            if(!configUIObject[eachObject].isCategoryFilterEnabled){
                                component.set("v.matchesCategoryData", "No Category");
                            }
                        }
                    }
                }
            }
            console.log(configUIObject);
        }
    },
    getAllFilterValues : function(component, event) {
        var historyFilterValuesDataMap = {};
        if(component.get('v.loginFilterList')!= undefined && component.get('v.loginFilterList').length >0 ){
            historyFilterValuesDataMap['login'] = component.get('v.loginFilterList');
        }
        if(component.get('v.transactionFilterList') != undefined && component.get('v.transactionFilterList').length > 0 ){
            historyFilterValuesDataMap['transaction'] = component.get('v.transactionFilterList');
        }
        if(component.get('v.modeFilterList') != undefined && component.get('v.modeFilterList').length > 0){
            historyFilterValuesDataMap['mode'] = component.get('v.modeFilterList');
        }
        if(component.get("v.currencyFilterlist")!=undefined &&component.get("v.currencyFilterlist").length>0){
            console.log('inside currencyList');
            historyFilterValuesDataMap['currency']=component.get('v.currencyFilterlist');
        }
        
        var productFilters = [].concat(component.find("productFiltersCheckBox")); 
        var filterList = [];
        
        var modeFilterValuesDataMap = {};
        var subCategoryListForEventCategory = [];
        var subCategoryListForChallengeCategory = [];
        var subCategoryListForDraftCategory = [];
        var subCategoryListForSetCategory = [];
        var subCategoryListforCurrency=[];
        var subCategoryListForMatchCategory = [];
        
        //Looping through checkbox to enable and disable save button
        for(var eachObject in productFilters) {
            if(productFilters[eachObject].get("v.checked")){
                var filterName = productFilters[eachObject].get('v.label');
                var subfilterName = '';
                if(filterName === 'Events') {
                    var eventFilters = component.get("v.eventSelectedData");                
                    for(var eachObject in eventFilters) {
                        var subfilterName = eventFilters[eachObject].Name;
                        subCategoryListForEventCategory.push(subfilterName);      
                        modeFilterValuesDataMap[filterName.toLowerCase()] = subCategoryListForEventCategory;
                    }
                } 
                else if(filterName === 'Challenges') {
                    if(component.get("v.challengesCategoryData") != "No Category"){
                        var challengesFilters = component.get("v.challengesSelectedData");
                        for(var eachObject in challengesFilters) {
                            var subfilterName = challengesFilters[eachObject].Name;
                            subCategoryListForChallengeCategory.push(subfilterName);      
                            modeFilterValuesDataMap[filterName.toLowerCase()] = subCategoryListForChallengeCategory;
                        }
                    }else{
                        subCategoryListForChallengeCategory.push(["All"]);
                        modeFilterValuesDataMap[filterName.toLowerCase()] = subCategoryListForChallengeCategory;
                    }
                }
                    else if(filterName === 'Draft') {
                        var draftFilters = component.find("DRAFT_MODES");
                        modeFilterValuesDataMap[filterName.toLowerCase()]='All'; //TODO: Check if this is ok?
                    }
                        else if(filterName === 'Sets') {
                            var setFilters = component.get("v.setsSelectedData");
                            for(var eachObject in setFilters) {
                                var subfilterName = setFilters[eachObject].Name;
                                subCategoryListForSetCategory.push(subfilterName);      
                                modeFilterValuesDataMap[filterName.toLowerCase()] = subCategoryListForSetCategory;
                            }
                        }
                else if(filterName === 'Matches') {
                    if(component.get("v.matchesCategoryData") != "No Category"){
                        var matchFilters = component.get("v.matchesSelectedData");
                            for(var eachObject in matchFilters) {
                                var subfilterName = matchFilters[eachObject].Name;
                                subCategoryListForMatchCategory.push(subfilterName);      
                                modeFilterValuesDataMap[filterName.toLowerCase()] = subCategoryListForMatchCategory;
                            }
                    }else{
                        subCategoryListForMatchCategory.push(["All"]);
                        modeFilterValuesDataMap[filterName.toLowerCase()]=subCategoryListForMatchCategory;
                    }
                }
                else if(filterName==='CurrencyTransaction'){
                        console.log('walletxCategorydata ::',component.get("v.walletTxCategoryData"));
                         var currencyFilters = component.get("v.WalletsSelectedData");
                        console.log('currencyFilters ::',currencyFilters);
                        for(var eachObject in currencyFilters) {
                            var subfilterName = currencyFilters[eachObject].Name;
                                console.log('subfilterName ::',subfilterName);
                            subCategoryListforCurrency.push(subfilterName);      
                            modeFilterValuesDataMap[filterName.toLowerCase()] = subCategoryListforCurrency;
                        }
                    }
            }
        }
        historyFilterValuesDataMap['mode'] = modeFilterValuesDataMap;
        historyFilterValuesDataMap['presetSelections'] = component.find('presentSelections').get("v.value");
        historyFilterValuesDataMap['startDateTime'] = component.find('startDateTime').get("v.value");
        historyFilterValuesDataMap['endDateTime'] = component.find('endDateTime').get("v.value");
        
        component.set("v.totalFilterList", filterList);
        component.set("v.selectedHistoryFilterCriteria", JSON.stringify(historyFilterValuesDataMap));  
        //TSM - 1622
        return historyFilterValuesDataMap;
    },
    publishPlatFormEventForHistoryFilterCriteria : function(component,event) {
        console.log('IN publishPlatFormEventForHistoryFilterCriteria, v.historyFilterValuesDataMap:',component.get("v.selectedHistoryFilterCriteria"));
        var toastEvent = $A.get("e.force:showToast");
        var action = component.get("c.pulishHistoryFiltersToPlatformEvent");
        action.setParams({
            "inputFilters" : component.get("v.selectedHistoryFilterCriteria"),
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                /* toastEvent.setParams({
                    message:"Publishing history filter criteria to Platform Event is successful with data:"+ component.get("v.selectedHistoryFilterCriteria"),
                    type: 'success' 
                });
                toastEvent.fire();*/            
            }else{
                //Adding failure toast
                toastEvent.setParams({
                    message:"Publishing history filter criteria to Platform Event failed",
                    type: "error"
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },
    //TSM - 1622 : Function to set the start date
    setStartDate : function(component, event){
        var startDateTime = component.find("startDateTime");
        var currentDate = new Date(component.find("endDateTime").get("v.value")); //Finding the end date
        var dropDownValue = component.find("presentSelections").get("v.value"); //Finding the selection value
        //Condition to set 2 hours
        if(dropDownValue == "2"){
            currentDate.setHours(currentDate.getHours() - dropDownValue); 
        }else{
            currentDate.setDate(currentDate.getDate() - dropDownValue);
        }
        //Set start date if end date is valid
        if(this.validateEndDate(component, event)){
            startDateTime.set("v.value",currentDate.toISOString());
        }
    },
    //Function to validate future date
    validateEndDate: function(component, event){
        var endDateTime = component.find("endDateTime");
        var returnValue = true;
        var enableSave = true;
        if(new Date(endDateTime.get("v.value")) > new Date()){
            returnValue = false; //Setting return value as false
            endDateTime.setCustomValidity("Can't be in future");
        }else{
            endDateTime.setCustomValidity("");
        }
        var saveButton = component.find("saveFilter");
        //Checking for name validation
        if(returnValue){
            //Checking for the filter value
            var productFilters = component.find("productFiltersCheckBox"); 
            //Looping through checkbox to enable and disable save button
            for(var eachObject in productFilters) {
                if(productFilters[eachObject].get("v.checked")){
                    enableSave = false;
                }
            }
        }
        endDateTime.reportValidity();
        saveButton.set('v.disabled', enableSave); 
        return returnValue;
    },
    //Function to set selected data to the cart
    setSelectedData: function(component, event, selectedArray, type){
        if(selectedArray == null){
            selectedArray = [];
        }
        var selectedMap = {};
        //Closing platform
        selectedMap['Id'] = event.getParam('Id');
        selectedMap['Name'] = event.getParam('Name');
        if(selectedMap['Name'] != undefined){
            selectedArray = selectedArray.concat(selectedMap);
            selectedArray = this.removeDuplicates(selectedArray, "Id"); //Removing duplicates
            component.set(type, selectedArray);                
        }
    },
    //Function to remove duplicates
    removeDuplicates : function (myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    },
    //TSM-2813 Funciton to add pagination
    initiatePaginationLoad: function(component, event) {
        var action = component.get("c.getItemTransactionLogHistory");
        var paginationData = component.get("v.paginationData");
        paginationData.transactionDataMap["startDate"] = new Date(paginationData.createdOn).toISOString();
        //Fixing the extra load data
        var bulkDataArray = component.get("v.cacheBulkData");
        bulkDataArray = bulkDataArray.filter(item => item.transactionDataMap == undefined); //Removing the last item with load
        action.setParams({
            data : paginationData.transactionDataMap,
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                
                //TSM-2813 Adding the transaction data map to the final value
                if(paginationData.transactionDataMap["isPaginated"] && storeResponse.length == parseInt($A.get("$Label.c.TSM_PAGINATION_SOV_PAGE_SIZE"))){
                    storeResponse[parseInt($A.get("$Label.c.TSM_PAGINATION_SOV_PAGE_SIZE")) - 1].transactionDataMap = paginationData.transactionDataMap;
                    storeResponse[parseInt($A.get("$Label.c.TSM_PAGINATION_SOV_PAGE_SIZE")) - 1].isPagination = true;
                }else if(storeResponse.length == parseInt($A.get("$Label.c.TSM_DEFAULT_SOV_PAGE_SIZE"))){//This is the condition in existing omega where they check the item.length to the default size of 15 as per UI
                    storeResponse[parseInt($A.get("$Label.c.TSM_DEFAULT_SOV_PAGE_SIZE")) - 1].transactionDataMap = transactionDataMap;
                    storeResponse[parseInt($A.get("$Label.c.TSM_DEFAULT_SOV_PAGE_SIZE")) - 1].isNextCall = true;                    
                }//Games which does not give the response of the expected size sent will not do pagination

                //Merging the data
                if(bulkDataArray == null){
                    component.set("v.bulkDataTransfer",storeResponse);
                }else{
                    bulkDataArray = bulkDataArray.concat(storeResponse);
                    component.set("v.bulkDataTransfer",bulkDataArray);
                }  
                //Publishing of nothing else is selected
                this.publishDataToHistoryTab(component, event);
            }else{
            }
        });
        $A.enqueueAction(action); 
    },
})