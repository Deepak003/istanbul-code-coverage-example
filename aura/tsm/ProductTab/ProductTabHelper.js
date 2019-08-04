({
    //Master funciton to handle the persona loading for all games
    getPersonaDetails : function(component, event, helper) {
        var isMobileGame = component.get("v.selectedProduct.isMobile__c");      
        //Divide and conquer for the mobile and HD games
        if(isMobileGame){
            const customerMobileProducts = component.get("v.customerOwnedMobileProduct");
            //Re-Setting the mobilesnapshot data
            this.getAllCustomerMobileProducts(component, event, helper)           
        }else{
            const customerHdProducts = JSON.parse(component.get('v.customerProduct')).response;
            //Re-Setting the hdProductSnapShotData  
            component.set("v.isMobileProductAttached", true); //Need to chcange the logic
            //Checking if the product has been attached to the customer in SF
            if(this.isCustomerOtherProduct(component,event,customerHdProducts)){
                helper.getGamePersonaDetails(component, event, helper); //Getting the gamesID Types
            }else{
                //Error handling for games not owned by player
                if(component.get("v.productSnapShotData") == "noData"){
                    component.set("v.productSnapShotData", "undefined");
                }else{
                    component.set("v.productSnapShotData", "noData");
                } 
            }
            
        } 
    },
    //Function to check if the customer has a mobile game attached in SF
    isCustomerOtherProduct: function(component,event,customerOtherProducts){
        var returnValue = false;
        for(var eachCustomerOtherProducts in customerOtherProducts){
            if(customerOtherProducts[eachCustomerOtherProducts].name == component.get("v.selectedProduct.Url_Name__c")){
                returnValue = true;
            }
        }
        return returnValue
    },
    //Function to get all the mobile games owmed by the customer
    getAllCustomerMobileProducts: function(component, event, helper){
        var action = component.get("c.getAllMobileProducts");  
        action.setParams({
            customerEmail : component.get("v.email")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue(); 
                //Checking if the product has been attached to the customer in SF
                if(this.isCustomerOtherProduct(component,event,storeResponse)){
                    component.set("v.isMobileProductAttached", true);
                    helper.getRootIdentityDetails(component, event, helper); //Calling root identity if attached
                }else{
                    component.set("v.isMobileProductAttached", false); //Turing the flag off to open the ADD game window
                    var errorMessage = {};
                    errorMessage['header'] = "No information on this product.";
                    errorMessage['body'] = "Add an identity to get user information. Looking for another product?";
                    errorMessage['isOwned'] = true;
                    component.set("v.errorMessage", errorMessage);
                    component.set("v.isError", true);
                    component.set('v.isLoading', false);
                } 
            }
        });
        $A.enqueueAction(action);        
    },
    //Getting the root identities for the attached products - Starting point for all the mobile products
    getRootIdentityDetails:function(component,event,helper){
        var action = component.get("c.getRootIdentities");
        var email = component.get("v.email");
        var productObj = component.get("v.selectedProduct.Url_Name__c");
        
        var dataMap = {};
        dataMap["productName"] = productObj;
        dataMap["email"] = email;
        action.setParams({
            "mapReqParams": dataMap
        });    
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = JSON.parse(response.getReturnValue()); 
                var rootIdentityValue = storeResponse.response;
                //Storing the root identity
                component.set("v.productSnapShotData", rootIdentityValue); 
            }
        });
        $A.enqueueAction(action);
    },
    //Function to get the persona details
    getGamePersonaDetails : function(component, event, helper) {
        var nucleusId = component.get("v.nucleusId");
        var productName = component.get("v.selectedProduct.Url_Name__c");
        component.set("v.productName",productName);
        var platfromName = component.get ("v.selectedPlatform.Name");
        var categoryName = component.get ("v.selectedCategory.Name");
        var studio = component.get ("v.selectedProduct.studio");
        var action = component.get("c.getGamePersonas");
        action.setParams({
            customerNucleusId : nucleusId,
            productName : productName,
            platform : platfromName,
            studio:studio
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse;
                if(response.getReturnValue() != null){
                    storeResponse = response.getReturnValue().response;
                    //Stroring the response of productsnapshot
                    if(storeResponse != undefined){
                        if(storeResponse.entities != undefined && storeResponse.gamePersonas == undefined){
                            component.set("v.productSnapShotData", storeResponse); 
                        }else if(storeResponse.entities == undefined && storeResponse.gamePersonas != undefined){
                            helper.getGamerIdentityTypes(component, event, storeResponse); //Getting the gamesID Types 
                        }else{
                            if(component.get("v.productSnapShotData") == "noData"){
                                component.set("v.productSnapShotData", "undefined");
                            }else{
                                component.set("v.productSnapShotData", "noData");
                            }   
                        }
                    }else{
                        if(component.get("v.productSnapShotData") == "noData"){
                            component.set("v.productSnapShotData", "undefined");
                        }else{
                            component.set("v.productSnapShotData", "noData");
                        }                       
                    }
                }else{
                    if(component.get("v.productSnapShotData") == "noData"){
                        component.set("v.productSnapShotData", "undefined");
                    }else{
                        component.set("v.productSnapShotData", "noData");
                    } 
                }
            }else{
                if(component.get("v.productSnapShotData") == "noData"){
                    component.set("v.productSnapShotData", "undefined");
                }else{
                    component.set("v.productSnapShotData", "noData");
                } 
            }
        });
        $A.enqueueAction(action);
    },
    
    //Finding the gamer ID types for HD games
    getGamerIdentityTypes: function(component, event, productSnapShotData){
        var action = component.get("c.getGamerIdentityTypes");  
        action.setParams({
            productName : component.get("v.selectedProduct.Url_Name__c")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                //Adding gamerID fro each persona for non indentity games
                for(var eachPersona in productSnapShotData.gamePersonas){
                    productSnapShotData.gamePersonas[eachPersona].idType = storeResponse;
                }
                component.set("v.productSnapShotData", productSnapShotData);
            }else{
                component.set("v.productSnapShotData", productSnapShotData); 
            }
        });
        $A.enqueueAction(action);        
    },
    
    //Function to get the Game stats data
    getGameStats : function(component) {       
        var action = component.get("c.getGameStats"); 
        var selectedPersona = component.get('v.selectedPersonaId'); 
        var customerId = component.get('v.nucleusId');
        var productName = component.get('v.selectedProduct');
        var platform = selectedPersona.object.platform;
        let gamerId = selectedPersona.object.id;
        if(gamerId == undefined)
            gamerId = selectedPersona.object.uid;
        var gameMode = '';
        if(productName.Url_Name__c != undefined && productName.Url_Name__c.toLowerCase().search("fifa") >= 0){
            if(selectedPersona.gameMode == "WCClub"){
                gameMode = "WC";
            }else{
                gameMode = "FUT";
            }
            //platform = platform.Name;
        }
        else{
            platform = selectedPersona.object.platform;
        }
        //Setting game mode
        component.set("v.gameMode",gameMode);
        action.setParams({
            customerId : customerId,
            productName : productName.Url_Name__c,
            platform : platform,
            gamerId : gamerId,
            gameMode : gameMode,
            gamerType : selectedPersona.object.idType
        });
        action.setCallback(this, function(response) {
            component.set("v.gameStatsData",'');
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                component.set("v.gameStatsData", storeResponse);
            }
        });
        $A.enqueueAction(action);
    },
    //To get the Currency data
    getInventoryStats : function(component, event, helper, isReload) {
        let selectedPersona = component.get("v.selectedPersonaId");
        var action = component.get("c.getWallets"); 
        var getInventoryMap = {};
        let gamerID = selectedPersona.object.id;
        if(gamerID == undefined)
            gamerID = selectedPersona.object.uid;
        getInventoryMap["gamerId"] = gamerID;
        getInventoryMap["productName"] = component.get("v.selectedProduct").Url_Name__c;
        getInventoryMap["customerId"] = component.get("v.nucleusId");
        getInventoryMap["platform"] = selectedPersona.object.platform;
        getInventoryMap["gamerIdType"] = component.get("v.selectedPersonaId").object.idType;
        action.setParams({
            requestParams : getInventoryMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            //Turning off the flag in case of reload else it will be turned off in config ui
            if(isReload){
                component.set("v.isLoading", false);
            }
            
            if (state === "SUCCESS" && response.getReturnValue().status === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                if(storeResponse.response.wallets !== undefined)
                    component.set("v.inventoryStats", storeResponse.response.wallets);
                else{
                    component.set("v.inventoryStats", null);
                }
            }
            else{
                component.set("v.inventoryStats", null);
            };
            if(component.get("v.inventoryUpdated"))
                component.set("v.inventoryUpdated", false);
            else
                component.set("v.inventoryUpdated", true);
        });
        $A.enqueueAction(action);
    },   
    //Function used ot get the GI config data from backend
    getGameIntegrationConfig : function(component, event) {
        var action = component.get("c.getMobileGameIntegrationConfig"); 
        var selectedPersona = component.get('v.selectedPersonaId');  
        var getConfigMap = {}; 
        //Need to debug the logic for the change        
        if(component.get("v.selectedPersonaId").object.idType != undefined){
            if(component.get("v.selectedProduct").Url_Name__c.search('fifa') < 0){
                getConfigMap["gamerIdType"] = component.get("v.selectedPersonaId").object.idType;
            }else{
                getConfigMap["gamerIdType"] = 'nucleusUserId';
            }
        }                  
        getConfigMap["crmProductName "] = component.get("v.selectedProduct").Url_Name__c;
        getConfigMap["customerId"] = component.get("v.nucleusId");
        getConfigMap["productId"] = component.get("v.selectedProduct").Url_Name__c;
        action.setParams({
            requestParams : getConfigMap
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                component.set("v.configUIData", storeResponse);
            }else{
                component.set("v.configUIData", null);
            }
        });
        $A.enqueueAction(action);
    }, 
    //Function used to modify the product tab UI as per the config UI
    modifyProductTabUI : function(component) {
        //Checking the change event for Config UI
        component.set("v.isHistoryExist", false);
        component.set("v.isCurrentInventoryExist", false);
        component.set("v.isAdditionalInfoExist", false);
        
        //Checking the response
        if(component.get("v.configUIData") !=null){
            component.set("v.isHistoryAvailable", true);
            var tabObject = component.get("v.configUIData").tabs;
            for (var eachtab in tabObject){
                if(tabObject[eachtab].name == "Additional Info"){
                    component.set("v.isAdditionalInfoExist", true);
                }
                if(tabObject[eachtab].name == "History"){
                    component.set("v.isHistoryExist", true);
                }
                if(tabObject[eachtab].name == "Current Inventory"){
                    component.set("v.isCurrentInventoryExist", true);
                }
            }
        }        
    },
    
    //Function to get the generic permission mapping - TSM-2910, TSM-2911, TSM-2912
    getGenericProductPermission:function(component) {
        var action = component.get("c.getGenericJobRolePermissions"); 
        var inputParams = {};
        inputParams["crmProductName"] = component.get("v.selectedProduct").Url_Name__c
        action.setParams({
            inputParams : inputParams
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();   
                component.set("v.genericConfigurationData", storeResponse);
            }else{
                component.set("v.genericConfigurationData", {});
            }
        });
        $A.enqueueAction(action);
    },
    
    //Funciton used the get the masking data for account tab - TSM-2577
    getDataMaskConfigurations : function(component, event) {
        var action = component.get("c.getDataMaskConfigurations");  
        action.setParams({
            strCompName : 'Product'
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();     
                this.convertDataToMap(component, storeResponse);
            }else{
                component.set("v.productMaskingData", {});
                component.set("v.isProductMakingLoaded", false);
            }
        });
        $A.enqueueAction(action);       
    },
    
    //Function used to conver the list to map - TSM-2577
    convertDataToMap: function(component, arrayList) {
        //generating the component map
        var resultantMap = arrayList.reduce(function(map, obj) {
            //generating the action map
            var actionMap = obj.configurationsList.reduce(function(actionMap, actionObj) {
                //assigning the action map
                if(component.get("v.hideAccountData") == true){
                    actionMap[actionObj.strAction] = actionObj.verified;                    
                }else if(component.get("v.hideAccountData") == false){
                    actionMap[actionObj.strAction] = actionObj.unVerified;  
                }else if(component.get("v.hideAccountData") == 'default'){
                    actionMap[actionObj.strAction] = actionObj.defaultValue; 
                }
                return actionMap;
            },{});
            //assigning the component map
            map[obj.strcomponentName] = actionMap;
            return map;
        }, {});       
        component.set("v.productMaskingData", resultantMap);
        component.set("v.isProductMakingLoaded", true);//Setting true for the component to load        
    },
    //Function used to get the banned franchise
    getBannedFranchiseDetails: function(component,event,helper){        
        var action = component.get("c.getAttachedStatuses");
        action.setParams({
            customerNucleusId: component.get("v.nucleusId")
        });
        action.setCallback(this,function(response){
            if(response.getReturnValue()!=null){
                var attachedStatusJson = JSON.parse(response.getReturnValue());
                if(attachedStatusJson!=null&&attachedStatusJson.response.length>0){
                    component.set("v.franchiseBanData",response.getReturnValue()); 
                }
            }
        });
        $A.enqueueAction(action);
    },     
})