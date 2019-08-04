({
    //Function used to init persona details for both mobile and HD
    initPersonaDetails : function (component, event, helper) {
        if(component.get("v.product.isMobile__c")){
            this.initMobilePersonaDetails(component, event, helper);
        }else{
            this.initHDPersonaDetails(component, event, helper);
        }   
    },
    //Function used to init persona details for HD games
    initHDPersonaDetails : function (component, event, helper) {
        var storeResponse = component.get("v.productSnapShotData");
        component.set("v.isGameMode",false); //Setting game mode to false for all the games initially
        //Function used to generate the list for the persona
        if(typeof storeResponse != "undefined" && storeResponse != "noData" && 
           (storeResponse.entities != undefined || storeResponse.gamePersonas != undefined)){
            
            //Enable and disable grant in drop down logic
            component.set("v.grantDisable", false); //TSM-2570

            if(storeResponse.entities != undefined){
                this.generatePersonList(component, event, storeResponse.entities[0].subEntities, true); //Function to parse the data for response from Identity sovereign call
            }
            else if (storeResponse.gamePersonas != undefined){
                this.generatePersonList(component, event, storeResponse.gamePersonas, false); //Function to parse the data for getPersona sovereign call
            }
        }
        else{
            //Handle no data in persona
            var personaOption={ 'value':'0','label':'None','name':'None'};
            var personaComboBox=[]
            personaComboBox.push(personaOption);
            component.set("v.personaList",personaOption);
            component.set("v.grantDisable", true); //TSM-2570
            this.firePersonaChange(component, event ,personaComboBox[0], false);
        }
    },
    //Function used to generate list from persona
    generatePersonList : function (component, event, personaEntity, isIdentities) {
        var productName = component.get("v.product.Name");
        var clubList={};
        var personaComboBox=[]; //Init the persona combo box
        var gameMode;
        
        //Looping through the persona structure - 1st sub entity is persona
        for(var eachPersonaEntitity in personaEntity){
            var personaOption={};
            var personaName = "";
            var platformName = "";
            var status = "";
            
            //Building the combo box for both identities and getPersona
            if(isIdentities){
                 personaName = personaEntity[eachPersonaEntitity].name;
                 platformName = personaEntity[eachPersonaEntitity].platform;
                 status = personaEntity[eachPersonaEntitity].status;    
            }else{
                 //eachPersonaEntitity.gamerIdType = personaEntity.gamerIdType;
                 personaName = personaEntity[eachPersonaEntitity].personaName;
                 platformName = personaEntity[eachPersonaEntitity].platform;
                 status = personaEntity[eachPersonaEntitity].entitlementStatus;
            }
            
            //Building the map for the persona list - Adding to the combobox
            personaOption['value'] = eachPersonaEntitity; //Name object stores the persona details
            personaOption ['label'] = personaName+' - '+ platformName +' - '+ status;
            personaComboBox.push(personaOption);
            
            //Looping through the clubs (sub-entity of persona) - If it has children
            if(personaEntity[eachPersonaEntitity].hasAdditionalChildern != undefined){
                if(personaEntity[eachPersonaEntitity].hasAdditionalChildern == "true"){
                    var clubEntity = personaEntity[eachPersonaEntitity].subEntities;  
                    if(clubEntity.length > 0){
                        clubList[personaOption['value']] = [];
                        for(var eachClubEntity in clubEntity){
                            clubList[personaOption['value']].push(clubEntity[eachClubEntity]);
                        }
                    }                 
                }                
            }                       
        }        
        
        component.set("v.personaList",personaComboBox);
        this.getplatformstatus(component, event, personaEntity[0]); //Function used to get the platform status
        
        //Getting game modes for identity api calls
        if(isIdentities){
            this.getGameModes(component,event,personaEntity[0]); //Setting the game mode for 1st persona
        }else{
            this.firePersonaChange(component, event , personaEntity[0], true); //Firing the persona change
        }  
        
        component.set("v.clubList",clubList); //Setting the club list
    },
    getGameModes : function(component, event, personaObject) {
        var finalGameModes=[];
        if(personaObject.subEntities != undefined){         
            for(var eachPersona in personaObject.subEntities){
                var gameModeJSON;
                if(personaObject.subEntities[eachPersona].status == "active"){
                    if(personaObject.subEntities[eachPersona].idType == "FUTClub"){
                        gameModeJSON = {'label': 'FUT', 'value': 'FUTClub'};
                    }else{
                        gameModeJSON = {'label': 'WC', 'value': 'WCClub'};
                    }
                    //Building the game mode data
                    finalGameModes.push(gameModeJSON); 
                }
            }
            component.set("v.gameModeComboValue", finalGameModes);
            component.set("v.selectedGameMode", finalGameModes[0].value); //Setting the default value
            component.set("v.isGameMode",true);
            this.firePersonaChange(component, event , personaObject, true); //Firing the persona change with game modes
        }
    },
    getplatformstatus : function(component, event, personaObject) {
        var productName = component.get("v.product.Url_Name__c");
        var platfrom = personaObject.platform;
        var action = component.get("c.getPlatformStatuses");
        action.setParams({
            productName : productName,
            platform : platfrom           
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS" && response.getReturnValue().status === "SUCCESS") {
                var storeResponse = response.getReturnValue().response;
                component.set('v.platformStatus',storeResponse);
                component.set("v.platformStatus.platform" , platfrom);
                component.set('v.platformStatusDate',Util.getFormattedDateTime(storeResponse.lastUpdatedTime * 1000));
            } else if (state === "SUCCESS" && response.getReturnValue().status === "ERROR") {
                component.set('v.platformStatus', '');
                var errors = response.getError();
            }
        });
        $A.enqueueAction(action);
    },
    //Function used to init mobile games
    initMobilePersonaDetails: function (component, event, helper) {
        var rootIdentity = component.get("v.productSnapShotData");
        //Generate root identity list
        if(typeof rootIdentity != "undefined" && rootIdentity != "noData" && rootIdentity != undefined){
            this.generateRootIdentityList(component, event, rootIdentity);
        }else{
            //Handle no data in persona
            var personaOption={ 'value':'0','label':'None','name':'None'};
            var personaComboBox=[]
            personaComboBox.push(personaOption);
            component.set("v.rootIdentityList",personaComboBox);
            component.set("v.mobilePersonaList",personaComboBox);
            component.set("v.mobileSubEntityList", personaComboBox);
            this.firePersonaChange(component, event , personaComboBox , false);
        }
        
    },
    //Getting the root identity list
    generateRootIdentityList: function (component, event, personaEntity) {
        var entityComboBox=[];
        for(var eachPersonaEntitity in personaEntity){
            var personaOption={};
            //Building the combo box
            var personaName = personaEntity[eachPersonaEntitity].gamerId ;
            var platformName = personaEntity[eachPersonaEntitity].gamerIdType;
            var status = personaEntity[eachPersonaEntitity].status;
            personaOption['value'] = eachPersonaEntitity;
            personaOption ['label'] = personaName+' - '+ platformName;           
            //loading the list
            entityComboBox.push(personaOption);             
        }
        component.set("v.rootIdentityList", entityComboBox);
        this.getMobileGamePersona(component,event,personaEntity[0]);
    },
    
    //Function used to load the mobile game persona
    getMobileGamePersona : function(component,event,rootIdentity){
        var action = component.get("c.getUserIdentities");         
        var dataMap = {};
        dataMap["gamerId"] = rootIdentity.gamerId;
        dataMap["caseId"] = component.get("v.caseId");
        dataMap["customerId"] = component.get("v.nucleusId");
        dataMap["accountId"] = component.get("v.accountId");
        dataMap["gamerIdType"] = rootIdentity.gamerIdType;
        dataMap["email"] = component.get("v.email");
        dataMap["crmProductName"] = component.get("v.product.Url_Name__c");
        action.setParams({
            "mapReqParams": dataMap
        });
        var self = this;
        action.setCallback(self, $A.getCallback(function(response) {
            var state = response.getState();
            var toastEvent = $A.get("e.force:showToast");
            if (state === "SUCCESS") {
                if(response.getReturnValue() != ""){
                    var responseData = JSON.parse(response.getReturnValue()).response;
                    if(responseData.entities != null){
                        this.generateMobilePersonaList(component, event, responseData.entities);
                    }else{
                        //Handle no data in persona
                        var personaOption={ 'value':'0','label':'None','name':'None'};
                        var personaComboBox=[]
                        personaComboBox.push(personaOption);
                        component.set("v.mobilePersonaList",personaComboBox);
                        component.set("v.mobileSubEntityList", personaComboBox);
                        this.firePersonaChange(component, event , personaComboBox , false);                    
                    }
                }else{       
                    //Handle no data in persona
                    var personaOption={ 'value':'0','label':'None','name':'None'};
                    var personaComboBox=[]
                    personaComboBox.push(personaOption);
                    component.set("v.mobilePersonaList",personaComboBox);
                    component.set("v.mobileSubEntityList", personaComboBox);
                    this.firePersonaChange(component, event , personaComboBox , false);
                }
            }else{       
                //Handle no data in persona
                var personaOption={ 'value':'0','label':'None','name':'None'};
                var personaComboBox=[];
                personaComboBox.push(personaOption);
                component.set("v.mobilePersonaList",personaComboBox);
                component.set("v.mobileSubEntityList", personaComboBox);
                this.firePersonaChange(component, event , personaComboBox , false);
            }
        }));
        $A.enqueueAction(action);
    },
    
    //Function used to generate list from persona
    generateMobilePersonaList : function (component, event, responseEntities) {
        var personaComboBox=[];
        var subEntities = [];
        
        //Looping through the persona structure
        for(var eachPersonaEntitity in responseEntities){
            var personaOption={};
            //Building the combo box
            var personaName = responseEntities[eachPersonaEntitity].id;
            var platformName = responseEntities[eachPersonaEntitity].idType;
            var status = responseEntities[eachPersonaEntitity].status;
            
            personaOption['value'] = eachPersonaEntitity;
            personaOption ['label'] = personaName+' - '+ platformName +' - '+ status;           
            //loading the list
            personaComboBox.push(personaOption);  
        }     
        
        component.set("v.mobilePersonaEntitiesData", responseEntities);
        component.set("v.mobilePersonaList", personaComboBox);
               
        //Initial Sub Entity fire
        if(responseEntities[0].subEntities.length > 0){
            this.generateMobileSubEntityList(component, event ,responseEntities[0]);
        }else{
            //Fire mobile persona change
            if(responseEntities[0].functionalSupport == "true"){
                this.firePersonaChange(component, event ,responseEntities[0], true);
            }else{
                this.firePersonaChange(component, event ,responseEntities[0], false);
            }
        }
    },
    
    //Function used to generate sub entity list from mobile persona
    generateMobileSubEntityList : function (component, event, responseEntities) {
        var personaComboBox=[];
        var functionalSupport = [];
        var firedPersona = responseEntities;
        
        var responseSubEntities = responseEntities.subEntities;
        //Looping through the persona structure
        for(var eachPersonaEntitity in responseSubEntities){
            var personaOption={};
            //Building the combo box
            var personaName = responseSubEntities[eachPersonaEntitity].id;
            var platformName = responseSubEntities[eachPersonaEntitity].idType;
            var status = responseSubEntities[eachPersonaEntitity].status;
            
            personaOption['value'] = eachPersonaEntitity;
            personaOption ['label'] = personaName+' - '+ platformName +' - '+ status;       
            //loading the list
            personaComboBox.push(personaOption);            
        }  
        component.set("v.mobileSubEntityData", responseSubEntities);
        component.set("v.mobileSubEntityList", personaComboBox);
        
        //Initial fire
        if(responseEntities.functionalSupport == "true"){
            this.firePersonaChange(component, event ,responseEntities, true);
        }else{
            this.firePersonaChange(component, event ,responseEntities, false);
        } 
    },
    
    //Function used to fire personaChange
    firePersonaChange : function (component, event, currentPersona, isPersonaPresent) {
        var productSnapshotEvent = $A.get("e.c:ProductSnapShotAction");
        //Getting the current selected game mode
        var gameMode = component.get("v.selectedGameMode");
        var changeType = '';
        //Setting the type value based on the persona list
        if(isPersonaPresent){
            changeType = 'personaChange';
        }else{
            changeType = 'noPersonaAvailable';
        }
        //Setting the persona Id
        var changedPersona = {
            object: currentPersona, 
            gameMode : gameMode,
            type:changeType
        };
        component.set("v.selectedPersonaId", changedPersona);
    },
    changeFranchiseBanData : function(component, event) {
        var franchiseDataFromPT = component.get("v.franchiseBanDatasubSet");
        var completeFranchiseData = component.get("v.franchiseBanData");
        var completeBanData = JSON.parse(completeFranchiseData);
        
        var jsonParsed = JSON.parse(franchiseDataFromPT);
        var pName = component.get("v.product").Name;
        var pName2 = pName.replace(/[^0-9a-z]/gi, '');
        var pName3 = pName2.toUpperCase();
        
        if(component.get("v.franchiseBanDatasubSet")!=null&&jsonParsed.title==pName3&&jsonParsed.title!='ALL'){
            component.set("v.isBanned",true);
            component.set("v.isBannedFull",false);
            this.setFranchiseBanDetails(component,event);
        }
        else if(component.get("v.franchiseBanDatasubSet")!=null&&jsonParsed.title=='ALL'&&jsonParsed.title!=pName3){
            component.set("v.isBanned",false);
            component.set("v.isBannedFull",true);
            this.setFranchiseBanDetails(component,event);
        }
            else if(component.get("v.franchiseBanDatasubSet")==null){
                component.set("v.isBanned",false);
                component.set("v.isBannedFull",false);
            }
        
    },
    setBanDataSubSet : function(component,event,helper){
        var attachedStatusJson = JSON.parse(component.get("v.franchiseBanData"));
        var franchiseData;
        //to display suspend frnachise menu option only for fifa products
        var productName = component.get("v.product").Name;
        
        if(productName.toUpperCase().indexOf('FIFA')>=0){
            component.set("v.showFranchise",true);
        }else{
            component.set("v.showFranchise",false);
        }
        if(attachedStatusJson!=null&&attachedStatusJson.response.length>0){
            // component.set("v.franchiseBanData",response.getReturnValue()); //this is for reason codes and products list
            
            if(attachedStatusJson.response[0].response.userAttachedStatus.length>0&&attachedStatusJson.response[0].response.userAttachedStatus[0].franchise=='FIFA'){
                
                var subStatuses = attachedStatusJson.response[0].response.userAttachedStatus[0].subStatuses.subStatus;
                if(subStatuses.length>0){
                    
                    var franchiseDataBlank=false;
                    for(var i=0;i<subStatuses.length;i++){
                        var pName = component.get("v.product").Name;
                        var pName2 = pName.replace(/[^0-9a-z]/gi, '');
                        var pName3 = pName2.toUpperCase();
                        //if(attachedStatusJson.response[0].response.userAttachedStatus[0].franchise=='FIFA'){
                        if((attachedStatusJson.response[0].response.userAttachedStatus[0].subStatuses.subStatus[i].title==pName3||attachedStatusJson.response[0].response.userAttachedStatus[0].subStatuses.subStatus[i].title=='ALL')){
                            console.log('franchise banned::',JSON.stringify(attachedStatusJson.response[0].response.userAttachedStatus[0].subStatuses.subStatus[i]));
                            //component.set("v.franchiseBanData1",JSON.stringify(attachedStatusJson.response[0].response.userAttachedStatus[0].subStatuses.subStatus[i])); //this is to set tooltip data respectively
                            //component.set("v.isBanned",true); 
                            franchiseData=JSON.stringify(attachedStatusJson.response[0].response.userAttachedStatus[0].subStatuses.subStatus[i]);
                            break;
                        }
                        else {
                            // franchiseDataBlank=true;
                            //component.set("v.franchiseBanData1",null);
                            franchiseData=null;
                            
                        }
                    }
                    console.log('franchiseData after for ::',franchiseData);
                    // if(franchiseDataBlank==false){
                    component.set("v.franchiseBanDatasubSet",franchiseData);
                    // }
                    // else{
                    // component.set("v.franchiseBanDatasubSet",null);
                    // }
                    
                    console.log('after setting new data ::',component.get("v.franchiseBanDatasubSet"));
                    
                    
                }
            } 
            
            
        }
        // if(franchiseData!=null||  franchiseData!= undefined){
        this.changeFranchiseBanData(component,event);
        //}
    },
    getFranchiseReasonCodes : function(component,event,helper){
        var action = component.get("c.getFranchiseBanReasons");
        action.setCallback(this,function(response){
            if(response.getReturnValue()!=null){
                var responseJson = response.getReturnValue();
                console.log('get Reasons ::',responseJson);
                var parsedReasonsJson = JSON.parse(responseJson);
                var reasonCodesJson = parsedReasonsJson.response;
                console.log('responseJson from getfranchise reasons ::',typeof reasonCodesJson);
                var reasonList = [];
                
                for (const key in reasonCodesJson)
                {
                    reasonList.push({label:reasonCodesJson[key].name, value:reasonCodesJson[key].id});
                }
                console.log('res:: ',reasonList);
                var jsonProductTab = component.get("v.franchiseBanData");
                if(jsonProductTab!=null&&JSON.parse(jsonProductTab).response.length>0){
                    var jsonproductList = JSON.parse(jsonProductTab).response[0].bannedSupportedFranchise;
                    var productList = [];
                    for (const key in jsonproductList)
                    {
                        if(jsonproductList[key].displayTitle=='ALL'){
                            var typeAll = 'Full Franchise';
                            productList.push({label:typeAll, value:jsonproductList[key].title});
                        }
                        else{
                            productList.push({label:jsonproductList[key].displayTitle, value:jsonproductList[key].title});
                        }
                    }
                    console.log('productList ::',productList);
                    component.set("v.productList",productList);
                    component.set("v.banReasonList",reasonList);
                    
                }
                
            }
        });
        $A.enqueueAction(action);
    },
    suspendFranchise: function(component,event,helper){
        var reqObject ={};
        var data ={};
        var dateTZ = component.find("suspendFr")[1].get("v.value");//component.get("v.newSuspensionEndDate");
        var date1 = new Date(dateTZ);
        
        var finalDate = date1.getFullYear() + '-' + ('0' + (date1.getMonth()+1)).slice(-2) + '-' + ('0' + date1.getDate()).slice(-2)+'T'+date1.getUTCHours()+':'+date1.getUTCMinutes()+'Z';
        reqObject['accountId']=component.get("v.accountId");
        reqObject['caseId']=component.get("v.caseId");
        reqObject['customerId']=component.get("v.nucleusId");
        data['readOnly']=false;
        data['type']='FRANCHISE_BAN';
        data['franchise']='FIFA';
        data['endDate']=finalDate
        data['reasons']=component.get("v.newBanReason");
        data['title']=component.get("v.selectedProductToBan");
        data['comments']='test';
        reqObject['data']=JSON.stringify(data);
        console.log('reqObject banning franchise::',reqObject);
        var toastEvent = $A.get("e.force:showToast");       
        var action = component.get("c.banAttachedStatus");
        action.setParams({
            reqParameters: reqObject
        });
        action.setCallback(this,function(response){
            console.log('responseState after ban ::', response.getState(),'response error ::', response.getError(), 'response ban value ::', response.getReturnValue());
            if(response.getState()==='SUCCESS'){
                component.set("v.openSpinner",false);
            component.find("suspendFr")[0].set("v.value",'')
            component.find("suspendFr")[1].set("v.value",'')
            component.find("suspendFr")[2].set("v.value",'')
                //fire component event to get latest attached status
                component.set("v.suspendFranchiseModal",false);
                component.set("v.franchiseBanData",response.getReturnValue());
                toastEvent.setParams({
                    'message':"Franchise Status successfully updated.",
                    'type':'success'
                });
                toastEvent.fire();
                /*var compEvent = component.getEvent("getLatestAttachedStatus");
                compEvent.setParams({
                    onload:true
                })*/
                //  compEvent.fire();
                this.getBannedFranchiseDetails(component,event,helper);
                
            }else if(response.getState()==='ERROR'){
                component.set("v.openSpinner",false);
                component.find("suspendFr")[0].set("v.value",'')
                component.find("suspendFr")[1].set("v.value",'')
                component.find("suspendFr")[2].set("v.value",'')
                component.set("v.suspendFranchiseModal",false);
				var errorMsg = response.getError()[0].message;
                toastEvent.setParams({
                    
                    message: errorMsg,
                    type: "error"
                });
                toastEvent.fire();
            }    
            
        });
        $A.enqueueAction(action);
    },
    getBannedFranchiseDetails:function(component, event, helper) {
        var action = component.get("c.getAttachedStatuses");
        action.setParams({
            customerNucleusId: component.get("v.nucleusId")
        });
        action.setCallback(this,function(response){
            if(response.getReturnValue()!=null){
                var attachedStatusJson = JSON.parse(response.getReturnValue());
                if(attachedStatusJson!=null&&attachedStatusJson.response.length>0){
                    component.set("v.franchiseBanData",response.getReturnValue()); 
                    this.setBanDataSubSet(component,event,helper);
                }
            }
        });
        $A.enqueueAction(action);
    },
    setFranchiseBanDetails: function(component,event,helper){
        var franchiseBanData = component.get("v.franchiseBanDatasubSet");
        console.log('franchiseBanData respective ::',franchiseBanData);
        
        var parsedFranchiseBanData= JSON.parse(franchiseBanData);
        console.log('parsedFranchiseBanData ::',parsedFranchiseBanData);
        console.log('productName ::',JSON.stringify(component.get("v.product")));
        
        // if(parsedFranchiseBanData.response[0].response.userAttachedStatus.length>0){
        // commenting as it is throwing error, blocking
        var pName = component.get("v.product").Name;
        var pName2 = pName.replace(/[^0-9a-z]/gi, '');
        var pName3 = pName2.toUpperCase();
        var jsonReason = parsedFranchiseBanData.reasons;
        var reason1 = jsonReason.replace(/[^0-9a-z]/gi, '');
        var reason2 = reason1.toUpperCase();
        component.set("v.FrProductName", parsedFranchiseBanData.title);
        if(parsedFranchiseBanData.title==pName3||parsedFranchiseBanData.title=='ALL'){
            
            
            // console.log('parsed Date ::',parsedFranchiseBanData.response[0].response.userAttachedStatus[0].subStatuses.subStatus[0].dateCreated)
            component.set("v.banCreatedDate", parsedFranchiseBanData.dateCreated);
            component.set("v.banEndDate", parsedFranchiseBanData.endDate);
            component.set("v.banReason",reason2);
        }
        //  }
        
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
        }
    }
})