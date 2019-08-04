({    
    doInit: function (cmp, event, helper) {
        helper.setJobrolePermissions(cmp);
        const actions = helper.getRowActions.bind(this, cmp);
        cmp.set('v.columns', [
            { label: 'CLUB NAME', fieldName: 'name', type: 'text', cellAttributes: {  
                class: 'tsm-table-row'
            }},
            //{ label: 'TYPE', fieldName: 'idType', type: 'text' },
            //{ label: 'ID', fieldName: 'id', type: 'text' },
            { label: 'STATUS', fieldName: 'status', type: 'text', cellAttributes: {  
                class:{
                    fieldName:"status"
                }
            }
            },
            { label: 'CREATION DATE', fieldName: 'dateCreated', type: 'text' },
            { type: 'action', typeAttributes: { rowActions: actions } }
        ]);
        helper.formatData(cmp);
        helper.loadBackgroundData(cmp);
    },
    handleRefresh: function (cmp, event, helper) {
        helper.formatData(cmp);
    },
    handleActionMenuSelect: function (cmp, event, helper) {
        switch(event.getParam("value")) {
            case 'deactivate':
                cmp.set('v.deAtivePersonaModal.isOpen', true);
                break;
            case 'activate':
                cmp.set('v.activatePersonaModal.isOpen', true);
                break; 
            case 'unlock':
                cmp.set('v.unlockPersonaModal.isOpen', true);
                break;
        }
    },
    handleRowAction: function (cmp, event, helper) {
        const action = event.getParam('action');
        const row = event.getParam('row');
        
        // set target club by cloning club object
        cmp.set('v.targetClub', JSON.parse(JSON.stringify(row)));
        
        // set subClubsDropdown for restore modal
        cmp.set('v.restoreClubModal.subClubsDropdown', 
               cmp.get('v.subClubs')
                .filter((club)=>club.status=='deleted')
                .map((club)=>({'label': club.name, 'value' : club.id})) 
               ); 
        
        switch (action.name) {
            case 'changeClubName':
                //set source club by cloning club object to retain oldname of the club
        		cmp.set('v.sourceClub', JSON.parse(JSON.stringify(row)));
                cmp.set('v.changeClubNameModal.isOpen', true);
                break;
            case 'restore':
                cmp.set('v.restoreClubModal.isOpen', true);              
                break;                
        }
    },
    openResetClubLimitModal: function (cmp, event, helper) {
        cmp.set('v.resetClubLimitModal.isOpen', true);
    },
    toggleExpand: function(cmp, event, helper) {
        cmp.set('v.persona.isExpand', !cmp.get('v.persona.isExpand')); 
    },
    stopClickPropagation : function (cmp, event, helper) {
        event.stopPropagation(); event.preventDefault();
    },
    closeModal: function(cmp, event, helper) {
        helper.closeModal(cmp);
    },
    handleReasonChangeForDeactivatePersona: function (cmp, event, helper) {
        cmp.set('v.deAtivePersonaModal.reason', event.getParam("value"));
    },
    handleReasonChangeForActivePersona: function (cmp, event, helper) {
        cmp.set('v.activatePersonaModal.reason', event.getParam("value"));
    },
    handleReasonChangeForRestoreClub: function (cmp, event, helper) {
        cmp.set('v.restoreClubModal.reason', event.getParam("value"));
    },
    handleSubClubChange: function (cmp, event, helper) {
        cmp.set('v.restoreClubModal.subClub', event.getParam("value"));
    },
    
    onClickActivate : function(cmp, event, helper) {
        helper.doServerRequest(cmp, 'activate-persona');
    },
    onClickDeactivate : function(cmp, event, helper) {
        helper.doServerRequest(cmp, 'deactivate-persona');
    },
    onClickChangeClubNameSave : function(cmp, event, helper) {
        helper.doServerRequest(cmp, 'change-club-name');
    },
    onClickReset : function(cmp, event, helper) {
        helper.doServerRequest(cmp, 'reset-club-limit');
    },
    onClickRestore : function(cmp, event, helper) {
        // helper.restoreClub(cmp);
        helper.doServerRequest(cmp, 'restore-club');
    },
    onClickUnlock :  function(cmp, event, helper) {
        helper.doServerRequest(cmp, 'unlock-persona');
    }   
})