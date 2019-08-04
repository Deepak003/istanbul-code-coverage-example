({
	closeModal: function(component) {
        component.set('v.modalData', {});
    },
    doReset: function(component) {
        const parentRow = component.get('v.parentRow');
        
        let selectedModeType = component.get('v.modeType');
        
        switch(selectedModeType.toLocaleLowerCase()){
            case 'online':
                selectedModeType = "0";
                break;
            default:
                selectedModeType = "1";
        }
        
        let gamerId,productName,platform,gameMode;
        
        try{
            gamerId = component.get("v.selectedPersona.object.id") || component.get("v.selectedPersona.object.uid");
            productName = component.get("v.selectedProduct.Url_Name__c");
            platform = component.get("v.selectedPersona.object.platform")
            gameMode = component.get("v.selectedPersona.gameMode").replace('Club','');
        }catch(err){
            console.error(err);
        }
        
        const action = component.get("c.resetDraft");        
        action.setParams({
            inputMap : {
                gamerId: gamerId,
                gamerIdType: "nucleusPersonaId",
                caseId:component.get("v.caseId"),
                productName: productName,
                platform: platform,
                gameMode: gameMode,
                draftMode: selectedModeType,
                accountId: component.get("v.accountId"),
                nucleusId: component.get("v.nucleusId")
            }
        });
        
        component.set("v.isLoading", true);
        action.setCallback(this, function(response) {
            component.set("v.isLoading", false);
            this.closeModal(component);
            const state = response.getState();
            if (state === "SUCCESS") {
		        Util.handleSuccess(component, response.getReturnValue());
            }
            else {
                Util.handleErrors(component, response);
            }
        });
        $A.enqueueAction(action);
    }
})