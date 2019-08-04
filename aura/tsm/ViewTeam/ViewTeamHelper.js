({
    fetchTeamMembers : function(component) {
        const parentRow = component.get('v.parentRow');
        
        let gamerId,productName,platform,gameMode,draftInstanceId;
        
        try{
            gamerId = component.get("v.selectedPersona.object.id") || component.get("v.selectedPersona.object.uid");
            productName = component.get("v.selectedProduct.Url_Name__c");
            platform = component.get("v.selectedPersona.object.platform")
            gameMode = component.get("v.selectedPersona.gameMode").replace('Club','');
            draftInstanceId = parentRow.data.find((d)=>d.label == "draftInstanceId").value;	
        }catch(err){
            console.error(err);
        }
                
        const action = component.get("c.getDraftTeams");        
        action.setParams({
            inputMap : {
                gamerId: gamerId,
                gamerIdType: "nucleusPersonaId",
                productName: productName,
                platform: platform,
                gameMode: gameMode,
                draftInstanceId: draftInstanceId
            }
        });
        
        component.set("v.isLoading", true);
        action.setCallback(this, function(response) {
            component.set("v.isLoading", false);
            const state = response.getState();            
            if (state === "SUCCESS") {
                component.set('v.rows', response.getReturnValue());             
            }
            else {
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    }
})