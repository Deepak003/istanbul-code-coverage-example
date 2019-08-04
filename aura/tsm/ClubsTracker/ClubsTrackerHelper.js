({
    formatData : function(cmp) {
        const selectedPersona = cmp.get('v.selectedPersona');
        const historyStats = cmp.get('v.historyStats');
        
        const isValidationPersona = selectedPersona
        && selectedPersona.object 
        && Array.isArray(selectedPersona.object.subEntities) 
        && selectedPersona.object.subEntities.length != 0;
        
        if(isValidationPersona) {      
            cmp.set('v.persona', this.formatClubsDate(selectedPersona.object));
            cmp.set('v.persona.isExpand', true);
            
            const persona = cmp.get('v.persona');            
            cmp.set('v.clubs', persona.subEntities.filter((cl)=>cl.idType=='FUTClub'));
            cmp.set('v.subClubs', persona.subEntities.filter((cl)=>cl.idType=='WCClub'));
        }else {
            cmp.set('v.persona', {});
            cmp.set('v.clubs', []);
            cmp.set('v.subClubs', []);
        }
        
        const isValidHistoryStats = Array.isArray(historyStats)
        && historyStats.length != 0 
        && Array.isArray(historyStats[0].fields)
        && historyStats[0].fields.length !=0 
        && historyStats[0].fields[0].newValue;
        
        if(isValidHistoryStats && isValidationPersona) {
            const persona = cmp.get('v.persona');
            persona.lastUpdatedOn = historyStats[0].fields[0].newValue;            
            cmp.set('v.persona', persona);
        }
    },
    loadBackgroundData : function(cmp) {
        this.getActivateReasons(cmp);
        this.getDeactivateReasons(cmp);
        this.getRestoreReasons(cmp);
    },
    getActivateReasons : function(cmp) {
        const action = cmp.get('c.getAccountStatusActivateReasons');
        action.setCallback(this, function(response){
            if (response.getState() === "SUCCESS") {
                cmp.set('v.activatePersonaModal.reasons', this.formatReasonForComboBox(response.getReturnValue()));
            }else{
                Util.handleErrors(cmp, response);
            }
        });
        $A.enqueueAction(action);
    },
    getDeactivateReasons : function(cmp) {
        const action = cmp.get('c.getAccountStatusDeactivateReasons');
        action.setCallback(this, function(response){
            if (response.getState() === "SUCCESS") {
                cmp.set('v.deAtivePersonaModal.reasons', this.formatReasonForComboBox(response.getReturnValue()));
            }else{
                Util.handleErrors(cmp, response);
            }
        });
        $A.enqueueAction(action);
    },
    getRestoreReasons : function(cmp) {
        const action = cmp.get('c.getRestoreDeletedClubReasons');
        action.setCallback(this, function(response){
            if (response.getState() === "SUCCESS") {
                cmp.set('v.restoreClubModal.reasons', this.formatReasonForComboBox(response.getReturnValue()));
            }else{
                Util.handleErrors(cmp, response);
            }
        });
        $A.enqueueAction(action);
    },
    formatReasonForComboBox : function(list) {
        return list.map((l)=> ({'label': l.name, 'value' : l.id}));
    },
    formatClubsDate : function(persona) {
        persona.subEntities.forEach(function(c){            
            c.dateCreated = Util.getFormattedDateTime(c.dateCreated, 'only-date');
        });
        return persona;
    },
    getRowActions: function (cmp, row, done) {
        var isRestoreClub  = cmp.get('v.hasRestoreClubPermission');
        var isChangeClubName = cmp.get('v.hasChangeClubNamePermission');
        var restoreDisable = true;
        switch(row.status.toLowerCase()) {
            case 'active' :
                //Adding condition for diabled TSM-2577
                if(isChangeClubName && cmp.get("v.productMaskingData.ModifyClub")){
                    isChangeClubName = false;
                }
                return done([
                    { label: 'Change Club Name', name: 'changeClubName', disabled: isChangeClubName}
                ]);
            case 'deleted' :
                //Adding condition for diabled TSM-2577
                if(isRestoreClub && cmp.get("v.productMaskingData.RestoreClub")){
                    restoreDisable = false;
                }
                return done([
                     { label: 'Restore', name: 'restore', disabled: restoreDisable }
                ]);
        }        
    },
    closeModal: function(cmp) {
        // hide loading spinner
        cmp.set('v.isLoading', false);
        
        // clear deactivate modal
        cmp.set('v.deAtivePersonaModal.isOpen', false);
        cmp.set('v.deAtivePersonaModal.reason', null);
        
        // clear activate modal
        cmp.set('v.activatePersonaModal.isOpen', false);                
        cmp.set('v.activatePersonaModal.reason', null);
        
        // clear unlock modal
        cmp.set('v.unlockPersonaModal.isOpen', false);
        
        // clear restore modal
        cmp.set('v.restoreClubModal.isOpen', false);
        cmp.set('v.restoreClubModal.subClub', null);
        cmp.set('v.restoreClubModal.reason', null);

        // clear reset modal        
        cmp.set('v.resetClubLimitModal.isOpen', false);
        
        // clear change name modal
        cmp.set('v.changeClubNameModal.isOpen', false);
    },
    getDefaultPayload: function(cmp) {
        const nucleusId = cmp.get('v.nucleusId');
        const product = cmp.get("v.product") || {};        
        const persona = cmp.get('v.persona') || {};
        const caseId =cmp.get("v.caseId");
        const accountId = cmp.get("v.accountId");
        return {
            "customerId": nucleusId,
            "gamerId": persona.id,
            "gamerIdType": "nucleusPersonaId",
            "productName": product.Url_Name__c,
            "platform": persona.platform,
            "personaName": persona.name,
            "caseId": caseId,
            "accountId": accountId,
            "notes" : "N/A",
            "reason": "N/A",
            "reason": "N/A"
        };        
    },
    /*
    restoreClub: function(cmp) {   
        const defaultPayload = this.getDefaultPayload(cmp);
        
        const targetClub = cmp.get("v.targetClub");        
        const subClub = cmp.get("v.restoreClubModal.subClub");        
        
        const numberOfRequest = [1];
        if(!!subClub) {
            numberOfRequest.push(2);
        }
        
        const self = this; 
        const promises = numberOfRequest.map((i)=> {
            const action = cmp.get('c.restoreDeletedClub');
            const payload = { 
                data : `[{"key":"clubAccountId","value":"${ i==1 ? targetClub.id : subClub }"}]`,
                gameMode: ( i==1 ? 'FUT' : 'WC' ),      
                reason : cmp.get('v.restoreClubModal.reason'),
                updateType: "Deleted Club Restored",
                clubName: targetClub.name
            };
                                   
            action.setParams({
                inputObject : JSON.stringify(Object.assign({}, defaultPayload, payload))
            });
            return new Promise((resolve, reject)=> {
                action.setCallback(this,function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        resolve(response.getReturnValue());
                    }else {
                        reject(response);
                    }
                })
                $A.enqueueAction(action);
            });
        });
        
        cmp.set('v.isLoading', true);
        Promise.all(promises)
            .then($A.getCallback(function([res1, res2]){
                Util.handleSuccess(cmp, res1);
                cmp.getEvent("reloadData").fire();
            })).catch($A.getCallback(function(err){
                Util.handleErrors(cmp, err);
            })).finally($A.getCallback(function(){
                self.closeModal(cmp);   
            }));
    },
    */
    doServerRequest : function(cmp, type) {
        const defaultPayload = this.getDefaultPayload(cmp);
       
        const targetClub = cmp.get("v.targetClub");
        const sourceClub = cmp.get("v.sourceClub");
        const subClub = cmp.get("v.restoreClubModal.subClub");  
        let action;
        
        switch(type) {
            case 'reset-club-limit' :
                Object.assign(defaultPayload, {
                    "updateType": "ResetClubCreationLimit",
                    "data": '[{"statId":"accountResetCount"}]'
                })
                action = cmp.get('c.resetClubLimit');
                break;
            case 'restore-club' :
                Object.assign(defaultPayload, {
                    data : `[{ "key":"clubAccountId","value": "${[targetClub.id,subClub].filter(Boolean).join(',')}" }]`,
                    gameMode: ['FUT', subClub && 'WC'].filter(Boolean).join(),
                    reason : cmp.get('v.restoreClubModal.reason'),
                    updateType: "Deleted Club Restored"
                })                
                action = cmp.get('c.restoreDeletedClub');
                break;
            case 'change-club-name' :
                Object.assign(defaultPayload, {
                     /* removed old club name key from payload{"key":"oldClubName","value":"${sourceClub.name}"}  as it is not required for Sovereign call -- TSM-3721*/ 
                    "data": `[{"key":"clubId","value":"${targetClub.id}"},{"key":"clubName","value":"${targetClub.name}"},{"key":"clubAbbr","value":"${targetClub.name.slice(0,3)}"}]`,
                })
                action = cmp.get('c.changeClubName');
                break;
            case 'deactivate-persona' :        
                Object.assign(defaultPayload, {
                    "reason" : cmp.get('v.deAtivePersonaModal.reason'),
                    "data": `[{"key":"accountStatus","value":"deactivate"}]`
                })
                action = cmp.get('c.deactivateClub');
                break;
            case 'activate-persona' :              
                Object.assign(defaultPayload, {
                    "reason" : cmp.get('v.activatePersonaModal.reason'),
                    "data": `[{"key":"accountStatus","value":"activate"}]`
                })
                action = cmp.get('c.activateClub');
                break;                
            case 'unlock-persona' :              
                Object.assign(defaultPayload, {                    
                    "data": `[{"key":"lockStatus","value":"false"}]`
                })
                action = cmp.get('c.unlockClub');
                break;
        }
        
        action.setParams({
            inputObject : JSON.stringify(defaultPayload)
        });
        
        cmp.set('v.isLoading', true);        
        action.setCallback(this,function(response) {
            cmp.set('v.isLoading', false);
            
            // close modal
            this.closeModal(cmp);
            
            var state = response.getState();
            if (state === "SUCCESS") {              
                // toast success message
                Util.handleSuccess(cmp, response.getReturnValue());
                
                // fire component event
                if(type == 'reset-club-limit'){
                    cmp.getEvent("onResetClubLimit").fire();
                }else {
                    //TSM - 4025
                    var reloadEvent = cmp.getEvent("reloadData");
                    //adding type for blocking tab change
                    if(type == 'change-club-name'){
                        reloadEvent.setParams({ "type" : 'change-club-name'});
                    }
                    reloadEvent.fire();   
                }                
            }else {
                Util.handleErrors(cmp, response);
            }
        })        
        $A.enqueueAction(action);        
    },
     
    setJobrolePermissions : function(component){
        if(window.permissionsList){           
            if(window.permissionsList.includes('restore club')){
                component.set('v.hasRestoreClubPermission', true);
            }
            if(window.permissionsList.includes('change fut club name')){
                component.set('v.hasChangeClubNamePermission', true);
            }
            if(window.permissionsList.includes('activate deactivate persona')){
                component.set('v.hasPersonaEditPermission', true);
            }
            if(window.permissionsList.includes('club creation limit reset')){
                component.set('v.hasResetClubLimitPermission', true);
            }
        }        
    },
})