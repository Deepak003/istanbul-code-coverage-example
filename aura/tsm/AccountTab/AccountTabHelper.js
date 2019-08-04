({
    //Funciton used the get the masking data for account tab - TSM-2577
    getDataMaskConfigurations : function(component, event) {
        var action = component.get("c.getDataMaskConfigurations");  
        action.setParams({
            strCompName : 'Account'
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();     
                console.log("Masking data....", storeResponse);
                this.convertDataToMap(component, storeResponse);
            }else{
                component.set("v.accountMaskingData", {});
                component.set("v.isAccountMakingLoaded", false);
                console.log("No data loaded");
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

        //Checking for super admin for account security
        if(resultantMap["Account"].VerifyAccount && component.get("v.hideAccountData") == 'default'){
            component.set("v.isCaseLinkedDisable", false);
        }
        
        component.set("v.accountMaskingData", resultantMap);
        component.set("v.isAccountMakingLoaded", true);//Setting true for the component to load        
    },
})