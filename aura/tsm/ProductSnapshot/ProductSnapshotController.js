({
    doInit : function(component, event, helper) {
        if(window.permissionsList){
            if(window.permissionsList.includes('grant item') || window.permissionsList.includes('grant pack') || window.permissionsList.includes('grant currency to wallet')){
                component.set('v.hasGrantAllContentPermission', true);
            }
        }
        //Function used to get the persona details to load in the combobox
        component.set("v.prodName" , component.get("v.product.Name"));
        helper.initPersonaDetails(component, event, helper);
        helper.modifySnapshotUI(component);
        helper.getFranchiseReasonCodes(component,event,helper); //tsm 3022
        helper.setBanDataSubSet(component,event,helper); //tsm 3022
        //to display suspend franchise only for fifa products.
        var productName = component.get("v.product").Name;        
        if(productName.toUpperCase().indexOf('FIFA')>=0){
            component.set("v.showFranchise",true);
        }else{
            component.set("v.showFranchise",false);
        }
    },
    changeFranchiseBanData : function(component, event, helper) {
       helper.setBanDataSubSet(component,event,helper);
        
    },
    onChangeOfPersona:  function(component, event, helper) {
        helper.initPersonaDetails(component, event, helper);
    },
    prodNameReplace: function(component, event, helper) {
        var productNametoReplace = component.get("v.product.Name");
        component.set("v.prodName", productNametoReplace.replace(/-/g, ' '));
    },
    currentProductChange: function(cmp, evt) {
        var oldProduct, newProductValue, caseObject;
        oldProduct = evt.getParam("oldProduct");
        newProduct = evt.getParam("changedProduct");
        component.set("v.selectedProduct", newProduct);  
    }, 
    handleActionMenuSelect : function (component, event, helper) {
        if(event.getParam("value") =="change-product"){
            component.set("v.openProductChange", true);
        }
        if(event.getParam("value") =="view-codes"){
            component.set("v.viewcodes", true);
        }
        if(event.getParam("value") =="search-codes"){
            component.set("v.searchCodes", true);
        }
        if(event.getParam("value") =="grant-discounts-and-promos"){
            component.set("v.discountsandpromos", true);
        }        
        if(event.getParam("value")=="grant-in-game-entitlement"){
            component.set("v.inGameEntitlement", true);
        }
        if(event.getParam("value") =="grant-Item-information"){
            component.set("v.viewGrantItems", true);
            component.set("v.openGrantInfoDefault", true);
        }
        if(event.getParam("value")=="suspend-franchise"){
            component.set("v.suspendFranchiseModal",true);
            component.set("v.disableSuspend",true);
        }
    },
    handleApplicationEvent : function (component, event, helper) {

    }, 
    onChangePersonaDropDown : function (component, event, helper) {
        var currentSelectionIndex = event.getSource().get('v.value'); 
        var getPersonaResponse = "";
        var storeResponse = component.get("v.productSnapShotData");
        
        if(typeof storeResponse != "undefined" && storeResponse != "noData" && 
           (storeResponse.entities != undefined || storeResponse.gamePersonas != undefined)){
            if(storeResponse.entities != undefined){
                getPersonaResponse = storeResponse.entities[0].subEntities;  //Assignment for response from Identity sovereign call
            }
            else if (storeResponse.gamePersonas != undefined){
                getPersonaResponse = storeResponse.gamePersonas; //Assignment for getPersona sovereign call response
            }
        }
        
        helper.getGameModes(component,event,getPersonaResponse[currentSelectionIndex]); //Function used to get the game modes for a game
        helper.firePersonaChange(component, event, getPersonaResponse[currentSelectionIndex], true); //Firing the persona change
    },
    onChangeGameMode : function (component, event, helper) {
        var currentSelectionValue = event.getSource().get('v.value');
        var currentPersona = component.get("v.defaultPersonaList");
               
        var storeResponse = component.get("v.productSnapShotData");
        var getPersonaResponse = storeResponse.entities[0].subEntities; //Always have identities if game mode drop down is available
        
        component.set("v.selectedGameMode", currentSelectionValue); //Changing the new game mode
        helper.firePersonaChange(component, event, getPersonaResponse[currentPersona], true);
    },
    changeConfigUILayout:  function(component, event, helper) {
        helper.modifySnapshotUI(component);
    },
    toggleDialogue: function(component,event,helper){
        console.log('toggleDialogue in snapshot')
        if(component.get("v.displayTooltip")==false){
        component.set("v.displayTooltip",true);
        }
        else{
            component.set("v.displayTooltip",false);
        }
        
    },
    toggleDialogueFull:function(component,event,helper){
        component.set("v.displayTooltip",false);
        component.set("v.displayTooltipFull",true);
    },
     handleProductNameChange: function(component,event,helper){
        var changedFranchise = event.getParam('value');
        component.set("v.selectedProductToBan",changedFranchise);
        var datetime = component.find("suspendFr")[1].get("v.value"),
             rsn = component.find("suspendFr")[2].get("v.value");
         if((changedFranchise!=''&&changedFranchise!=null)&&(datetime!=''&&datetime!=null)&&(rsn!=''&&rsn!=null)){
             component.set("v.disableSuspend",false)
         }else{
             component.set("v.disableSuspend",true)
         }
        
    },
    suspendFranchise:function(component,event,helper){
        component.set("v.openSpinner",true);
        helper.suspendFranchise(component,event,helper);
        
        /*var dateTZ = component.get("v.newSuspensionEndDate");
        var date1 = new Date(dateTZ);
       var utcHours = date1.getUTCHours();
       var finalDate = date1.getUTCFullYear()+'-'+date1.getUTCMonth()+'-'+date1.getUTCDate()+'T'+date1.getUTCHours()+':'+date1.getUTCMinutes()+'Z';
        

 
        console.log('newSuspensionEndDate1 ::',  finalDate);*/
    },
    handleBanReasonChange:function(component,event,helper){
        var banreason = event.getParam('value');
        component.set("v.newBanReason",banreason);
        var prdtName = component.find("suspendFr")[0].get("v.value"),
            datetime=component.find("suspendFr")[1].get("v.value");
        if((banreason!=''&&banreason!=null)&&(prdtName!=''&&prdtName!=null)&&(datetime!=''&&datetime!=null)){
            component.set("v.disableSuspend",false)
        }
        else{
            component.set("v.disableSuspend",true)
        }
    },
    closesuspendFranchiseModal : function(component,event,helper){
        component.set("v.suspendFranchiseModal",false);
        component.find("suspendFr")[0].set("v.value",'')
        component.find("suspendFr")[1].set("v.value",'')
        component.find("suspendFr")[2].set("v.value",'')
    },
    handleGameStatusRefresh: function(component,event,helper) {
        var gameStatusObj = event.getParam("gameStatusAllObj");
        var gameStatusCmp = component.find('gameStatusAllCmp');
        gameStatusCmp.gameStatusMethod(gameStatusObj)
    },
    handleSearchCode: function(component, event, helper) {
        //Closing the component  
        //helper.getProductInfomation(component, event, helper);
      },
    onChangeRootIdentity: function(component,event,helper) {
        var currentSelectionIndex = event.getSource().get('v.value'); 
        var rootIdentity = component.get("v.productSnapShotData");
        helper.getMobileGamePersona(component ,event ,rootIdentity[currentSelectionIndex]);
    },
    onChangeMobilePersona: function(component,event,helper) {
        var currentSelectionIndex = event.getSource().get('v.value');
        var responseEntities = component.get("v.mobilePersonaEntitiesData");
        helper.generateMobileSubEntityList(component, event ,responseEntities[currentSelectionIndex]);
    },
    onChangeMobileSubEntity: function(component,event,helper) {
        
    },
    addMobileID: function(component,event,helper) {
        component.set("v.isMobileProductAttached", false);
        component.set("v.isAddId", true);
    },
    handleDateChange: function(component,event,helper) {
        var newDateTime = component.find("suspendFr")[1].get("v.value"),
            reason = component.find("suspendFr")[2].get("v.value"),
            productName=component.find("suspendFr")[0].get("v.value");

            var currDate = new Date();
        if(newDateTime<currDate.toISOString()){
            component.find("suspendFr")[1].setCustomValidity('Invalid Date Time');
        }else{
         component.find("suspendFr")[1].setCustomValidity('');   
        }

        if((component.find("suspendFr")[1].reportValidity())&&(newDateTime!=''&&newDateTime!=null)&&(reason!=''&&reason!=null)&&(productName!=''&&productName!=null)){
            component.set("v.disableSuspend",false)
        }
        else{
            component.set("v.disableSuspend",true);
        }
        
        
    }
})