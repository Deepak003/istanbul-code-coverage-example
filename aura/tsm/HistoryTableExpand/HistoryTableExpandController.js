({
    doInit : function(component, event, helper) {        
        // set coulumn headers
        const colHeadersTrade = [
            {label: 'TITLE', fieldName: 'title'},
            {label: 'TYPE', fieldName: 'type'},
            {label: 'STATUS', fieldName: 'status', cellAttributes: { alignment: 'left', class: 'status-badge' } }
        ];
        const colHeadersReward = [
            {label: 'TITLE', fieldName: 'itemName', cellAttributes: { class: 'tsm-table-row' } },
            {label: 'TYPE', fieldName: 'itemType'},
            {label: 'STATUS', fieldName: 'status', cellAttributes: { alignment: 'left', class: 'status-badge' } }
        ]
        component.set('v.rewardColumns', colHeadersReward); 
        component.set('v.tradeColumns', colHeadersTrade); 
        
        const rows = component.get('v.rows');
        component.set('v.formattedRows', helper.setHelperData(component, rows));
    },
    toggleExpand: function(component, event, helper) {
        const index = event.currentTarget.dataset.index;
        helper.toggleRow(component, index);
    },
    onClickViewHistory: function(component, event, helper) {        
        const evt = component.getEvent("onClickViewHistory");
        
        try {
            const index = event.getSource().get("v.value");
            const targetRow = component.get('v.rows')[index];
            
            const details = targetRow.data.find((r)=>r.label == "details").value;
            
            const data = {};
            
            try {
                data.fromDate = details.find((d)=>d.key == 'Start Date').value;             
            } catch(err){}
            
            try {            
                data.toDate = details.find((d)=>d.key == 'End Date').value;       
            } catch(err){}
            
            
            evt.setParam('data', data);
            
        } catch(err) { }
        
        
        evt.fire();
        
    },
    onClickViewTeam: function(component, event, helper) {
        const index = event.getSource().get("v.value");
        const targetRow = component.get('v.formattedRows')[index];
        component.set('v.targetedRow', targetRow);
        component.set('v.viewTeamModal.isOpen', true);
    },
    onClickReset: function(component, event, helper) {
        const index = event.getSource().get("v.value");
        const targetRow = component.get('v.formattedRows')[index];
        component.set('v.targetedRow', targetRow);
        component.set('v.resetModal.isOpen', true);
    },
    onClickGrantHistory: function(component, event, helper) {
        const index = event.getSource().get("v.value");
        var grantArray = component.get('v.formattedRows')[index];
        
        //Publishing event to history tab to handle the change
        var componentEvent = component.getEvent("onChangeArrayList");
        componentEvent.setParam("type", "individualGrantInitilized");
        componentEvent.setParam("selectedArray", grantArray);
        componentEvent.fire(); 
    },
    //Function to load the list of grant
    grantCheckChange: function(component, event, helper) {
        var grantCheckList = component.find("grant-check");
        var formattedRows = component.get("v.formattedRows");
        var grantArray = [];
        //Checking for the list length
        if(grantCheckList.length > 0){
            //Looping through checkbox to prepare the list
            for(var eachObject in grantCheckList) {
                if(grantCheckList[eachObject].get("v.checked")){
                    var currentIndex = grantCheckList[eachObject].get("v.id");               
                    grantArray.push(formattedRows[currentIndex]);
                }
            }            
        }else{
            if(grantCheckList.get("v.checked")){
                grantArray.push(formattedRows[0]);
            }
        }
        //Publishing event to history tab to handle the change
        var componentEvent = component.getEvent("onChangeArrayList");
        componentEvent.setParam("type", "arrayListChanged");
        componentEvent.setParam("selectedArray", grantArray);
        componentEvent.fire();  
    },
    //Function to open History Grant
    onClickHistoryGrant: function(component, event, helper) {
        //Closing open if any
        component.set('v.resetModal.isOpen', false);
        component.set('v.viewTeamModal.isOpen', false);
        
        //Opening the grant history
        component.set('v.openHistoryGrant', true);
    },
    //TSM-2277 - Resetting the History grant data
    handleExternalDataChange: function(component, event, helper) {
        var externalData = component.get("v.externalData");
        if(externalData["globalSelectionArray"].length == 0){
            try{
                var grantCheckList = component.find("grant-check");
                if(grantCheckList != undefined){
                    //Checking for the list length
                    if(grantCheckList.length > 0){
                        //Looping through checkbox to prepare the list
                        for(var eachObject in grantCheckList) {
                            grantCheckList[eachObject].set("v.checked", false);
                        }            
                    }else{
                        grantCheckList.set("v.checked", false);
                    }
                }
            }catch (exception){
                console.log("Reset Grant Error");
            }      
        }
        if(externalData.caseId){
            component.set("v.caseId", externalData.caseId);
        }
        if(externalData.accountId){
            component.set("v.accountId", externalData.accountId);
        }
        if(externalData.nucleusId){
            component.set("v.nucleusId", externalData.nucleusId);
        }
    },
    //TSM-2813 Handling the click for pagination
    loadPaginationData: function(component, event, helper) {
        var currentValue = event.getSource().get("v.value");
        
        //Publishing event to history tab to handle the pagination
        var componentEvent = component.getEvent("onClickPagination");
        componentEvent.setParam("lastData", currentValue);
        componentEvent.fire(); 
    },
})