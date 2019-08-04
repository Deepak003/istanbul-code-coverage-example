({
    initialteLoad : function(component, event) {
        var allFilterData = component.get("v.allFilterData");
        var itemArray = [];
        var packsArray = [];
        var currencyArray = [];
        var isContainerConfigured =  component.get('v.isContianerConfigured');
        if(isContainerConfigured){
            this.getContainers(component);
        } 
        var selectedProduct = component.get("v.selectedProduct");
        
        //Validating the disable button
        if(allFilterData.length > 0){
            for(var eachData in allFilterData){
                //Checking Items
                if(allFilterData[eachData].subject == "Items"){                
                    var itemMap = {};
                    var itemList = [];
                    var itemConfigList = [];                
                    itemMap["data"] = allFilterData[eachData];                        
                    //TSM-3570 - Adding default value to content
                    if(allFilterData[eachData].grantableTypes != undefined){
                        //Creating the config combo list
                        for(var eachConfig in allFilterData[eachData].grantableTypes){
                            var quantityMap = {};
                            quantityMap["label"]  = allFilterData[eachData]["grantableTypes"][eachConfig].type;
                            quantityMap["value"]  = allFilterData[eachData]["grantableTypes"][eachConfig].type;
                            if(allFilterData[eachData]["grantableTypes"][eachConfig].type == 'Standard' && selectedProduct.includes('fifa')){
                                if(window.permissionsList && window.permissionsList.includes('grant fifa standard item')){
                                    itemConfigList.push(quantityMap);
                                }  
                            }
                            else{
                                itemConfigList.push(quantityMap);
                            }
                        } 
                    }else{
                        var quantityMap = {};
                        quantityMap["label"]  = 'Untradeable';
                        quantityMap["value"]  = 'Untradable'; 
                        itemConfigList.push(quantityMap);
                    }
                    
                    itemMap["configList"] = itemConfigList;
                    
                    //TSM-2910 - Adding grant permission for limit
                    var isItemGreneric = this.isPresentInItemArray(component.get("v.genericConfigurationData").itemPermissions , allFilterData[eachData]); 
                    if(isItemGreneric[0]){
                        allFilterData[eachData].maxLimitToGrant = isItemGreneric[1];
                    }

                    //Checking the combo list
                    if(allFilterData[eachData].maxLimitToGrant != null){                    
                        for(var i = 0; i< allFilterData[eachData].maxLimitToGrant; i++ ){
                            var quantityMap = {}
                            quantityMap["label"]  = i+1 +'x';
                            quantityMap["value"]  = (i+1).toString();
                            itemList.push(quantityMap);
                        }
                        itemMap["quantityList"] = itemList;
                    }else{
                        itemList.push({'label': '1x', 'value': '1'});
                        itemMap["quantityList"] = itemList;
                    }                
                    itemArray.push(itemMap);
                    
                }else if(allFilterData[eachData].subject == "Packs"){                
                    var pacMap = {};
                    var pacList = [];
                    var pacConfigList = [];
                    pacMap["data"] = allFilterData[eachData];                
                    
                    //Creating the config combo list
                    for(var eachConfig in allFilterData[eachData].grantableTypes){
                        var quantityMap = {}
                        quantityMap["label"]  = allFilterData[eachData]["grantableTypes"][eachConfig].type;
                        quantityMap["value"]  = allFilterData[eachData]["grantableTypes"][eachConfig].type;
                        pacConfigList.push(quantityMap);
                    }      
                    pacMap["configList"] = pacConfigList;
                    
                    // TSM-2911 - Adding grant permission for limit
                    var isPackGreneric = this.isPresentInPackArray(component.get("v.genericConfigurationData").packPermissions , allFilterData[eachData]); 
                    if(isPackGreneric[0]){
                        allFilterData[eachData].maxLimitToGrant = isPackGreneric[1];
                    }

                    //Checking the combo list
                    if(allFilterData[eachData].maxLimitToGrant != null){                    
                        for(var i = 0; i< allFilterData[eachData].maxLimitToGrant; i++ ){
                            var quantityMap = {}
                            quantityMap["label"]  = i+1 +'x';
                            quantityMap["value"]  = (i+1).toString();
                            pacList.push(quantityMap);
                        }
                        pacMap["quantityList"] = pacList;
                    }else{
                        pacList.push({'label': '1x', 'value': '1'});
                        pacMap["quantityList"] = pacList;
                    }
                    
                    packsArray.push(pacMap);
                }else{
                    currencyArray.push(allFilterData[eachData]);
                    //Loading the reason if currency data exists
                    if(currencyArray.length > 0){
                        this.loadCurrenctReasons(component, event);
                    }
                }
            }
            //Validating the grant button for currency - Items and Packs pre selected        
            if(currencyArray.length == 0){
                component.find("grantCartDetails").set("v.disabled", false);
            }
        }else{
            component.find("grantCartDetails").set("v.disabled", true); //Setting true if every element is removed
        }
        
        component.set("v.itemData", itemArray);        
        component.set("v.packsData", packsArray);
        component.set("v.currencyData", currencyArray);
    },
    //Looping through the list and granting each elements in the list
    grantArrayList : function(component, event) {
        var itemArray = component.get("v.itemData");
        var packsArray = component.get("v.packsData");
        var currencyArray = component.get("v.currencyData");
        
        if(itemArray.length > 0){
            this.grantEachItem(component, event, 0);
        }else if(packsArray.length > 0){
            this.grantEachPacks(component, event, 0);
        }else if(currencyArray.length > 0){
            this.grantEachCurrency(component, event, 0);
        }
        
    },
    //Function to hit the backend and grant the items based on the selection
    grantEachItem : function(component, event, indexValue) {
        component.set("v.isLoading", true);
        
        var itemArray = component.get("v.itemData");
        var packsArray = component.get("v.packsData"); 
        var currencyArray = component.get("v.currencyData");
        
        if(component.find("item-configuration-change").length != undefined){
            var itemConfigList = component.find("item-configuration-change")[indexValue];
            var itemCountList = component.find("item-count-change")[indexValue]; 
            var itemContainerList = component.find("items-container")[indexValue];           
        }else{
            var itemConfigList = component.find("item-configuration-change");
            var itemCountList = component.find("item-count-change");  
            var itemContainerList = component.find("items-container");           
        }
        
        let selectedPersona = component.get("v.selectedPersona");
        var action = component.get("c.grantContent"); 
        var getInventoryMap = {};
        //Generating the data map 
        var dataMapArray = []; 
        var dataMap= {};
        dataMap["itemDefinitionId"] = itemArray[indexValue]["data"]["id"];
        dataMap["quantity"] = itemCountList.get("v.value");
        if(itemConfigList.get("v.value") == "Untradable"){
            dataMap["untradable"] = "true";
            getInventoryMap["untradable"] = "true";
        }else{
            dataMap["untradable"] = "false";
            getInventoryMap["untradable"] = "false"; 
        }        
        dataMap["grantableType"] = itemConfigList.get("v.value");
        dataMap["grantableTypeValue"] = itemConfigList.get("v.value") == 'Loan' ? '6' : '';
        dataMapArray.push(dataMap);
        //generating the gamer id 
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        //generating other parameters 
        getInventoryMap["notes"] = "Testing TSM item integration";
        getInventoryMap["crmProductName"] = component.get("v.selectedProduct");
        
        if(component.get("v.selectedPersona").object.idType != undefined){             
            getInventoryMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
        }
        
        
        getInventoryMap["gamerId"] = gamerID; 
        getInventoryMap["containerId"] = itemContainerList.get("v.value");
        getInventoryMap["data"] = JSON.stringify(dataMapArray);
        //Generating the data from the list 
        getInventoryMap["itemType"] = itemArray[indexValue]["data"]["category"];
        getInventoryMap["itemName"] = itemArray[indexValue]["data"]["name"];
        getInventoryMap["itemId"] = itemArray[indexValue]["data"]["id"]; 
        getInventoryMap["platform"] = selectedPersona.object.platform; 
        getInventoryMap["tire"] = itemArray[indexValue]["data"]["level"];
        getInventoryMap["rating"] = itemArray[indexValue]["data"]["rating"];
        getInventoryMap["grantableType"] = itemConfigList.get("v.value"); //From the combo box
        getInventoryMap["grantableValue"];
        getInventoryMap["itemTypeValue"];
        getInventoryMap["quantity"] = itemCountList.get("v.value"); //From the combo value
        getInventoryMap["gameMode"] = itemArray[indexValue]["data"]["modeType"];
        getInventoryMap["grantType"] = itemArray[indexValue]["data"]["subject"]; 
        //Sending persona name
        getInventoryMap["personaName"] = selectedPersona.object.name;
        console.log(getInventoryMap);
        action.setParams({
            requestParams : getInventoryMap,
            strCustomerId : component.get("v.nucleusId"),
            strCaseId : component.get("v.caseId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var responseObject = response.getReturnValue();
            
            component.set("v.isLoading", false);
            if (responseObject.status === "SUCCESS") {
                //Adding the result to the success array
                var successArray = component.get("v.successData");
                //Creating the map to append
                var appendMap = {};
                appendMap["type"] = "Item";
                appendMap["name"] = responseObject.name;
                appendMap["category"] = itemConfigList.get("v.value");
                appendMap["quantity"] = itemCountList.get("v.value");
                
                successArray = successArray.concat(appendMap);
                component.set("v.successData", successArray);
                
                //constructing grant info
                var grantInfo = component.get("v.grantEventData");
                grantInfo = grantInfo.concat(responseObject.grantInfo);
                component.set("v.grantEventData", grantInfo); 
                
                //Looping to find the next item
                if(itemArray.length != indexValue+1){
                    this.grantEachItem(component, event, indexValue + 1);
                }else{
                    //Checking of the packs if greater than 0
                    if(packsArray.length > 0){
                        this.grantEachPacks(component, event, 0);
                    }else if(currencyArray.length > 0){
                        this.grantEachCurrency(component, event, 0);
                    }else{
                        this.publishResult(component, event);
                    } 
                }
            }else{
                //Adding the result to the success array
                var failedArray = component.get("v.failedData");
                //Creating the map to append
                var appendMap = {};
                appendMap["type"] = "Item";
                appendMap["name"] = responseObject.name;
                appendMap["category"] = itemConfigList.get("v.value");
                appendMap["quantity"] = itemCountList.get("v.value");
                
                failedArray = failedArray.concat(appendMap);
                component.set("v.failedData", failedArray);
                
                //Looping to find the next item
                if(itemArray.length != indexValue+1){
                    this.grantEachItem(component, event, indexValue + 1);
                }else{
                    //Checking of the packs if greater than 0
                    if(packsArray.length > 0){
                        this.grantEachPacks(component, event, 0);
                    }else if(currencyArray.length > 0){
                        this.grantEachCurrency(component, event, 0);
                    }else{
                        this.publishResult(component, event);
                    }
                }                
            }
        });
        $A.enqueueAction(action);
    },
    //Function to hit the backend and grant the packs based on the selection
    grantEachPacks : function(component, event, indexValue) {
        component.set("v.isLoading", true);
        
        var itemArray = component.get("v.itemData");
        var packsArray = component.get("v.packsData");
        var currencyArray = component.get("v.currencyData");
        
        if(component.find("pack-configuration-change").length != undefined){
            var packsConfigList = component.find("pack-configuration-change")[indexValue];
            var packsCountList = component.find("pack-count-change")[indexValue]; 
            var packContainerList = component.find("packs-container")[indexValue];            
        }else{
            var packsConfigList = component.find("pack-configuration-change");
            var packsCountList = component.find("pack-count-change");
            var packContainerList = component.find("packs-container");           
        }
        
        let selectedPersona = component.get("v.selectedPersona");
        var action = component.get("c.grantContent"); 
        var getInventoryMap = {};
        //Generating the data map 
        var dataMapArray = []; 
        var dataMap= {};
        dataMap["packDefinitionId"] = packsArray[indexValue]["data"]["id"];
        dataMap["quantity"] = packsCountList.get("v.value");
        if(packsConfigList.get("v.value") == "Untradable"){
            dataMap["untradable"] = "true";
            getInventoryMap["untradable"] = "true";
        }else{
            dataMap["untradable"] = "false";
            getInventoryMap["untradable"] = "false"; 
        } 
        dataMap["grantableType"] = packsConfigList.get("v.value"); //From the combo box
        dataMap["grantableTypeValue"] = packsConfigList.get("v.value") == 'Loan' ? '6' : '';
        dataMapArray.push(dataMap);
        //generating the gamer id 
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        //generating other parameters 
        getInventoryMap["notes"] = "Testing TSM packs integration";
        getInventoryMap["crmProductName"] = component.get("v.selectedProduct");
        
        if(component.get("v.selectedPersona").object.idType != undefined){              
            getInventoryMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
        }
        
        getInventoryMap["gamerId"] = gamerID; 
        getInventoryMap["data"] = JSON.stringify(dataMapArray);
        getInventoryMap["platform"] = selectedPersona.object.platform;
        getInventoryMap["containerId"] = packContainerList.get("v.value");
        
        //Generating the data from the list  
        getInventoryMap["packName"] = packsArray[indexValue]["data"]["name"];
        getInventoryMap["grantableType"] = packsConfigList.get("v.value"); //From the combo box
        getInventoryMap["grantableValue"];
        getInventoryMap["packId"] = packsArray[indexValue]["data"]["id"]; 
        getInventoryMap["quantity"] = packsCountList.get("v.value"); 
        getInventoryMap["packType"] = packsArray[indexValue]["data"]["category"];
        getInventoryMap["gameMode"] = packsArray[indexValue]["data"]["modeType"];        
        getInventoryMap["grantType"] = packsArray[indexValue]["data"]["subject"]; 
        //Sending persona name
        getInventoryMap["personaName"] = selectedPersona.object.name;
        console.log(getInventoryMap);
        action.setParams({
            requestParams : getInventoryMap,
            strCustomerId : component.get("v.nucleusId"),
            strCaseId : component.get("v.caseId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var responseObject = response.getReturnValue();
            component.set("v.isLoading", false);
            if (responseObject.status  === "SUCCESS") { 

                //tsm2940 making attribute true to carry it to final parent
                var refreshSessionEvent = component.getEvent("refreshSessionsTab");
                refreshSessionEvent.fire();

                //Adding the result to the success array
                var successArray = component.get("v.successData");
                //Creating the map to append
                var appendMap = {};
                appendMap["type"] = "Pack";
                appendMap["name"] = responseObject.name;
                appendMap["category"] = packsConfigList.get("v.value");
                appendMap["quantity"] = packsCountList.get("v.value");
                
                successArray = successArray.concat(appendMap);
                component.set("v.successData", successArray);
                
                //constructing grant info
                var grantInfo = component.get("v.grantEventData");
                grantInfo = grantInfo.concat(responseObject.grantInfo);
                component.set("v.grantEventData", grantInfo);
                
                //Looping to find the next pack
                if(packsArray.length != indexValue+1){
                    this.grantEachPacks(component, event, indexValue + 1);
                }else if(currencyArray.length > 0){
                    this.grantEachCurrency(component, event, 0);
                }else{
                    this.publishResult(component, event);
                }
            }else{
                //Adding the result to the success array
                var failedArray = component.get("v.failedData");
                //Creating the map to append
                var appendMap = {};
                appendMap["type"] = "Pack";
                appendMap["name"] = responseObject.name;
                appendMap["category"] = packsConfigList.get("v.value");
                appendMap["quantity"] = packsCountList.get("v.value");
                
                failedArray = failedArray.concat(appendMap);
                component.set("v.failedData", failedArray);
                
                //Looping to find the next pack
                if(packsArray.length != indexValue+1){
                    this.grantEachPacks(component, event, indexValue + 1);
                }else if(currencyArray.length > 0){
                    this.grantEachCurrency(component, event, 0);
                }else{
                    this.publishResult(component, event);
                }                
            }
        });
        $A.enqueueAction(action);
    },
    //Awarding the currency
    grantEachCurrency : function(component, event, indexValue) {
        component.set("v.isLoading", true);
        var currencyArray = component.get("v.currencyData");
        
        let selectedPersona = component.get("v.selectedPersona");        
        var getModifiedCurrencyMap = {};
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        
        getModifiedCurrencyMap["customerId"] = component.get("v.nucleusId");
        getModifiedCurrencyMap["crmProductName"] = component.get("v.selectedProduct");
        
        if(component.get("v.selectedPersona").object.idType != undefined){             
            getModifiedCurrencyMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
        }       
        
        getModifiedCurrencyMap["gamerId"] = gamerID;
        getModifiedCurrencyMap["platform"] = selectedPersona.object.platform;
        getModifiedCurrencyMap["balance"] = currencyArray[indexValue].balance ;
        //Calculating the balance from the list of id's
        if(component.find('currency-amount').length != undefined){
            getModifiedCurrencyMap["amount"] = component.find('currency-amount')[indexValue].get('v.value');  
        }else{
            getModifiedCurrencyMap["amount"] = component.find('currency-amount').get('v.value');
        }        
        getModifiedCurrencyMap["transactionType"] = "credit";
        //Calculating the reason from the list of id's
        if(component.find('currency-amount').length != undefined){
            getModifiedCurrencyMap["reason"] = component.find('currency-reason-change')[indexValue].get('v.value');  
        }else{
            getModifiedCurrencyMap["reason"] = component.find('currency-reason-change').get('v.value');
        }
        
        getModifiedCurrencyMap["walletId"] = currencyArray[indexValue].id;
        getModifiedCurrencyMap["walletName"] = currencyArray[indexValue].name;      
        
        //Creating the map to append
        var appendMap = {};
        appendMap["type"] = "Currency";
        appendMap["name"] = currencyArray[indexValue].name;
        appendMap["category"] = getModifiedCurrencyMap["reason"];
        appendMap["quantity"] = getModifiedCurrencyMap["amount"];
        
        var action = component.get("c.modifyCurrencyOfWallet");
        action.setParams({
            mapRequestParams : getModifiedCurrencyMap
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.isLoading", false);                  
            if(state  === "SUCCESS"){
                var storeResponse = response.getReturnValue();
                if(storeResponse != null){
                    var successArray = component.get("v.successData");
                    successArray = successArray.concat(appendMap);
                    component.set("v.successData", successArray); 
                    
                    //constructing grant info
                    var grantInfo = component.get("v.grantEventData");
                    var grantEventMap = {};
                    grantEventMap["strCreditORDebit"] = "Credit";
                    grantEventMap["strPersona"] = selectedPersona.object.name;
                    grantEventMap["strPlayerIdType"] = "nucleusPersonaId";
                    grantEventMap["strSubCategory"] = currencyArray[indexValue].name;
                    grantEventMap["strCategory"] = "Wallet";
                    grantEventMap["strGrantName"] = currencyArray[indexValue].name;
                    grantEventMap["strGrantedValue"] = getModifiedCurrencyMap["amount"];
                    grantEventMap["strCurrentGrantValue"] = currencyArray[indexValue].balance;
                    grantEventMap["strPlatformName"] = selectedPersona.object.platform;
                    grantEventMap["strPlayerId"] = gamerID;
                    grantEventMap["strProductGroupName"] = "";
                    grantEventMap["strProductName"] = component.get("v.selectedProduct");
                    grantEventMap["strTradableORUnTradable"] = "";
                    
                    grantInfo = grantInfo.concat(grantEventMap);
                    component.set("v.grantEventData", grantInfo);
                    
                    //Looping to find the next pack
                    if(currencyArray.length != indexValue+1){
                        this.grantEachCurrency(component, event, indexValue + 1);
                    }else{
                        this.publishResult(component, event);
                    } 
                }
                else{
                    var failedArray = component.get("v.failedData");
                    failedArray = failedArray.concat(appendMap);
                    component.set("v.failedData", failedArray);
                    
                    //Looping to find the next pack
                    if(currencyArray.length != indexValue+1){
                        this.grantEachCurrency(component, event, indexValue + 1);
                    }else{
                        this.publishResult(component, event);
                    } 
                }
            }else{
                var failedArray = component.get("v.failedData");
                failedArray = failedArray.concat(appendMap);
                component.set("v.failedData", failedArray);
                
                //Looping to find the next pack
                if(currencyArray.length != indexValue+1){
                    this.grantEachCurrency(component, event, indexValue + 1);
                }else{
                    this.publishResult(component, event);
                }                 
            }
        });
        $A.enqueueAction(action);
    },
    //Publishing the data to the Grant Container
    publishResult : function(component, event) {
        //Send Result to Event table
        this.sendResultToEvent(component, event);
    },
    //Function to send result to the event table
    sendResultToEvent : function(component, event) {      
        component.set("v.isLoading", true);  
        var action = component.get("c.publishDataToEvent");
        //Creating a tost object
        var toastEvent = $A.get("e.force:showToast");
        action.setParams({
            requestParams : component.get("v.grantEventData"),
            strCustomerId : component.get("v.nucleusId"),
            strCaseId : component.get("v.caseId")
        });        
        action.setCallback(this, function(response) {
            var state = response.getState();  
            component.set("v.isLoading", false);  
            if(state  === "SUCCESS"){
                var storeResponse = response.getReturnValue();
                component.set("v.grantEventData", []);
            }else{
                var errorMessage = response.getError();
                //Adding failure toast
                toastEvent.setParams({
                    message: errorMessage[0].message,
                    type: "error"
                });
                //toastEvent.fire(); 
                component.set("v.grantEventData", []);
            }  
            //Publish to Success window
            var componentEvent = component.getEvent("backActionEvent");
            componentEvent.setParam("type", "publishDataFired");
            componentEvent.setParam("successData", component.get("v.successData"));
            componentEvent.setParam("failedData", component.get("v.failedData"));
            componentEvent.fire(); 
        });
        $A.enqueueAction(action);
    },
    //Load the resons for the currency
    loadCurrenctReasons: function (component, event, currencyData) { 
        component.set("v.isLoading", true);
        
        var action = component.get("c.fetchAddCreditToWalletReasons"); 
        action.setCallback(this, function(response) {
            component.set("v.isLoading", false);
            
            var state = response.getState();
            var storeResponse = response.getReturnValue();
            console.log(response.getReturnValue());
            if (state === "SUCCESS") {
                var result =[];
                for(let i=0; i < storeResponse.length; i++){
                    var resArr={};
                    resArr['label'] =  storeResponse[i].name;
                    resArr['value'] = storeResponse[i].id;
                    result.push(resArr);
                }
                component.set("v.currencyReasons", result);
            }
        });
        $A.enqueueAction(action);
    },
    //Function to validate all errors
    validateAllParameters: function (component, event) {
        var currencyArray = component.find("currency-amount");
        var returnValue = false;
        if(currencyArray != undefined){
            //Checking validity
            if(currencyArray.length != undefined){
                for(var eachArray in currencyArray){
                    //Checking for validity
                    if(!currencyArray[eachArray].get("v.validity").valid){
                        returnValue = true;
                    }else if(currencyArray[eachArray].get("v.value") == ""){
                        returnValue = true;
                    }
                }
            }else{
                if(!currencyArray.get("v.validity").valid){
                    returnValue = true;
                }else if(currencyArray.get("v.value") == ""){
                    returnValue = true;
                }
            }                    
            //validate reason
            this.validateAllComboBox(component, event, returnValue);
        }
    },
    //Function to validate all reasons
    validateAllComboBox: function (component, event, validationError) {
        //Checking if validation exists
        if(validationError){
            component.find("grantCartDetails").set("v.disabled", true);
        }else{
            var validateReasonDiv = component.find("currency-reason-change");
            var disabledState = false;
            if(validateReasonDiv.length > 0){
                for(var eachDiv in validateReasonDiv){
                    if(validateReasonDiv[eachDiv].get("v.value") == ""){
                        disabledState = true;
                    }
                }
            }else{
                if(validateReasonDiv.get("v.value") == ""){
                    disabledState = true;          
                }
            }
            component.find("grantCartDetails").set("v.disabled", disabledState);
        }
    },
    //TSM-2910 - Function to validate against grantable values
    isPresentInItemArray: function(arrayToValidate, valueToValidate){
        var returnValue = false;
        var maxGrantableLimit;
        //Checking for id in the data
        for (var eachConfig in arrayToValidate){
            if(arrayToValidate[eachConfig].itemType.toLowerCase() == valueToValidate.category.toLowerCase()){
                returnValue = true;
                maxGrantableLimit = arrayToValidate[eachConfig].maxGrantableLimit;
                return [returnValue, maxGrantableLimit];
            }else if(arrayToValidate[eachConfig].itemName == valueToValidate.name){
                returnValue = true;
                maxGrantableLimit = arrayToValidate[eachConfig].maxGrantableLimit;
                return [returnValue, maxGrantableLimit];
            }else if(arrayToValidate[eachConfig].itemId == valueToValidate.id){
                returnValue = true;
                maxGrantableLimit = arrayToValidate[eachConfig].maxGrantableLimit;
                return [returnValue, maxGrantableLimit];
            }
        }
        return [returnValue, maxGrantableLimit];
    },
    //TSM-2911 - Function to validate against grantable values
    isPresentInPackArray: function(arrayToValidate, valueToValidate){
        var returnValue = false;
        var maxGrantableLimit;
        //Checking for type, id and name in the data as priority order
        for (var eachConfig in arrayToValidate){
            if(arrayToValidate[eachConfig].packType.toLowerCase() == valueToValidate.category.toLowerCase()){
                returnValue = true;
                maxGrantableLimit = arrayToValidate[eachConfig].maxGrantableLimit;
                return [returnValue, maxGrantableLimit];
            }else if(arrayToValidate[eachConfig].packName == valueToValidate.name){
                returnValue = true;
                maxGrantableLimit = arrayToValidate[eachConfig].maxGrantableLimit;
                return [returnValue, maxGrantableLimit];
            }else if(arrayToValidate[eachConfig].packId == valueToValidate.id){
                returnValue = true;
                maxGrantableLimit = arrayToValidate[eachConfig].maxGrantableLimit;
                return [returnValue, maxGrantableLimit];
            }
        }
        return [returnValue, maxGrantableLimit];
    },
    //TSM-2912 - Function to validate against grantable values
    isPresentInCurrencyArray: function(arrayToValidate, valueToValidate){
        var returnValue = false;
        var maxGrantableLimit;
        //Checking for creditable true
        for (var eachConfig in arrayToValidate){
            if(arrayToValidate[eachConfig].creditable){
                //Checking for id and name
                if(arrayToValidate[eachConfig].walletId == valueToValidate.id){
                    returnValue = true;
                    maxGrantableLimit = arrayToValidate[eachConfig].maxCreditableLimit;
                    return [returnValue, maxGrantableLimit];
                }else if(arrayToValidate[eachConfig].walletName == valueToValidate.name){
                    returnValue = true;
                    maxGrantableLimit = arrayToValidate[eachConfig].maxCreditableLimit;
                    return [returnValue, maxGrantableLimit];
                }
            }
        }
        return [returnValue, maxGrantableLimit];        
    },

    checkContainerConfiguration : function(component) {
        if(component.get("v.configUIData") !=null){
            var tabObject = component.get("v.configUIData").tabs;
            for (var eachtab in tabObject){
                if(tabObject[eachtab].name == "Product Snapshot"){
                    var configUIObject = tabObject[eachtab].sections;
                    console.log(configUIObject);
                    for (var eachObject in configUIObject){
                        if(configUIObject[eachObject].name == "Containers Grant"){
                            component.set('v.isContianerConfigured', true);
                        }
                    }
                }
            }
        }
    },
    
    getContainers : function(component){
        var action = component.get("c.getContainers");
        let selectedPersona = component.get("v.selectedPersona");
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        var dataMap= {};
        dataMap["crmProductName"] = component.get("v.selectedProduct");
        dataMap["gamerIdType"] = 'nucleusPersonaId';
        dataMap["gamerId"] = gamerID; 
        dataMap["platform"] = selectedPersona.object.platform;
        action.setParams({
            requestParams : dataMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse = response.getReturnValue();
            if (state === "SUCCESS") { 
                var result =[];
                if(storeResponse != null){
                    var containers = storeResponse.response.containers;
                    for(let i=0; i < containers.length; i++){
                        var resArr={};
                        resArr['label'] = containers[i].containerName;
                        resArr['value'] = containers[i].containerId;
                        result.push(resArr);
                    }
                }                
                component.set("v.containersList", result);
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
            }
        });
        $A.enqueueAction(action);     
    },
})