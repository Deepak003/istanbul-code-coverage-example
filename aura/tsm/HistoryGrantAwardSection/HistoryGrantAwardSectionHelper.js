({
    getArrayDetails : function(component, event) {
        var globalSelectionArray = component.get("v.globalSelectionArray");
        var itemDataArray = [];
        var packDataArray = [];
        for(var eachElement in globalSelectionArray){
            if(globalSelectionArray[eachElement].subject == "Items"){
                itemDataArray = itemDataArray.concat(globalSelectionArray[eachElement]['data'][9].value);
            }else if(globalSelectionArray[eachElement].subject == "Packs"){
                packDataArray = packDataArray.concat(globalSelectionArray[eachElement]['data'][9].value);
            }
        }
        
        if(itemDataArray.length > 0){
            this.getItems(component, itemDataArray, packDataArray, 0);
        }else if(packDataArray.length > 0){
            this.getPacks(component, packDataArray, 0);
        }        
    },
    getItems : function(component, itemDataArray, packDataArray, indexValue) {
        component.set("v.isLoading", true);
        
        let selectedPersona = component.get("v.selectedPersona");
        var action = component.get("c.getGrantableItems"); 
        var getInventoryMap = {};
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        getInventoryMap["customerId"] = component.get("v.nucleusId");
        getInventoryMap["userId"] = component.get("v.nucleusId");
        getInventoryMap["crmProductName"] = component.get("v.selectedProduct");
        getInventoryMap["gamerIdType"] = 'nucleusPersonaId';
        getInventoryMap["gamerId"] = gamerID;
        getInventoryMap["grantable"] = "true";
        getInventoryMap["platform"] = selectedPersona.object.platform;
        getInventoryMap["itemCategory"] = itemDataArray[indexValue].itemType;
        getInventoryMap["textFilter"] = itemDataArray[indexValue].itemName;        
        
        //Will be replaced by config UI once Murali adds the data ins ections
        if(component.get("v.selectedProduct").search("fifa-18") >= 0){
            if(selectedPersona.gameMode == "WCClub"){
                getInventoryMap["gameMode"] = "WC";
            }else{
                getInventoryMap["gameMode"] = "FUT";
            }
        }
        
        action.setParams({
            requestParams : getInventoryMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.isLoading", false);
            if (state === "SUCCESS") {
                var responseObject = response.getReturnValue().response;  
                for(var eachitem in responseObject.items){
                    if(responseObject.items[eachitem].itemDefinitionId  == itemDataArray[indexValue].itemValue){
                        this.initialteLoad(component, responseObject.items[eachitem], "items")
                    }
                }
                console.log(responseObject);
            }          
            //Looping to find the next item
            if(itemDataArray.length != indexValue+1){
                this.getItems(component, itemDataArray, packDataArray, indexValue + 1);
            }else{
                //Checking of the packs if greater than 0
                if(packDataArray.length > 0){
                    this.getPacks(component, packDataArray, 0);
                }
            }
        });
        $A.enqueueAction(action);
    },
    getPacks : function(component, packDataArray, indexValue) {
        component.set("v.isLoading", true);
        component.set("v.showDataTable", true);
        let selectedPersona = component.get("v.selectedPersona");
        var action = component.get("c.getGrantablePacks"); 
        var getInventoryMap = {};
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        getInventoryMap["customerId"] = component.get("v.nucleusId");
        getInventoryMap["userId"] = component.get("v.nucleusId");
        getInventoryMap["crmProductName"] = component.get("v.selectedProduct");
        getInventoryMap["gamerIdType"] = 'nucleusPersonaId';
        getInventoryMap["gamerId"] = gamerID;
        getInventoryMap["platform"] = selectedPersona.object.platform;
        getInventoryMap["packType"] = packDataArray[indexValue].itemType;  
        getInventoryMap["grantable"] = "packs";
        getInventoryMap["textFilter"] = packDataArray[indexValue].itemName;
        
        //Will be replaced by config UI once Murali adds the data ins ections
        if(component.get("v.selectedProduct").search("fifa-18") >= 0){
            if(selectedPersona.gameMode == "WCClub"){
                getInventoryMap["gameMode"] = "WC";
            }else{
                getInventoryMap["gameMode"] = "FUT";
            }
        }
        
        action.setParams({
            requestParams : getInventoryMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.isLoading", false);
            if (state === "SUCCESS") {
                var responseObject = response.getReturnValue().response;
                for(var eachpack in responseObject.packs){
                    if(responseObject.packs[eachpack].packDefinitionId  == packDataArray[indexValue].itemValue){
                        this.initialteLoad(component, responseObject.packs[eachpack], "packs")
                    }
                }
                console.log(responseObject);
            }
            //Looping to find the next pack
            if(packDataArray.length != indexValue+1){
                this.getPacks(component, packDataArray, indexValue + 1);
            }
        });
        $A.enqueueAction(action);
    },
    
    initialteLoad : function(component, elementDetails, type) {   
        var itemData = component.get("v.itemData");
        var packsData = component.get("v.packsData");
        var packsArray= [];
        var pacMap = {};
        var pacList = [];
        var pacConfigList = [];
        pacMap["data"] = elementDetails;                
        
        //Creating the config combo list
        for(var eachConfig in elementDetails.grantableTypes){
            var quantityMap = {}
            quantityMap["label"]  = elementDetails["grantableTypes"][eachConfig].type;
            quantityMap["value"]  = elementDetails["grantableTypes"][eachConfig].type;
            pacConfigList.push(quantityMap);
        }      
        pacMap["configList"] = pacConfigList;
        
        //Checking the combo list
        if(elementDetails.maxLimitToGrant != null){                    
            for(var i = 0; i< elementDetails.maxLimitToGrant; i++ ){
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
        
        if(type == "items"){
            itemData = itemData.concat(packsArray); 
            component.set("v.itemData", itemData);
        }else if(type == "packs"){           
            packsData = packsData.concat(packsArray); 
            component.set("v.packsData", packsData);
        }
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
        }else{
            var itemConfigList = component.find("item-configuration-change");
            var itemCountList = component.find("item-count-change");            
        }
        
        let selectedPersona = component.get("v.selectedPersona");
        var action = component.get("c.grantContent"); 
        var getInventoryMap = {};
        //Generating the data map 
        var dataMapArray = []; 
        var dataMap= {};
        dataMap["itemDefinitionId"] = itemArray[indexValue]["data"]["itemDefinitionId"];
        dataMap["quantity"] = itemCountList.get("v.value");
        if(itemConfigList.get("v.value") == "Untradable"){
            dataMap["untradable"] = "true";
            getInventoryMap["untradable"] = "true";
        }else{
            dataMap["untradable"] = "false";
            getInventoryMap["untradable"] = "false"; 
        }        
        dataMap["grantableType"] = itemConfigList.get("v.value");
        dataMap["grantableTypeValue"] = "";
        dataMapArray.push(dataMap);
        //generating the gamer id 
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        //generating other parameters 
        getInventoryMap["notes"] = "Testing TSM item integration";
        getInventoryMap["crmProductName"] = component.get("v.selectedProduct");
        getInventoryMap["gamerIdType"] = 'nucleusPersonaId';
        getInventoryMap["gamerId"] = gamerID; 
        getInventoryMap["data"] = JSON.stringify(dataMapArray);
        //Generating the data from the list 
        getInventoryMap["itemType"] = itemArray[indexValue]["data"]["itemCategory"];
        getInventoryMap["itemName"] = itemArray[indexValue]["data"]["name"];
        getInventoryMap["itemId"] = itemArray[indexValue]["data"]["itemDefinitionId"]; 
        getInventoryMap["platform"] = selectedPersona.object.platform; 
        getInventoryMap["tire"] = itemArray[indexValue]["data"]["level"];
        getInventoryMap["rating"] = itemArray[indexValue]["data"]["rating"];
        getInventoryMap["grantableType"] = itemConfigList.get("v.value"); //From the combo box
        getInventoryMap["grantableValue"];
        getInventoryMap["itemTypeValue"];
        getInventoryMap["quantity"] = itemCountList.get("v.value"); //From the combo value
        getInventoryMap["gameMode"] = itemArray[indexValue]["data"]["modeType"];
        getInventoryMap["grantType"] = itemArray[indexValue]["data"]["subject"]; 
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
        }else{
            var packsConfigList = component.find("pack-configuration-change");
            var packsCountList = component.find("pack-count-change");            
        }
        
        let selectedPersona = component.get("v.selectedPersona");
        var action = component.get("c.grantContent"); 
        var getInventoryMap = {};
        //Generating the data map 
        var dataMapArray = []; 
        var dataMap= {};
        dataMap["packDefinitionId"] = packsArray[indexValue]["data"]["packDefinitionId"];
        dataMap["quantity"] = packsCountList.get("v.value");
        if(packsConfigList.get("v.value") == "Untradable"){
            dataMap["untradable"] = "true";
            getInventoryMap["untradable"] = "true";
        }else{
            dataMap["untradable"] = "false";
            getInventoryMap["untradable"] = "false"; 
        } 
        dataMap["grantableType"] = packsConfigList.get("v.value"); //From the combo box
        dataMap["grantableTypeValue"] = "";
        
        dataMapArray.push(dataMap);
        //generating the gamer id 
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        //generating other parameters 
        getInventoryMap["notes"] = "Testing TSM packs integration";
        getInventoryMap["crmProductName"] = component.get("v.selectedProduct");
        getInventoryMap["gamerIdType"] = 'nucleusPersonaId';
        getInventoryMap["gamerId"] = gamerID; 
        getInventoryMap["data"] = JSON.stringify(dataMapArray);
        getInventoryMap["platform"] = selectedPersona.object.platform;
        
        //Generating the data from the list  
        getInventoryMap["packName"] = packsArray[indexValue]["data"]["name"];
        getInventoryMap["grantableType"] = packsConfigList.get("v.value"); //From the combo box
        getInventoryMap["grantableValue"];
        getInventoryMap["packId"] = packsArray[indexValue]["data"]["packDefinitionId"]; 
        getInventoryMap["quantity"] = packsCountList.get("v.value"); 
        getInventoryMap["packType"] = packsArray[indexValue]["data"]["packType"];
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
                }else{
                    this.publishResult(component, event);
                }                
            }
        });
        $A.enqueueAction(action);
    },
    //Publishing the data to the History Container
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
            var componentEvent = component.getEvent("onGrantPublish");
            componentEvent.setParam("type", "historyPublishDataFired");
            componentEvent.setParam("successData", component.get("v.successData"));
            componentEvent.setParam("failedData", component.get("v.failedData"));
            componentEvent.fire(); 
        });
        $A.enqueueAction(action);
    },
})