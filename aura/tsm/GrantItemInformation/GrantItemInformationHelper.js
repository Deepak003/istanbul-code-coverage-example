({
    getGrantCategories : function(component, event, typeSelected) {
        component.set("v.isLoading", true); 
        var action = component.get("c.getGameMetaData"); 
        var selectedPersona = component.get("v.selectedPersona");
        var grantCategoryComboBox = component.find('grant-category-change');
        //Generation the request
        var requestMap = {};
        requestMap["datatype"] = typeSelected;
        requestMap["crmProductName"] = component.get("v.selectedProduct");
        requestMap["userId"] = component.get("v.nucleusId");
        requestMap["platform"] = selectedPersona.object.platform;
        action.setParams({
            requestParams : requestMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.isLoading", false);
                var storeResponse = response.getReturnValue().response.values;
                //Preventing the loop with a replace JS function
                var responseStringified = JSON.stringify(storeResponse).replace(/value/g, "label");
                responseStringified = responseStringified.replace(/key/g, "value");
                component.set("v.selectedCategorylist",JSON.parse(responseStringified));
                //Enabling and disabling the combo box
                if(grantCategoryComboBox.get('v.disabled')){
                    grantCategoryComboBox.set('v.disabled', false);
                }
                //TSM-1953
                component.find("grant-category-change").set("v.value", "");
                component.set("v.showDataTable", false)
            }
        });
        $A.enqueueAction(action);
    },
    getItems : function(component, event, helper, itemCategory) {
        component.set("v.isLoading", true);
        component.set("v.showDataTable", true);  
        let selectedPersona = component.get("v.selectedPersona");
        var action = component.get("c.getGrantableItems"); 
        var getInventoryMap = {};
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        getInventoryMap["customerId"] = component.get("v.nucleusId");
        getInventoryMap["userId"] = component.get("v.nucleusId");
        getInventoryMap["crmProductName"] = component.get("v.selectedProduct");
        
        if(component.get("v.selectedPersona").object.idType != undefined){
            getInventoryMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
        }
        
        getInventoryMap["gamerId"] = gamerID;
        getInventoryMap["grantable"] = "true";
        getInventoryMap["platform"] = selectedPersona.object.platform;
        getInventoryMap["itemCategory"] = itemCategory;
        
        //Will be replaced by config UI once Murali adds the data ins ections
        if(component.get("v.selectedProduct").search("fifa-18") >= 0){
            if(selectedPersona.gameMode == "WCClub"){
                getInventoryMap["gameMode"] = "WC";
            }else{
                getInventoryMap["gameMode"] = "FUT";
            }
        }
        
        console.log(getInventoryMap);
        action.setParams({
            requestParams : getInventoryMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.isLoading", false);
            if (state === "SUCCESS") {
                var responseObject = response.getReturnValue().response;
                //Switching the toggle
                if(responseObject != null){
                    if(responseObject.empty != true){
                        //Replacing the data as per the design documentations
                        var stringResponse = JSON.stringify(responseObject).replace(/itemDefinitionId/g, "id");
                        stringResponse = stringResponse.replace(/itemCategory/g, "category");
                        //stringResponse = stringResponse.replace(/description=''/g, "description='Unavailable'");
                        
                        var items = [];
                        items = JSON.parse(stringResponse).items;
                        for(var i = 0; i<items.length; i++){
                            if(window.permissionsList){
                                if((items[i].grantable == false) && (!window.permissionsList.includes('grant restricted item'))){
                                   items.splice(i, 1);
                                }
                            }
                        }
                        component.set("v.itemData", items);
                        this.populateGridData(component, event, items);
                    }else{
                        component.set("v.itemData", []);
                        this.populateGridData(component, event, []);
                    }
                }
                else{
                    component.set("v.itemData", []);
                    this.populateGridData(component, event, []);                    
                }
            }else{
                component.set("v.itemData", []);
                this.populateGridData(component, event, []);                    
            }
        });
        $A.enqueueAction(action);
    },
    getPacks : function(component, event, helper, packCategory) {
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
        
        if(component.get("v.selectedPersona").object.idType != undefined ){             
            getInventoryMap["gamerIdType"] = component.get("v.selectedPersona").object.idType;
        }
        
        getInventoryMap["gamerId"] = gamerID;
        getInventoryMap["platform"] = selectedPersona.object.platform;
        getInventoryMap["packType"] = packCategory;  
        getInventoryMap["grantable"] = "packs";
        
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
                if(responseObject != null){
                    if(responseObject.empty != true){
                        //Replacing the data as per the design documentations
                        var stringResponse = JSON.stringify(responseObject).replace(/packDefinitionId/g, "id");
                        stringResponse = stringResponse.replace(/packType/g, "category");
                        //stringResponse = stringResponse.replace(/description=''/g, "description='Unavailable'");
                        
                        var packs=[];
                        packs = JSON.parse(stringResponse).packs;
                        for(var i = 0; i<packs.length; i++){
                            if(window.permissionsList){
                                if((packs[i].grantable == false) && (!window.permissionsList.includes('grant restricted pack'))){
                                   packs.splice(i,1);
                                }
                            }
                        }
                        component.set("v.packsData", packs);
                        this.populateGridData(component, event, packs);
                    }else{
                        component.set("v.packsData", []);
                        this.populateGridData(component, event, []);
                    }                    
                }
                else{
                    component.set("v.packsData", []);
                    this.populateGridData(component, event, []);
                }
            }else{
                component.set("v.packsData", []);
                this.populateGridData(component, event, []);
            }
        });
        $A.enqueueAction(action);
    },
    loadCurrenctList: function (component, event) {
        component.set("v.isLoading", true);
        component.set("v.showDataTable", true); 
        var selectedProduct = component.get("v.selectedProduct");
        let selectedPersona = component.get("v.selectedPersona");
        var action = component.get("c.getWallets"); 
        var getInventoryMap = {};
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        getInventoryMap["gamerId"] = gamerID;
        getInventoryMap["productName"] = component.get("v.selectedProduct");
        getInventoryMap["customerId"] = component.get("v.nucleusId");
        getInventoryMap["platform"] = selectedPersona.object.platform;
        getInventoryMap["gamerIdType"] = selectedPersona.object.idType;
        action.setParams({
            requestParams : getInventoryMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS" && response.getReturnValue().status === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                if(storeResponse.response.wallets !== undefined){
                    var stringResponse = JSON.stringify(storeResponse.response.wallets).replace(/walletId/g, "id");
                    stringResponse = stringResponse.replace(/type/g, "category");
                    var currencyList = [];
                    currencyList = JSON.parse(stringResponse);
                    var hasModifyDraftTokenPermission = component.get('v.hasModifyDraftTokenPermission');
                    var updatedCurrencyList = [];
                    for(var i = 0; i<currencyList.length; i++){
                        if(currencyList[i].name == 'DRAFT_TOKEN' && selectedProduct.includes('fifa'))                        {
                            if(hasModifyDraftTokenPermission){
                                updatedCurrencyList.push(currencyList[i]);
                            }
                        }
                        else{
                            updatedCurrencyList.push(currencyList[i]);
                        }                        
                    } 
                    this.populateGridData(component, event, updatedCurrencyList);
                    //this.loadCurrenctReasons(component, event, JSON.parse(stringResponse));
                }    
                else{
                    component.set("v.inventoryStats", []);
                    this.populateGridData(component, event, []);
                }
            }
            else{
                component.set("v.inventoryStats", []);
                this.populateGridData(component, event, []);
            };
            component.set("v.isLoading", false);
        });
        $A.enqueueAction(action);
    },
    //Function to populate the grid data
    populateGridData : function(component, event, data) {
        var grantSearch = component.find("grant-content-search");
        if(data.length > 0){
            component.set('v.data', data); //Setting the data to global variable
            this.processPageNation(component, event, data, 0);
            if(component.get("v.pageNumber") == 1){
                this.populatePageNationList(component, event, data, 0, 20); //populating the grid if the page remains the same
            }else{
                component.set("v.pageNumber", 1); //This will call the change event to trigger the first page load
            }
        }else{
            //TSM-1954
            grantSearch.set("v.disabled",true);
            component.set('v.isDataNull', true);
            component.set('v.errorMessage', "No result found");
        }
    },
    //Function to populate the pagenation
    processPageNation : function(component, event, data, index) {
        //Adding the data and loadData
        if(data.length/20 > 1){
            var pageNationList = (data.length/20);
            var pageNationArray = Array.apply(null, {length: pageNationList}).map(Number.call, Number);
            component.set('v.pageList', pageNationArray);
        }else{
            component.set('v.pageList', []);
        }
    },
    
    populatePageNationList: function(component, event, data, startIndex, endIndex){
        var grantSearch = component.find("grant-content-search");
        //Loop to slice the array
        if(data.length/20 > 1){
            component.set('v.loadData', data.slice(startIndex,endIndex)); 
        }else{
            component.set('v.loadData', data); 
        }            
        component.set("v.isSearchData", false);
        component.set('v.isDataNull', false);
        //TSM-1954
        grantSearch.set("v.disabled",false);           
    },
    
    //Adding validation to check special characters
    isValidString: function (currentString){
        if (currentString.search(/[\[\]?*+|{}\\()@\n\r]/) != -1) {
            return false;
        }else{
            return true;
        }
    },
    //Function to add selected row to shopping cart
    addSelectedRow: function(component, event, selectedRow){
        //Gettign necessary parameter for global map
        var globalMap  = component.get("v.globalSelectionMap");  
        var grantTypeComboValue = component.find("grant-type-change").get("v.value");
        var categoryComboValue = component.find("grant-category-change").get("v.value").toLowerCase();
        
        //Initilizing the global map if null
        if(globalMap == null){
            var globalMap = {};
            globalMap["ITEM_DEF_CATEGORY"] = {};
            globalMap["PACK_DEF_TYPE"] = {};
            globalMap["Currency"] = [];
            component.set('v.globalSelectionMap', globalMap);
        }
        //Handeling for Items and Packs
        if(grantTypeComboValue != "Currency"){
            //Handeling of the shoppping cart has data for this particular category
            if(globalMap[grantTypeComboValue][categoryComboValue] != null){
                globalMap[grantTypeComboValue][categoryComboValue] = globalMap[grantTypeComboValue][categoryComboValue].concat(selectedRow); //Appending the first array
            }else{
                globalMap[grantTypeComboValue][categoryComboValue] = []; //If null (First time initilizing the array)
                globalMap[grantTypeComboValue][categoryComboValue] = globalMap[grantTypeComboValue][categoryComboValue].concat(selectedRow); //Appending the first array
            }
        }else{
            //Handeling for Currency
            globalMap["Currency"] = globalMap["Currency"].concat(selectedRow);
            //globalMap["Currency"] = this.removeDuplicates(globalMap["Currency"], "id"); //Removing duplicates if any
        }
        component.set('v.globalSelectionMap', globalMap);
        //Updating the shopping cart with the new values
        this.updateFilterValue(component, event);        
    },
    //Function to add selected row to shopping cart
    removeSelectedRow: function(component, event, selectedRow){       
        //Loading of the grid exists
        var globalMap  = component.get("v.globalSelectionMap");
        var categoryComboValue = component.find("grant-category-change").get("v.value").toLowerCase();
        var grantTypeComboValue = component.find("grant-type-change").get("v.value");
        
        //Handeling for Items and Packs
        if(grantTypeComboValue != "Currency"){
            //Handeling of the shoppping cart has data for this particular category
            if(globalMap[grantTypeComboValue][categoryComboValue] != null){
                //Removing from the global map
                globalMap[grantTypeComboValue][categoryComboValue] = this.removeSelectedElement(globalMap[grantTypeComboValue][categoryComboValue], selectedRow.id);
            }
        }else{
            //Handeling removal for Currency
            globalMap["Currency"] = this.removeSelectedElement(globalMap["Currency"], selectedRow.id);
        }        
        
        //Setting the global map
        component.set("v.globalSelectionMap", globalMap);  
        //Updating the shopping cart with the new values
        this.updateFilterValue(component, event); 
    },
    updateFilterValue: function (component, event) {
        //Setting the data to the display
        var filterArray = [];
        var globalMap  = component.get("v.globalSelectionMap");
        var itemKeyList = Object.keys(globalMap["ITEM_DEF_CATEGORY"]);
        var packKeyList = Object.keys(globalMap["PACK_DEF_TYPE"]);  
        
        //Displaying all the filter values
        for(var eachFilter in itemKeyList){
            if(globalMap["ITEM_DEF_CATEGORY"][itemKeyList[eachFilter]] != null){
                filterArray = filterArray.concat(globalMap["ITEM_DEF_CATEGORY"][itemKeyList[eachFilter]]);
            }
        } 
        
        for (var eachFilter in packKeyList){
            if(globalMap["PACK_DEF_TYPE"][packKeyList[eachFilter]] != null){
                filterArray = filterArray.concat(globalMap["PACK_DEF_TYPE"][packKeyList[eachFilter]]);
            } 
        }
        
        if(globalMap["Currency"].length > 0){
            filterArray = filterArray.concat(globalMap["Currency"]);
        }
        
        //Setting the filter value for the display
        component.set('v.allFilterData', filterArray);
        
        if(filterArray.length >0){
            component.set('v.showFilterCart', true); 
        }else{
            component.set('v.showFilterCart', false); 
        }
    },
    //Function to remove selected element
    removeSelectedElement: function (myArr, prop) {
        const result = myArr.filter(myArr => myArr.id != prop);
        return result;
    },
    //Function used to per-load the data
    preloadData: function(component, event) {
        //Pre loading of the back button is pressed        
        var globalMap  = component.get("v.globalSelectionMap");  
        //Getting the current selection
        if(globalMap != null){
            var grantTypeComboValue = component.find("grant-type-change").get("v.value");
            var categoryComboValue = component.find("grant-category-change").get("v.value").toLowerCase();
            if(grantTypeComboValue != "Currency"){
                if(globalMap[grantTypeComboValue] != null){
                    if(globalMap[grantTypeComboValue][categoryComboValue] != null){
                        for(var eachRow in globalMap[grantTypeComboValue][categoryComboValue]){
                            var currentId =  globalMap[grantTypeComboValue][categoryComboValue][eachRow].id; //Getting the index since aura:id cannot be dynamic
                            var selectBox = component.find("selectBox"); //Getting the array
                            //finding the current check box
                            for (var eachValue in selectBox){
                                if(selectBox[eachValue].get("v.title") == currentId){
                                    selectBox[eachValue].set("v.checked", true);
                                }
                            }
                        }
                    }
                }
            }else{
                for(var eachRow in globalMap["Currency"]){
                    var currentId =  globalMap["Currency"][eachRow].id;
                    var selectBox = component.find("selectBox"); //Getting the array
                    //finding the current check box
                    for (var eachValue in selectBox){
                        if(selectBox[eachValue].get("v.title") == currentId){
                            selectBox[eachValue].set("v.checked", true);
                        }
                    }
                }          
            }
        }
    },
    //Function to uncheck load data from grid
    removeLoadData: function(component, event, selectedFilterValue) {
        var selectComboBox = component.find("selectBox");
        for(var eachValue in selectComboBox){
            if(selectComboBox[eachValue].get("v.title") == selectedFilterValue.id){
                selectComboBox[eachValue].set("v.checked", false);
            } 
        }
    },
    //Funciton to populate load from search data
    populateSearchData: function(component, event, data) {
        //Adding the data and loadData
        if(data.length/20 > 1){
            var pageNationList = (data.length/20);
            var pageNationArray = Array.apply(null, {length: pageNationList}).map(Number.call, Number);
            component.set('v.pageList', pageNationArray);
            component.set('v.loadData', data.slice(0,20)); 
            component.set("v.pageNumber", 1);
        }else{
            component.set('v.pageList', []);
            component.set('v.loadData', data); 
        }                
        component.set("v.isSearchData", false);
        component.set('v.isDataNull', false);
    },

     populateContentTypes: function(component, event){
        //set content types based on Jobrole
        var contentTypes = [];
        var selectedProduct = component.get("v.selectedProduct");
        if(window.permissionsList){           
            if(window.permissionsList.includes('grant item')){
                contentTypes.push({label: 'Items', value: 'ITEM_DEF_CATEGORY'});
            }
            if(window.permissionsList.includes('grant pack')){
                contentTypes.push({label: 'Packs', value: 'PACK_DEF_TYPE'});
            }
            if(window.permissionsList.includes('grant currency to wallet')){
                contentTypes.push({label: 'Currency', value: 'Currency'});
            }
            if(selectedProduct.includes('fifa') && window.permissionsList.includes('add or remove fifa draft token')){
                 component.set('v.hasModifyDraftTokenPermission', true);
            }
        }
        //remove content types (Items/packs) based on Config UI
        if(contentTypes.length > 0){                    
            if(component.get("v.configUIData") !=null){
                var tabObject = component.get("v.configUIData").tabs;
                for (var eachtab in tabObject){
                    if(tabObject[eachtab].name == "Current Inventory"){
                        var sectionsObject = tabObject[eachtab].sections;
                        for (var eachSection in sectionsObject){
                            if(sectionsObject[eachSection].name == "Containers Grant"){                            
                                var actionsObject = sectionsObject[eachSection].actions;
                                for (var eachAction in actionsObject){
                                    if(actionsObject[eachAction].name.includes("Items")){
                                       contentTypes = contentTypes.filter(item => item.label != "Items");
                                    }
                                    if(actionsObject[eachAction].name.includes("Packs")){
                                        contentTypes = contentTypes.filter(item => item.label != "Packs");
                                    }
                                    if(actionsObject[eachAction].name.includes("Currency")){
                                        contentTypes = contentTypes.filter(item => item.label != "Currency");
                                    }
                                }
                            }                        
                        }
                    }
                }
            }            
        }        
        component.set('v.contentTypes', contentTypes);
    },
})