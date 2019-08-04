({
    init: function(component, event, helper) {
        component.set('v.highlightRow' , false);
        var filterRows = component.get('v.filteredRows'),
            filterFlag = component.get('v.filterFlag'),
            dataRows = component.get('v.rows'),
            mpermsList = [];  
        
        component.set('v.filteredRows', dataRows);
        // Check permissions , v.massCasePerms)
        if (window.permsList) {
	        window.permsList.find(function(perms) {
	        	if (perms.includes('mass')) {
	        		mpermsList.push(perms);
	        	}
	        });
	        if (mpermsList && mpermsList.length) {
	        	component.set('v.massCasePerms', true);
	        	component.set('v.massCasePermsClass', ' mass-case');
	        }
	        else {
	        	component.set('v.massCasePerms', false);
	        	component.set('v.massCasePermsClass', '');
	        }
        }
    },
    onRowClick : function(component, event, helper) {
		var massActionCaseIds = [];
        massActionCaseIds = component.get('v.checkedItems');
        if(massActionCaseIds.length > 0){
            return;
        }
        var checkedItems = component.get('v.checkedItems');
        var target = event.currentTarget;
        var caseId = target.getAttribute('data-pk');       
        var appEvent = $A.get("e.c:DataGridRowClickApp");        
        var compEvent = component.getEvent("rowclick");
        compEvent.setParams({
            pk : caseId,                
            domEl: target
        });
        compEvent.fire();                    
        if (appEvent != undefined) {
            appEvent.setParams({
                pk : caseId,                    
                domEl: target
            });
        appEvent.fire();
            // Application Event Fire
        }      
        helper.setSelectedRow(component,target);                       
    },
    
    setSelection: function(component,event,helper) {
        var rows = component.get('v.rows'),
            filRecords = component.get('v.filteredRows'),
            pk = '',
            domRecs = [];
        
        if (window.domRecordsList ) {//&& window.domRecordsList.length
            for(var item of rows) {
                if (item.pk && window.domRecordsList.includes(item.pk) > 0) {
                    domRecs.push(item);
                }
            }    
        }
        else if(!window.domRecordsList) {
            domRecs = rows;
            //if (rows && rows.length && rows[0]) {
            //    window.recordId = rows[0].pk;
            //}
        }
        
        if (domRecs.length) {
            component.set('v.filteredRows', domRecs);
        }        
        
        try {
            var params = event.getParam('arguments');
        	var pk = params.Id;
        }
        catch(error) {}
        if (window.recordId) {
            pk = window.recordId;
        }
        var targets = component.find("datarow");
        for (var i=0; i<targets.length; i++) {
            if (targets[i].getElement().getAttribute('data-pk') == pk) {
                console.log('called');
                component.set('v.highlightRow' , true);
                helper.setSelectedRow(component,targets[i]);
                break;
            }
        }     
    },
    
    sortAsc: function(component, event, helper) {
        helper.sortRows(component, event, 'asc');
    },
    
    sortDesc: function(component, event, helper) {
        helper.sortRows(component, event, 'desc');
    },   
    
    getFilterSelectEvt: function(component, event, helper) {
        var params = event.getParams('arguments');        
        event.stopPropagation();
        helper.filterRows(component, event, params);
    },   
    
    getNextRowClickEvent: function(component, event, helper) {        
        if (event.getParam("gNxtFlag")) {
            window.recordId = event.getParam("pk");
            $A.enqueueAction(component.get('c.setSelection'));
			var target = event.currentTarget,
				pk = event.getParam("pk"),
				// targets = component.find("datarow"),
				appEvent = $A.get("e.c:DataGridRowClickApp"),        
				compEvent = component.getEvent("rowclick");
			
			compEvent.setParams({
				pk : window.recordId,                
				domEl: target
			});
			compEvent.fire();                    
			if (appEvent != undefined) {
				appEvent.setParams({
					pk : window.recordId,                    
					domEl: target
				});
				appEvent.fire();
			}
					// Application Event Fire             
		}
		else {
				window.recordId = '';
		}
    },
    
    //Mass action - THOR-486,483,92 START
    selectedAllPetitions: function(component, event, helper) {
        var selectedHeaderCheck = event.getSource().get("v.value");
        var allSelectedRowIds = [];
        var getAllId = component.find("petitionPack");
        var allRows = component.find("datarow");
        component.set('v.firstSelect',-1);
        component.set('v.secondSelect',-1);
        if(component.find("petitionPack") && getAllId.length && allRows){
            if(!Array.isArray(getAllId)){
                if(selectedHeaderCheck == true){
                    component.find("petitionPack").set("v.value", true);
                    component.set("v.selectedCount", 1);
                }
                else
                {
                    component.find("petitionPack").set("v.value", false);
                    component.set("v.selectedCount", 0);
                }
            }
            else
            {
                if (selectedHeaderCheck == true) {
                    for (var i = 0; i < getAllId.length; i++) {
                        //select all the items
                        component.find("petitionPack")[i].set("v.value", true);
                        allSelectedRowIds.push(allRows[i].getElements()[0].dataset.pk);
                       // allRows[i].getElement().setAttribute('id','checkbox-select');
                    }
                }
                else
                {
                    allSelectedRowIds = [];
                    for (var i = 0; i < getAllId.length; i++) {
                        //unselect all the items
                        component.find("petitionPack")[i].set("v.value", false);
                       // allRows[i].getElement().setAttribute('id','checkbox-select');
                    }
                }
                
            }
        }
        component.set('v.checkedItems',allSelectedRowIds);
        helper.fireMassActionEvent(component,event);
    },
    
    singlePetitionSelected: function(component, event, helper) {
        var caseToggleVal = event.getSource().get("v.value"),
            currentCaseId = event.getSource().get("v.name"),
            selectedCaseIds = component.get('v.checkedItems'),
            headerBox = component.find("headerBox"),
        	allRows = component.find("datarow");
        if(headerBox.get("v.value")){
            headerBox.set("v.value",false);
        }
        if(caseToggleVal){ //selecting the current item
            if(!selectedCaseIds.includes(currentCaseId)){
                selectedCaseIds.push(currentCaseId);
            }
        }
        else{//unselecting the current item
            var index = selectedCaseIds.indexOf(currentCaseId);
            if (index > -1) {
                selectedCaseIds.splice(index, 1);
            }
        }
        component.set('v.checkedItems',selectedCaseIds);
        helper.fireMassActionEvent(component,event);
        if(component.get('v.checkedItems') && allRows.length == component.get('v.checkedItems').length){//Checked all boxes manually
            if(!headerBox.get("v.value")){
                headerBox.set("v.value",true);
            }
        }
        if(allRows){
            for (var i = 0; i < allRows.length; i++) {
                if(allRows[i].getElement().getAttribute('data-pk') == currentCaseId){
                    component.set('v.firstSelect',i);
                }
            } 
        }
    },
    
    onmouseclick: function(component, event, helper) {
        //performing this event only when shift key is active selection of cases a deck
        if(event.shiftKey){
            var headerBox = component.find("headerBox"),
                getAllId = component.find("petitionPack"),
				allRows = component.find("datarow"),
                caseSelected = event.currentTarget.getAttribute('id'),
                currentSeqIdOfItem = event.currentTarget.getAttribute('data-row'),
                firstSelect = component.get('v.firstSelect'),
                secondSelect = component.get('v.secondSelect'),
                checkFlag = false,
                shiftSelectedIds = component.get('v.checkedItems');
            if(headerBox.get("v.value")){
                    headerBox.set("v.value",false);
            }
            if(firstSelect < 0){
                component.set('v.firstSelect',currentSeqIdOfItem);
                firstSelect = component.get('v.firstSelect');
                if(component.find("petitionPack")[currentSeqIdOfItem].get("v.value")){
                    component.find("petitionPack")[currentSeqIdOfItem].set("v.value",false);
                }
                else{
                    component.find("petitionPack")[currentSeqIdOfItem].set("v.value",true);
                }
            }
            else{
                component.set('v.secondSelect',currentSeqIdOfItem);
                secondSelect = component.get('v.secondSelect');
            }
            if(component.find("petitionPack")[currentSeqIdOfItem].get("v.value")){
                checkFlag = "uncheck";
            }
            else{
                checkFlag = "check";
            }
            if(firstSelect>=0 && secondSelect>=0){
                for (var i = 0; i < getAllId.length; i++) {
                    if((i>=firstSelect && i<=secondSelect) || (i>=secondSelect && i<=firstSelect)){
                        var currentCaseId = component.find("petitionPack")[i].get("v.name");
                        if(checkFlag == "uncheck"){
                            component.find("petitionPack")[i].set("v.value",false);
                            var index = shiftSelectedIds.indexOf(currentCaseId);
                            if (index > -1) {
                                shiftSelectedIds.splice(index, 1);
                            }
                        }
                        else if(checkFlag == "check"){
                            component.find("petitionPack")[i].set("v.value",true);
                            if(!shiftSelectedIds.includes(currentCaseId)){
                                    shiftSelectedIds.push(currentCaseId);
                            }
                        }
                    }
                } 
                component.set('v.firstSelect',secondSelect);
                component.set('v.checkedItems',shiftSelectedIds);
                helper.fireMassActionEvent(component,event);
				if(component.get('v.checkedItems') && allRows.length == component.get('v.checkedItems').length){//Checked all boxes manually
                    if(!headerBox.get("v.value")){
                        headerBox.set("v.value",true);
                    }
                }
            }
        }
    },
    
    massActionHandler: function(component, event, helper) {
        //mass action handler - unchecking the header box once the mass action is complete successfully 
        var headerBox = component.find("headerBox");
        var evType = event.getParam('eventType');
		var getAllId = component.find("petitionPack");											  
        if(headerBox){
            if(evType == "endMassAction"){
                if(headerBox.get("v.value")){
                    headerBox.set("v.value",false); 
                }
            }
            else if(evType == "cancelMassAction"){
                if(getAllId) { 
                for (var i = 0; i < getAllId.length; i++) {
                        //unselect all the items on mass case action cancel op
                        component.find("petitionPack")[i].set("v.value", false);
                    }
				}
                headerBox.set("v.value",false); 
				component.set('v.checkedItems',[]);
            }
        }  
    },
    
    //Mass action - THOR-486,483,92 END
    
    onRowDblClick: function(component, event, helper) {
		var massActionCaseIds = [];
        massActionCaseIds = component.get('v.checkedItems');
        if(massActionCaseIds.length > 0){
            return;
        }
        var target = event.currentTarget,
        	caseId = target.getAttribute('data-pk');
    },
})