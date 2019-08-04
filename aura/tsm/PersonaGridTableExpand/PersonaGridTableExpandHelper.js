({
    sortRows: function(component, event, order) {
        var rows = component.get('v.filteredRows'),
            target = event.currentTarget,
            sibling = order == 'desc' ? target.nextSibling : target.previousSibling,
            index = target.getAttribute('data-index'),
            orderFlag = order == 'desc' ? -1 : 1;
        $A.util.toggleClass(target, 'slds-hide');
        $A.util.toggleClass(sibling, 'slds-hide');
        rows.sort(function (a, b) {
            var labelA = a.data[index].value.toUpperCase(),
                labelB = b.data[index].value.toUpperCase(),
                comparison = 0;
            if (labelA > labelB) {
                comparison = 1;
            } else if (labelA < labelB) {
                comparison = -1;
            }
            return comparison * orderFlag;
        });
        component.set('v.filteredRows', rows);
    },
	setList:function(component, event, helper) {
        var jsonStr ;
        var action = component.get("c.getPersonaReasonCodes");
        action.setParams({
            nucleusID: component.get("v.nucleusId")
        });
        action.setCallback(this,function(response){
            if(response.getReturnValue()!=null){
                console.log("persona Response ::", response.getReturnValue());
                jsonStr= response.getReturnValue();
                var stringifiedJson = jsonStr;
                var parsedJson= JSON.parse(stringifiedJson);
                var jsonPersonaList = parsedJson.response.personaStatusList;
                var jsonReasonCodes = parsedJson.response.personaReasonCodesList;
                var jsonBanCategory = parsedJson.response.personaBanCategoryList;
                var personaStatuses = [];
                for(var i=0;i<jsonPersonaList.length;i++){
                    if(jsonPersonaList[i]!='PENDING'){
                        personaStatuses.push(jsonPersonaList[i]);
                    }
                }
				
                var personaStatusList = Object.keys(personaStatuses).map(function(key){
                    var key1 = personaStatuses[key].charAt(0).toUpperCase() + personaStatuses[key].slice(1).toLowerCase(); //capitalize starting letter and remove caps of other letters
                    var reasonLabelKey = key1.replace(/_/g, " "); //replacing underscores with spaces 
                    return {label: reasonLabelKey, value: personaStatuses[key]}
                });
                var personaReasonList = Object.keys(jsonReasonCodes).map(function(key){
                    var key1 = jsonReasonCodes[key].charAt(0).toUpperCase() + jsonReasonCodes[key].slice(1).toLowerCase(); //capitalize starting letter and remove caps of other letters
                    var reasonLabelKey = key1.replace(/_/g, " "); //replacing underscores with spaces 
                    return {label: reasonLabelKey, value: jsonReasonCodes[key]}
                });
                var personaBanList = Object.keys(jsonBanCategory).map(function(key){
                    var key1 = jsonBanCategory[key].charAt(0).toUpperCase() + jsonBanCategory[key].slice(1).toLowerCase(); //capitalize starting letter and remove caps of other letters
                    var reasonLabelKey = key1.replace(/_/g, " "); //replacing underscores with spaces 
                    return {label: reasonLabelKey, value: jsonBanCategory[key]}
                });
                
                component.set("v.reasonCodes",personaReasonList);
                component.set("v.banCategory",personaBanList);
                component.set("v.personaStatus",personaStatusList);
            }
        });
        $A.enqueueAction(action);
    },
    updatePersona: function(component,event,helper){
        var action=component.get("c.editPersona");
        var currentRow = component.get("v.currentPersona");
        var requestObject ={};
        var data = {};
        var personaProperties={};
        var refreshEvent = component.getEvent("refreshPersonaGrid");
        var toastEvent = $A.get("e.force:showToast");
        var toastEventPartialSuccess = $A.get("e.force:showToast");
        requestObject['accountId']=component.get("v.caseObj").AccountId;
        requestObject['caseId']=component.get("v.caseObj").Id;
        requestObject['customerId']=component.get("v.nucleusId");
        data['name']=component.find("personaEdit")[0].get("v.value");
        data['id']=currentRow.pk;
        data['userId']=component.get("v.nucleusId");
        data['statusReasonCode']='';
        data['status']=component.get("v.primaryState");
        data['showPersona']=currentRow.rowData.showPersona;
        personaProperties['personaId']=currentRow.pk;
        // data['personaProperties']=JSON.stringify(personaProperties);
        data['personaId']=currentRow.pk;
        data['namespaceName']=currentRow.rowData.namespaceName;
        data['lastAuthenticated']=currentRow.rowData.lastAuthenticated;
        data['displayName']=component.find("personaEdit")[0].get("v.value");
        data['dateCreated']=currentRow.rowData.dateCreated;
        data['banCategory']=component.get("v.primaryBanState");
        requestObject['data']=JSON.stringify(data);
        console.log('requestObject ::',requestObject);
        
        action.setParams({
            reqParameters:requestObject
        });
        action.setCallback(this,function(response){
            
            console.log('state ::', response.getState(), 'returnValue ::', response.getReturnValue(), 'error message ::',response.getError());
            if(response.getState()==='SUCCESS'){
                component.set("v.openSpinner",false);
                component.set("v.editPersonaModal",false);
                component.find("personaEdit")[0].set("v.value",'');
                component.find("personaEdit")[1].set("v.value",'');
                component.find("personaEdit")[2].set("v.value",'');
                component.find("personaEdit")[3].set("v.value",'');
                refreshEvent.fire();
                toastEvent.setParams({
                    "type":'success',
                    "message": "Persona Details Successfully updated.",
                    
                });
                toastEvent.fire();
            }
            else if(response.getState()==='ERROR'){
                var errorMsg = response.getError()[0].message;
                console.log('errorMsg when edited::',errorMsg);
				component.set("v.openSpinner",false);
                component.set("v.editPersonaModal",false);
                component.find("personaEdit")[0].set("v.value",'');
                component.find("personaEdit")[1].set("v.value",'');
                component.find("personaEdit")[2].set("v.value",'');
                component.find("personaEdit")[3].set("v.value",'');
                    toastEvent.setParams({
                        "type":'error',
                        "message": "Something went wrong.Please contact your IT."//response.getError()
                    });
                toastEvent.fire();
			}
        });
        $A.enqueueAction(action);
    },
    deleteSelectedPersona: function(component,event,helper){
        var action=component.get("c.deletePersona");
        var currentRow = component.get("v.currentPersona");
        var requestObject ={};
        var data = {};
        var personaProperties={};
        var toastEvent = $A.get("e.force:showToast");
        var refreshEvent = component.getEvent("refreshPersonaGrid");
        var toastPartialSuccess = $A.get("e.force:showToast");
        requestObject['accountId']=component.get("v.caseObj").AccountId;
        requestObject['caseId']=component.get("v.caseObj").Id;
        requestObject['customerId']=component.get("v.nucleusId");
        //data['name']=component.find("personaName").get("v.value");
        data['id']=currentRow.pk;
        data['userId']=component.get("v.nucleusId");
        data['statusReasonCode']=component.get("v.primaryReasonCode");
        data['status']=component.get("v.primaryState");
        data['showPersona']=currentRow.rowData.showPersona;
        personaProperties['personaId']=currentRow.pk;
        // data['personaProperties']=JSON.stringify(personaProperties);
        data['personaId']=currentRow.pk;
        data['namespaceName']=currentRow.rowData.namespaceName;
        data['lastAuthenticated']=currentRow.rowData.lastAuthenticated;
        //data['displayName']=component.find("personaName").get("v.value");
        data['dateCreated']=currentRow.rowData.dateCreated;
        data['banCategory']=component.get("v.primaryBanState");
        requestObject['data']=JSON.stringify(data);
        console.log('requestObject ::',requestObject);
        
        action.setParams({
            reqParameters:requestObject
        });
        action.setCallback(this,function(response){
            if(response.getState()==='SUCCESS'){
                console.log('state ::', response.getState(), 'returnValue ::', response.getReturnValue());
                component.set("v.openSpinner",false);
                component.set("v.deletePersonaModal",false);
                refreshEvent.fire();
                toastEvent.setParams({
                    "type": "success",
                    "message": "Persona Successfully deleted."
                });
                toastEvent.fire();
            }
            else if(response.getState()==='ERROR')
			{
                var errorMsg = response.getError()[0].message;
				console.log('errorMsg when edited::',errorMsg);
                    component.set("v.openSpinner",false);
                    component.set("v.editPersonaModal",false);
                    toastEvent.setParams({
                        "type":'error',
                        "message": "Something went wrong.Please contact your IT."//response.getError()//
                    });
                toastEvent.fire();
			}
        });
        $A.enqueueAction(action);
        
    }
})