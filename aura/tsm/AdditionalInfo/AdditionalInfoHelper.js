({
    isClubAvailable : function(cmp) {
        const persona = cmp.get('v.selectedPersonaIdforgame');
        return  persona
        && persona.object 
        && Array.isArray(persona.object.subEntities) 
        && persona.object.subEntities.length != 0;
    },
    clubHistoryData : function(cmp) {
        const product = cmp.get("v.product");
        const persona = cmp.get('v.selectedPersonaIdforgame').object;
        const action = cmp.get('c.getAccountHistory');
        var personaId;
        if(product.Url_Name__c.toLowerCase().search("fifa") >= 0)
            personaId = persona.id;
        else
            personaId = persona.uid;
        
        
        action.setParams({
            gamerId : personaId,
            crmProductName: product.Url_Name__c,
            platform: persona.platform
        });
        action.setCallback(this, function(response){
            cmp.set('v.showClubs', this.isClubAvailable(cmp));
            
            if (response.getState() === "SUCCESS" && response.getReturnValue().status=="SUCCESS") {
                console.log(response.getReturnValue());
                cmp.set("v.historyStats" , response.getReturnValue().response.accountHistory);
            }else{
                //Util.handleErrors(cmp, response);
            }
        });
        $A.enqueueAction(action);
    },
    modifyAdditionalInfoUI : function(component) {
        //Checking the change event for Config UI
        component.set("v.isStatsExist", false);
        component.set("v.isClubTrackerExist", false);
        component.set("v.isSocialTrackerExist", false);
        
        //Checking the response
        if(component.get("v.configUIData") !=null){
            var tabObject = component.get("v.configUIData").tabs;
            for (var eachtab in tabObject){
                if(tabObject[eachtab].name == "Additional Info"){
                    var configUIObject = tabObject[eachtab].sections;
                    for (var eachObject in configUIObject){
                        if(configUIObject[eachObject].name == "Club Tracker"){
                            component.set("v.isClubTrackerExist", true);
                        }else if(configUIObject[eachObject].name == "Stats"){
                            component.set("v.isStatsExist", true);
                        }else if(configUIObject[eachObject].name == "Social Tracker"){
                            component.set("v.isSocialTrackerExist", true);
                        }
                    }
                }
            }
            console.log(configUIObject);
        }
    },
})