({
    //Function initilized on start of product tab
    doinit : function(component, event, helper) {          
        //Independent function which are not related to gamerID
        if(component.get("v.selectedProduct.Url_Name__c") != undefined){
            helper.getDataMaskConfigurations(component, event);//TSM-2577           
            helper.getBannedFranchiseDetails(component,event,helper);//TSM-3022     
            //Function to get the generic permission mapping - TSM-2910, TSM-2911, TSM-2912
            helper.getGenericProductPermission(component);
        }
    },
    //Funciton used to open the change product change component
    openChangeProductModal : function(component,event,helper){
      component.set("v.openProductChange",true);  
    },
    handleShowMobileEvt : function(component,event,helper){
      console.log("handleShowMobileEvt is handled");
    },
    //Function trigerred on change of the config UI
    changeConfigUILayout:  function(component, event, helper) {
        if(component.get("v.configUIData") != null){
            helper.modifyProductTabUI(component);
            component.set("v.isError", false);
        }else{
            var errorMessage = {};
            errorMessage['header'] = "We're still hooking this product up!";
            errorMessage['body'] = "This product is not configured yet. Search the knowledge base for any relevant information to provide support for this product.";
            errorMessage['isOwned'] = true;
            component.set("v.errorMessage", errorMessage);
            component.set("v.isError", true);
        }
        component.set("v.isLoading", false);
    },
    //Function used to reload Game stats
    reloadGameStats : function(component, event, helper) {
        helper.getGameStats(component, event, helper);
    },
    //Function used to reload clubs
    reloadClubs : function(component, event, helper) {
        //Recording club name change
        if(event.getParam("type") == "change-club-name"){
            component.set("v.isClubNameChange", true);
        }
        helper.getPersonaDetails(component, event, helper);
    },
    //Funciton used to refresh inventory tab
    getInventoryStats : function(component, event, helper){
        //TSM-3777 - To match sovereign time out
        component.set("v.isLoading", true);
        setTimeout(function() {
            helper.getInventoryStats(component, event, helper,true); 
        }, 50); 
    },
    //Funciton used to handle product change
    onChangeProduct: function(component, event, helper){
        component.set("v.isHistoryAvailable", false);
        component.set("v.tabId", "one");
        
        component.set('v.isLoading', true); //when product is changed
        helper.getBannedFranchiseDetails(component,event,helper); 
        helper.getGenericProductPermission(component); //TSM-3658
        helper.getPersonaDetails(component, event, helper); //Getting the gamesID Types 
        if(component.get("v.selectedProduct").Url_Name__c=='origin'){
            component.set("v.isOrigin",true);
            component.set("v.tabId","three");
        }  
    },
    //Function used to handle persona change
    onChangePersonaId: function(component, event, helper){        
        if(component.get("v.selectedPersonaId").type != "resettingPersona"){
            component.set("v.isHistoryAvailable", false);

            //Blocking tab change if club name is changed
            if(!component.get("v.isClubNameChange")&&component.get("v.selectedProduct").Url_Name__c != 'origin'){
                component.set("v.tabId", "one");
            }else{
                component.set("v.isClubNameChange", false);
            }
            
            //Handling persona change/load
            if(component.get("v.selectedPersonaId").type == "personaChange"){
                var currentPersona = {
                    object : component.get("v.selectedPersonaId").object,
                    gameMode : component.get("v.selectedPersonaId").gameMode
                }
                component.set("v.selectedPersona", currentPersona);
                helper.getGameStats(component);  
                helper.getInventoryStats(component, event, helper,false);
                helper.getGameIntegrationConfig(component, event);
                //Updating entitlemnts
                if(component.get("v.updateEntitlement"))
                    component.set("v.updateEntitlement" , false);
                else
                    component.set("v.updateEntitlement" , true);
            }  
            
            //Handling no persona available for change/load
            if(component.get("v.selectedPersonaId").type == "noPersonaAvailable"){
                //Error handling for games not owned by player  
                if(component.get("v.selectedProduct").Url_Name__c != 'origin'){  
                const customerHdProducts = JSON.parse(component.get('v.customerProduct')).response; 
                var errorMessage = {};
                errorMessage['header'] = 'No Product Data';
                //Handling the error for no persona
                if(component.get("v.selectedProduct").isMobile__c){
                    errorMessage['isOwned'] = true;
                    errorMessage['body'] = 'There is no data because there is no persona created for the product yet.';
                }else{
                    if(!helper.isCustomerOtherProduct(component,event,customerHdProducts)){
                        errorMessage['body'] = 'There is no data because the game is not owned by the player.';
                        errorMessage['isOwned'] = false;
                    }else{
                        errorMessage['body'] = 'There is no data because there is no persona created for the product yet.';
                        errorMessage['isOwned'] = true;
                    }
                }
                //tsm 2867 bug-3876
                component.set("v.errorMessage", errorMessage);
                component.set("v.isError", true);
                component.set("v.isLoading", false);
            }else{
                    component.set("v.tabId","three");
                    component.set("v.isError", false);
                    component.set("v.isLoading", false);
                    //Closing other tabs
                    component.set("v.isHistoryExist", false);
                    component.set("v.isCurrentInventoryExist", false);
                    component.set("v.isAdditionalInfoExist", false);
                    //Updating entitlemnts
                    if(component.get("v.updateEntitlement"))
                        component.set("v.updateEntitlement" , false);
                    else
                        component.set("v.updateEntitlement" , true);
                }
                //Setting the persona
                var changedPersona = {
                    type:'resetting'
                };
                component.set("v.selectedPersonaId", changedPersona);
            } 
        }
    },
    //Funciton used to handle the ProductSnapShotAction event
    onChangePersona : function(component, event, helper) { },
    //TSM -1622 : Funciton to handle NavigateToCurrentHistoryEvent which navigates to History Tab carrying the selected current inventory object - UX requirement
    navigateTab : function(component, event, helper) {
        var selectedObject = event.getParam("selectedObject");
        event.stopPropagation();
        component.set('v.tabId',"one"); //one - History Tab
        component.set("v.currentInventoryObject", selectedObject);
    },    
    //Funciton used to implement Grant New Entitlement modal
    openEntitlementModal: function(component, event, helper) {
        component.set('v.openEntitlementModal', true);
    },
    //Function fired on change of selectedProduct to check if the HD product is owned by customer
    defineEntitlement : function(component, event, helper){
        try{
            const customerProducts = JSON.parse(component.get('v.customerProduct')).response;
            const selectedProduct = component.get('v.selectedProduct').Url_Name__c;
            const foundProduct = customerProducts.find((p)=>p.name==selectedProduct);
            component.set('v.hasEntitlement', !!foundProduct); 
        }catch(err){}
    },
    //Function to listen to GrantComponentEvent  - TSM-2109
    reloadCurrency : function(component, event, helper) {
        component.set("v.isLoading", true);
        helper.getInventoryStats(component, event, helper,true); 
    },
    //Function used to open the search code modal
    openSearchCodeModal: function(component, event, helper) {
        component.set("v.searchCodes", true);
    },
    //TSM-2577 - Funciton hadnling the change in hideAccountData which changes as per AOV verification
    onChangeHiddenData : function(component, event, helper){
        helper.getDataMaskConfigurations(component, event);//TSM-2577
    },
    //Function used to handle the addition of the mobile ID to the SF account 
    handleAddMobileEvt : function(component,event,helper){
        helper.getPersonaDetails(component,event,helper);
    },
    //The first point of contact when the JS loads
    getProductInformation: function(component,event,helper){
        //Function used to load the product based information
        if(component.get("v.selectedProduct.Url_Name__c") != undefined){
            helper.getPersonaDetails(component, event, helper);
        }else{
            var errorMessage = {};
            errorMessage['header'] = 'No Product Data';        
            errorMessage['body'] = 'There is no data because no product is selected.';
            errorMessage['isOwned'] = true;
            component.set("v.errorMessage", errorMessage);
            component.set("v.isError", true);
            component.set("v.isLoading", false);
        }
    },
})