({
    init: function(component, event, helper) {
        setTimeout(function() { 
            component.set('v.filteredRows', component.get('v.rows'));
        }, 100);
		helper.setList(component,event,helper);
    },
    setSelection: function(component,event,helper) {
        var rows = component.get('v.rows'),
            filRecords = component.get('v.filteredRows');
        if (rows.length) {
            component.set('v.filteredRows', rows);
        }
        
        var params = event.getParam('arguments');
        var pk = params.Id;
        if (window.recordId) {
            pk = window.recordId;
        }
        var targets = component.find("datarow");
        for (var i=0; i<targets.length; i++) {
            if (targets[i].getElement().getAttribute('data-pk') == pk) {
                console.log('called');
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
    
    expandClick: function(component, event, helper) {
        if (event.currentTarget.parentElement.parentElement.parentElement) {
            //var caseNoteCmp = component.find('case-notes'),
               var rowId = event.currentTarget.getAttribute('data-row'),
                caseId = event.currentTarget.getAttribute('data-pk'); 
            if (!$A.util.hasClass(event.currentTarget.parentElement.parentElement.parentElement,'slds-is-open')) {                                   
                //caseNoteCmp[rowId].set('v.caseId', caseId);
                //caseNoteCmp[rowId].getCaseNote();
            }else {
                //caseNoteCmp[rowId].set('v.viewAllFlag', false);
            }
            //Toggle between icons
            var upIcon = component.find('upIcon');
            var downIcon = component.find('downIcon');
            if(downIcon[rowId]!=undefined){
                $A.util.toggleClass(downIcon[rowId],'slds-hide');
                $A.util.toggleClass(downIcon[rowId],'slds-show');
            }else{
                $A.util.toggleClass(downIcon,'slds-hide');
                $A.util.toggleClass(downIcon,'slds-show');
            }
            
            if(upIcon[rowId]!=undefined){
                $A.util.toggleClass(upIcon[rowId],'slds-show');
                $A.util.toggleClass(upIcon[rowId],'slds-hide');
            }else{
                $A.util.toggleClass(upIcon,'slds-show');
                $A.util.toggleClass(upIcon,'slds-hide');
            }
            $A.util.toggleClass(event.currentTarget.parentElement.parentElement.parentElement,'slds-is-open');
        }        
    },
	editPersonaDetail: function(component, event, helper) {
        var rowData = event.getSource().get('v.value');
        console.log('rowData--',rowData,'typeOf--',typeof rowData);
        component.set("v.selectedRow", rowData.data);
        component.set("v.primaryState",rowData.data[3].value );
        
        component.set("v.currentPersona",rowData);
        component.set("v.editPersonaModal",true);
        var name=component.find("personaEdit")[0].get("v.value"),
            status=component.find("personaEdit")[1].get("v.value"),
            banCatgry = component.find("personaEdit")[2].get("v.value"),
            reason=component.find("personaEdit")[3].get("v.value");
        if(name!=''&&status!=''&&banCatgry!=''&&reason!=''){
            component.set("v.isSuccessDisable",false);
        }else{
            component.set("v.isSuccessDisable",true);
        }
    },
    openDeleteModal:function(component,event,helper){
        component.set("v.deletePersonaModal",true);
        //console.log('name ::', component.find("personaName").get("v.value"))
        var rowData = event.getSource().get('v.value');
        console.log('rowData--',rowData,'typeOf--',typeof rowData);
        component.set("v.selectedRow", rowData.data);
        component.set("v.primaryState",rowData.data[3].value );
        
        component.set("v.currentPersona",rowData);
    },
    handleDelPersona:function(component, event, helper) {
        component.set("v.openSpinner",true);
    	helper.deleteSelectedPersona(component,event,helper);
    },
    updatePersonaDetails: function(component, event, helper) {
        component.set("v.openSpinner",true);
        helper.updatePersona(component,event,helper);
    },
    handleStatechange: function(component,event,helper){
        var currentState = event.getParam('value');
        console.log('currentState::',currentState);
        
        
        var name=component.find("personaEdit")[0].get("v.value"),
            status=component.find("personaEdit")[1].get("v.value"),
            banCatgry = component.find("personaEdit")[2].get("v.value"),
            reason=component.find("personaEdit")[3].get("v.value");
        if(name!=''&&status!=''&&banCatgry!=''&&reason!=''){
            component.set("v.isSuccessDisable",false);
        }else{
            component.set("v.isSuccessDisable",true);
        }
    },
    handleBanChange: function(component,event,helper){
        var currentBan = event.getParam('value');
        component.set("v.primaryBanState",currentBan);
        console.log('currentBan::',currentBan);
        var name=component.find("personaEdit")[0].get("v.value"),
            status=component.find("personaEdit")[1].get("v.value"),
            banCatgry = component.find("personaEdit")[2].get("v.value"),
            reason=component.find("personaEdit")[3].get("v.value");
        if(name!=''&&status!=''&&banCatgry!=''&&reason!=''){
            component.set("v.isSuccessDisable",false);
        }else{
            component.set("v.isSuccessDisable",true);
        }
    },
    handleReasonChange: function(component,event,helper){
        var currentReason = event.getParam('value');
        component.set("v.primaryReasonCode",currentReason);
        console.log('currentReason::',currentReason );
        var name=component.find("personaEdit")[0].get("v.value"),
            status=component.find("personaEdit")[1].get("v.value"),
            banCatgry = component.find("personaEdit")[2].get("v.value"),
            reason=component.find("personaEdit")[3].get("v.value");
        if(name!=''&&status!=''&&banCatgry!=''&&reason!=''){
            component.set("v.isSuccessDisable",false);
        }else{
            component.set("v.isSuccessDisable",true);
        }
    },
	 closeEditModal: function(component,event,helper){
        component.set("v.editPersonaModal",false);
        component.find("personaEdit")[0].set("v.value",'');
        component.find("personaEdit")[1].set("v.value",'');
        component.find("personaEdit")[2].set("v.value",'');
        component.find("personaEdit")[3].set("v.value",'');
        
    },
    closedeleteModal: function(component,event,helper){
        component.set("v.deletePersonaModal",false);
    },
    handleNameChange:function(component,event,helper){
        var name=component.find("personaEdit")[0].get("v.value"),
            status=component.find("personaEdit")[1].get("v.value"),
            banCatgry = component.find("personaEdit")[2].get("v.value"),
            reason=component.find("personaEdit")[3].get("v.value");
        if(name!=''&&status!=''&&banCatgry!=''&&reason!=''){
            component.set("v.isSuccessDisable",false);
        }else{
            component.set("v.isSuccessDisable",true);
        }
    }
})