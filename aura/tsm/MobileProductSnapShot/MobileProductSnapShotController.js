({
    doInit : function(component, event, helper) {
        helper.getGamerIdTypesForMobileProduct(component,event,helper); 
    },
    addMobileID:function(component,event,helper){
        var gamerIdType = component.get("v.gamerIdType");
        var gamerId = component.get("v.gamerId");
        if(gamerIdType == undefined || gamerIdType == null || gamerIdType == '' || gamerId == undefined)
        {
            var errorMsg = ' ';
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                mode: 'dismissible',
                title: 'Please select ID type and enter associated ID Value',
                message: errorMsg,
                type : 'error'
            });
            toastEvent.fire();
        }else{
            helper.getGamerAssociatedAccounts(component,event,helper,gamerId,gamerIdType);
        }
    },
    onMobileProductSelect:function(component,event,helper){
        var selectedOptionValue = event.getParam("value");
        var gamerIdOptions = component.get('v.mobileProducstList'),
            gamerIdTypeName;
            for (var i=0; i<gamerIdOptions.length; i++) {
                if(gamerIdOptions[i].value == selectedOptionValue){
                     gamerIdTypeName = gamerIdOptions[i].label;
                 }
           }
        component.set('v.gamerIdTypeName',gamerIdTypeName);
        if(selectedOptionValue != null){
            component.set("v.isMobileProdSelected",false);
        }
    },
    onAssociatedID:function(component,event,helper){
        var gamerId = component.get("v.gamerId");
        if(gamerId.length > 0){
            component.set("v.isAddMobileBtn",false);    
        }else if(gamerId.length == 0){
            component.set("v.isAddMobileBtn",true);   
        } 
    },
    onChangeOfProduct:  function(component, event, helper) {
        //helper.initPersonaDetails(component, event, helper);
        //helper.getplatformstatus(component, event, helper);
    },
    prodNameReplace: function(component, event, helper) {
        var productNametoReplace = component.get("v.product.Name");
        component.set("v.prodName", productNametoReplace.replace(/-/g, ' '));
    },
    currentProductChange: function(cmp, evt) {
       /* var oldProduct, newProductValue, caseObject;
        oldProduct = evt.getParam("oldProduct");
        newProduct = evt.getParam("changedProduct");
        component.set("v.selectedProduct", newProduct); */ 
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
    },
    changeConfigUILayout:  function(component, event, helper) {
        helper.modifySnapshotUI(component);
    },
    //TSM-3948 - Funciton added to go to product
    goToProduct:  function(component, event, helper) {
        component.set("v.isMobileProductAttached", true);
        component.set("v.isAddId", false);
    },
})