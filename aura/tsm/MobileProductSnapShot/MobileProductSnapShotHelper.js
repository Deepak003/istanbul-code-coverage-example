({
    // Fetch all MobileProducts
    getGamerIdTypesForMobileProduct:function(component,event,helper)
    {
        var action = component.get("c.getGamerIdTypesForMobileProduct"); 
        var productObj = component.get("v.product");
        var dataMap = {};
        dataMap["productId"] = productObj["Id"];
        action.setParams({
            "mapReqParams": dataMap
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = JSON.parse(response.getReturnValue()); 
                var mobileProducts = storeResponse.response;
                var finalMap = {};
                var mobileProdArray=[]
                for(var eachKey in mobileProducts){
                    var mobileProdMap={}; 
                    mobileProdMap["value"] = mobileProducts[eachKey].id;
                    mobileProdMap["label"] = mobileProducts[eachKey].name;
                    
                    mobileProdArray.push(mobileProdMap);
                    finalMap = mobileProdMap;
                }
                component.set("v.mobileProducstList",mobileProdArray); 
                component.set("v.mobileProducstMap",mobileProducts); 
                //component.set("v.isLoading", false);
            }
        });
        $A.enqueueAction(action);
    },
    getGamerAssociatedAccounts: function(component,event,helper,gamerId,selectedGamerIDType)
    {
        var action = component.get("c.getGamerAssociatedAccount"); 
        var productObj = component.get("v.product");
        var dataMap = {};
        var nucleusId = component.get("v.nucleusId"); 
        dataMap["gamerId"] = gamerId;
        dataMap["productId"] = productObj["Id"];
        console.log("dataMap "+dataMap);
        action.setParams({
            "mapReqParams": dataMap
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            var toastEvent = $A.get("e.force:showToast");
            if (state === "SUCCESS") {
               var storeResponse = JSON.parse(response.getReturnValue()); 
                var associatedGamerAccounts = storeResponse.response;
                if(associatedGamerAccounts.length > 0){
                    for(var i=0; i<associatedGamerAccounts.length; i++){
                        if(nucleusId == associatedGamerAccounts[i].nucleusId){
                            component.set("v.isIDLinked", true);
                            break;                            
                        }
                    }
                    component.set("v.associatedGamerResponse",associatedGamerAccounts); 
                    component.set("v.isAddMobileID",true);
                }                
                else{
                    this.addMobileID(component,event,helper);
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    validateMobileID:function(component,event,helper)
    {
        var action = component.get("c.getRootIdentities");
        var email = component.get("v.email");
        var productObj = component.get("v.product");
        
        var dataMap = {};
        dataMap["productName"] = productObj["Url_Name__c"];
        dataMap["email"] = email;
        console.log("dataMap "+dataMap);
        action.setParams({
            "mapReqParams": dataMap
        });    
        
        action.setCallback(this, function(response) 
        {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = JSON.parse(response.getReturnValue()); 
                var mobileProducts = storeResponse.response;
                var finalMap = {};
                var mobileProdArray=[]
                  for(var eachKey in mobileProducts){
                    var mobileProdMap={}; 
                    mobileProdMap["value"] = mobileProducts[eachKey]; //.gamerId + '('+mobileProducts[eachKey].name +')';
                    mobileProdMap["label"] = mobileProducts[eachKey].gamerId + '('+mobileProducts[eachKey].name +')';
                    mobileProdArray.push(mobileProdMap);
                    finalMap = mobileProdMap;
                }
                component.set("v.rootIdentities",mobileProdArray); 
                if(mobileProdArray.length > 0){
                    component.set("v.hasMobileIDForAccount",true);
                    component.set("v.defaultPersonaList", mobileProdArray[0].value);
                   this.handleAddMobileEvt(component,event,helper,mobileProducts[0].gamerId,mobileProducts[0].name);
                }else{
                    component.set("v.hasMobileIDForAccount",false);
                }
                    //component.set("v.mobileProducstMap",mobileProducts); 
               //component.set("v.isLoading", false);
            }
        });
        $A.enqueueAction(action);
    },
    addMobileID : function(component,event,helper) {
        var action = component.get("c.addMobileProduct"); 
        var gamerId = component.get("v.gamerId"); 
        var gamerIdType = component.get("v.gamerIdType"); 
        var caseId = component.get("v.caseId");
        var nucleusId = component.get("v.nucleusId"); 
        var accountId = component.get("v.accountId"); 
        var productObj = component.get("v.product");
        var email = component.get("v.email");
        var productName = component.get("v.productName"); 
        
        var dataMap = {};
        dataMap["gamerId"] = gamerId;
        dataMap["productId"] = productObj["Id"];
        dataMap["caseId"] = caseId;
        dataMap["customerId"] = nucleusId;
        dataMap["accountId"] = accountId;
        dataMap["gamerIdType"] = gamerIdType;
        dataMap["email"] = email;
        dataMap["productName"] = productName;
        console.log("dataMap "+dataMap);
        action.setParams({
            "mapReqParams": dataMap
        });
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            var toastEvent = $A.get("e.force:showToast");
            if (state === "SUCCESS") {
                var storeResponse = JSON.parse(response.getReturnValue()); 
                var associatedGamerAccounts = storeResponse.response;
                component.set("v.associatedGamerResponse",associatedGamerAccounts); 
                if(associatedGamerAccounts == null){
                    self.handleAddMobileEvt(component,event,helper,null,null);
                }
                else{
                        toastEvent.setParams({                   
                        "message": "The ID is linked successfully",
                        "type": "success"
                    });
                    var addMobileIDEvtDetails = component.getEvent("addMobileIDEvt");
                        addMobileIDEvtDetails.setParams({
                            "isMobileAdded" : true,
                            "isMobileAlreadyAdded" : false,
                            "isMobileProductAdded" : true
                        });
                   addMobileIDEvtDetails.fire();
               }                
            }
            else{
                    var errorMessage = response.getError();
                    toastEvent.setParams({                   
                    mode: 'dismissible',
                            "message": errorMessage[0].message, 
                            "type": "error"
                    });
            }
            toastEvent.fire();            
        });
        $A.enqueueAction(action);
    },
    handleAddMobileEvt : function(component,event,helper,gamerIdVal,gamerIdTypeVal){
        var action = component.get("c.getUserIdentities"); 
            var gamerId = component.get("v.gamerId"); 
            if(gamerId == null ||  gamerId == undefined){
                gamerId = gamerIdVal;
            }
            var gamerIdType = component.get("v.gamerIdType"); 
            if(gamerIdType == null ||  gamerIdType == undefined){
                gamerIdType = gamerIdTypeVal;
            }    
            var caseId = component.get("v.caseId");
            var nucleusId = component.get("v.nucleusId"); 
            var accountId = component.get("v.accountId"); 
            var productObj = component.get("v.product");
            var email = component.get("v.email");
            var productName = component.get("v.productName"); 
            
            var dataMap = {};
            dataMap["gamerId"] = gamerId;
            dataMap["productId"] = productObj["Id"];
            dataMap["caseId"] = caseId;
            dataMap["customerId"] = nucleusId;
            dataMap["accountId"] = accountId;
            dataMap["gamerIdType"] = gamerIdType;
            dataMap["email"] = email;
            dataMap["crmProductName"] = productName;
            console.log("dataMap "+dataMap);
            action.setParams({
                "mapReqParams": dataMap
            });
            var self = this;
            self.gamerIdTypeVal = gamerIdTypeVal;
            action.setCallback(self, $A.getCallback(function(response) {
                var state = response.getState();
                var toastEvent = $A.get("e.force:showToast");
                if (state === "SUCCESS") 
                {
                    var responseLength = JSON.stringify(response.getReturnValue()).length;
                    var storeResponse; var mobileProducts; var mobileProdArray=[]
                    if(responseLength > 2)
                    {
                        storeResponse = JSON.parse(response.getReturnValue()); 
                        mobileProducts = storeResponse.response.entities;
                        var gamerIdTypeName = component.get('v.gamerIdTypeName');
                        if(gamerIdTypeName == undefined){
                            gamerIdTypeName = gamerIdTypeVal;
                        }
                        console.log('gamerIdTypeVal >>>'+gamerIdTypeVal);
                        for(var eachKey in mobileProducts){
                            var mobileProdMap={}; 
                            mobileProdMap["value"] = mobileProducts[eachKey].id + '('+mobileProducts[eachKey].idType +')'+ ' - '+ gamerIdTypeName + ' - '+mobileProducts[eachKey].status;
                            mobileProdMap["label"] = mobileProducts[eachKey].id + '('+mobileProducts[eachKey].idType +')' + ' - '+ gamerIdTypeName + ' - '+  mobileProducts[eachKey].status;
                            mobileProdArray.push(mobileProdMap);
                        }
                        component.set("v.mobilePersonaList",mobileProdArray); 
                        component.set("v.defaultPersonaList", mobileProdArray[0].value);
                        component.set("v.hasMobileIdAdded",true); 
                        
                        
                        var showMobileIDEvtDetails = component.getEvent("showMobileIDEvt");
                         showMobileIDEvtDetails.setParams({
                            "isMobileProductAdded" : true,
                             "gamerIdType" : gamerIdTypeName,
                             "selectedUserIdentity":mobileProducts[0]
                        });
                        showMobileIDEvtDetails.fire();
                    }else{
                        component.set("v.hasMobileIdAdded",false); 
                         var errorMessage = 'Something went wrong in fetching User Identities, Please contact your IT';
                         toastEvent.setParams({                   
                            mode: 'dismissible',
                            "message": errorMessage,    
                            "type": "error"
                         });
                        toastEvent.fire();
                    }
                }else{
                    var errorMessage = response.getError();
                    toastEvent.setParams({                   
                        mode: 'dismissible',
                        "message": errorMessage[0].message, 
                        "type": "error"
                    });
                    toastEvent.fire();
                }
            }));
        $A.enqueueAction(action);
    },
    //Function used to init persona details
    initPersonaDetails : function (component, responseEntities) {
        var storeResponse = component.get("v.productSnapShotData");
        //Function used to generate the list for the persona
        var productName = component.get("v.product.Name");
        //var productNametoReplace = component.get("v.product.Name");
        //component.set("v.prodName", productNametoReplace.replace(/-/g, ' '));
        if(typeof storeResponse != "undefined" && storeResponse != "noData" && 
           (storeResponse.entities != undefined || storeResponse.gamePersonas != undefined)){
            //component.find("grant-items-menu").set("v.disabled", false);
            if(storeResponse.entities != undefined){
                component.set("v.isFIFA" , true);
                this.generatePersonList(component, storeResponse.entities[0]);
            }
            else if (storeResponse.gamePersonas != undefined){
                component.set("v.isFIFA" , false);
                this.generatePersonforOtherGameList(component, storeResponse);
            }
        }
        else{
            var personaOption={ 'value':'None','label':'None','name':'None'};
            var personaComboBox=[]
            personaComboBox.push(personaOption);
            component.set("v.personaList",personaOption);
            component.set("v.defaultPersonaList", personaOption.value);
            component.set("v.isGameMode",false);
            component.set("v.isFIFA",false);//need to chk if for no product response, should we display gamemode??
            //if yes, then except productname their is nothing to differentiate game types.
            /*
            var gameMode = {'label': 'None', 'value': 'None'};
            component.set("v.gameModeComboValue", gameMode);
            component.set("v.selectedGameMode","None");*/
           // component.find("grant-items-menu").set("v.disabled", true);
            this.firePersonaChange(component, event ,personaComboBox[0].value);
        }
    },
    //Function used to generate list from persona
    generatePersonList : function (component, responseEntities) {
        var personaList=[];
        var productName = component.get("v.product.Name");
        var clubList={};
        var personaComboBox=[];
        var gameMode;
        //Looping through the persona structure
        var personaEntity = responseEntities.subEntities;
        for(var eachPersonaEntitity in personaEntity){
            var personaOption={};
            //Building the combo box
            var personaName = personaEntity[eachPersonaEntitity].name;
            var platformName = personaEntity[eachPersonaEntitity].platform;
            var personaId = personaEntity[eachPersonaEntitity].id;
            var status = personaEntity[eachPersonaEntitity].status;
            personaOption['value'] = personaName + ' - '+platformName;
            personaOption ['label'] = personaName+' - '+ platformName +' - '+ status;
            personaOption ['name'] = personaEntity[eachPersonaEntitity];
            personaOption ['id'] = personaId;
            
            //loading the list
            personaComboBox.push(personaOption);
            personaList.push(personaName);
            
            //Looping through the clubs (sub-entity of persona)
            var clubEntity = personaEntity[eachPersonaEntitity].subEntities;              
            if(clubEntity.length > 0){
                clubList[personaOption['value']] = [];
                for(var eachClubEntity in clubEntity){
                    clubList[personaOption['value']].push(clubEntity[eachClubEntity]);
                }
            }   
        }        
        component.set("v.personaList",personaComboBox);
        //Setting the default value
        component.set("v.defaultPersonaList", personaComboBox[0].value);
        this.getGameModes(component,event,personaComboBox[0].name);
        //Initial fire
        this.firePersonaChange(component, event ,personaComboBox[0].value);
        component.set("v.clubList",clubList);
    },
    //Function used to generate list from persona
    generatePersonforOtherGameList : function (component, responseEntities) {
        var personaList=[];
        var productName = component.get("v.product.Name");
        var clubList={};
        var personaComboBox=[];
        var gameMode;
        component.set("v.isGameMode",false);
        //Looping through the persona structure
        var personaEntity = responseEntities.gamePersonas;
        for(var eachPersonaEntitity in personaEntity){
            var personaOption={};
            //Building the combo box
            var personaName = personaEntity[eachPersonaEntitity].personaName;
            var platformName = personaEntity[eachPersonaEntitity].platform;
            var personaId = personaEntity[eachPersonaEntitity].entitlementId;
            var status = personaEntity[eachPersonaEntitity].entitlementStatus;
            personaOption['value'] = personaName + ' - '+platformName;
            personaOption ['label'] = personaName+' - '+ platformName +' - '+ status;
            personaOption ['name'] = personaEntity[eachPersonaEntitity];
            personaOption ['id'] = personaId;
            
            //loading the list
            personaComboBox.push(personaOption);
            personaList.push(personaName);
            
            //Looping through the clubs (sub-entity of persona)
            var clubEntity = personaEntity;              
            if(clubEntity.length > 0){
                clubList[personaOption['value']] = [];
                for(var eachClubEntity in clubEntity){
                    clubList[personaOption['value']].push(clubEntity[eachClubEntity]);
                }
            }   
        }        
        component.set("v.personaList",personaComboBox);
        //Setting the default value
        component.set("v.defaultPersonaList", personaComboBox[0].value);
        //Initial fire
        this.firePersonaChange(component, event ,personaComboBox[0].value);
        component.set("v.clubList",clubList);
    },
    getGameModes : function(component, event, personaObject) {
        var gameModeArr = [];
        var gameModeJSON;
        var finalGameModes=[];
        if(personaObject.subEntities != undefined){
            for(var i=0; i<personaObject.subEntities.length;i++) {
                if(gameModeArr.indexOf(personaObject.subEntities[i].idType) == -1)
                    gameModeArr.push(personaObject.subEntities[i].idType);
            }
            for(var j=0; j<gameModeArr.length; j++){
                if(gameModeArr[j]=='FUTClub')
                    gameModeJSON = {'label': 'FUT', 'value': 'FUTClub'};
                if(gameModeArr[j]=='WCClub')
                    gameModeJSON = {'label': 'WC', 'value': 'WCClub'};
               finalGameModes.push(gameModeJSON); 
            }
            console.log(finalGameModes);
            component.set("v.gameModeComboValue", finalGameModes);
            component.set("v.isGameMode",true);
            if(finalGameModes.length > 0){
                component.set("v.selectedGameMode",finalGameModes[0].value);
            }
            else{
                component.set("v.gameModeComboValue", {'label': 'None', 'value': 'None'});
                component.set("v.selectedGameMode",'None');
            }
        }
    },
    
    //Function used to fire personaChange
    firePersonaChange : function (component, event, currentSelection) {
        var productSnapshotEvent = $A.get("e.c:ProductSnapShotAction");
        var personaComboBox = component.get("v.personaList");  
        var personaObject, gameMode;
        var gameModeVisible = component.get("v.isGameMode"); 
        var productName = component.get("v.product.Name");
        //Getting the current value
        for(var eachPersona in personaComboBox){
            if(personaComboBox[eachPersona].value == currentSelection){
                personaObject = personaComboBox[eachPersona].name;
            }
        }
        //Finding the game mode status need to add condition for FIFA and generic
        if(gameModeVisible && typeof component.find("gameModeCombo") != "undefined" && !component.get("v.isFIFA")){
            gameMode = component.find("gameModeCombo").get("v.value");
        }
        else{
            //if(productName.toLowerCase().search("fifa") >= 0){
            if(component.get("v.isFIFA")){
                 //gameMode = "FUTClub";
                gameMode=component.get("v.selectedGameMode");
            }
        }
        //getplatformstatus(component, event, personaObject);
        productSnapshotEvent.setParams({ "type" : 'personaChange' });
        productSnapshotEvent.setParams({ "changedPersona" : {
            object: personaObject, 
            gameMode : gameMode
        } });
        productSnapshotEvent.setParams({"caseId": component.get('v.caseId')});
        //TODO: (from SIba) : ClubsTracker needs personaId in ProductSnapshotAction
        productSnapshotEvent.fire();
    },
     modifySnapshotUI : function(component) {
        //Checking the change event for Config UI
        component.set("v.isModesExist", false);
        //Checking the response
        if(component.get("v.configUIData") !=null){
            var tabObject = component.get("v.configUIData").tabs;
            for (var eachtab in tabObject){
                if(tabObject[eachtab].name == "Product Snapshot"){
                    var configUIObject = tabObject[eachtab].sections;
                    for (var eachObject in configUIObject){
                        if(configUIObject[eachObject].name == "Modes"){
                          component.set("v.isModesExist", true);
                        }
                    }
                }
            }
           // component.set('v.gameModeCombo', gameModeCombo);
            console.log(configUIObject);
        }
    },
})