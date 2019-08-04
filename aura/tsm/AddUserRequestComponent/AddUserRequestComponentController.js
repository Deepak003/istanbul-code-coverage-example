({	
    init: function(component, event, helper) {
        component.set("v.type", '');
        component.set("v.message", '');
        var date = new Date();
        var currentDate = $A.localizationService.formatDate(date, "yyyy-MM-dd");
        component.set("v.currentDate", currentDate);
        helper.getPrimaryIdTypes(component);
        helper.getSecondaryIdTypes(component);
        helper.getActivityFlags(component);
        
    },
    
    resetPrimary: function(component, event, helper) {
		component.set("v.objGDPRRequest.PrimaryId__c", "");        
    },
    
    checkValidity: function(component, event, helper) {
        var type = component.get("v.objGDPRRequest.PrimaryIdType__c");
        var id = component.get("v.objGDPRRequest.PrimaryId__c");
        if (id.includes('<') || id.includes('>')) {
            var str = id.replace(/</gi, '');
            str = str.replace(/>/gi, '');
            component.set("v.objGDPRRequest.PrimaryId__c", str);
             var toastEvent = $A.get("e.force:showToast");  
                toastEvent.setParams({  
                    "type":"Error",
                    "message": "Characters '<' and '>' are not allowed."  
                });  
        		toastEvent.fire(); 
        }
        if (type == 'PersonaId') {
            var pattern = "[0-9]*";
            component.set("v.restrict", pattern);
            component.set("v.errorMessage", "Persona Id should be numeric");
            if (!(/^\d+$/.test(id))) {
                component.set("v.disableButton", true);
            } else {
                component.set("v.disableButton", false);
            }
            
        }
        
    },
    
    closeModal : function(component, event, helper) {
        component.set("v.newReqFlag", false);
    },
    
    hideSpinner : function(component,event,helper){
       component.set("v.spinner", false);
    },
    
    addSecondId: function(component, event, helper) {
        var CurrentSecondaryIdList = component.get("v.secondaryIdList");
        var currentSize = parseInt((CurrentSecondaryIdList.length));
        var newSize = parseInt((currentSize) + 1);
        CurrentSecondaryIdList.push(newSize);
        var typeArray = [];
        var idArray = [];
        component.set("v.secondaryIdList", CurrentSecondaryIdList);
        var objSecId = component.get("v.objSecondaryIdList");
        var type = component.get("v.objGDPRRequestSecondaryId.SecondaryIdType__c");
        var id = component.get("v.objGDPRRequestSecondaryId.SecondaryId__c");
        if (type && id) {
            typeArray.push(type);
            idArray.push(id);
            for (let i=0; i< idArray.length; i++) {
                objSecId.push({[typeArray[i]]:idArray[i]}); 
            }
        }
        
        component.set("v.objSecondaryIdList", objSecId);
        console.log("Secondary Ids : "+JSON.stringify(objSecId));
    },
    handleButton: function(component, event, helper) {
        if(component.get("v.objGDPRRequest.PrimaryId__c") !== "") {
            component.set("v.disableButton", false);
        }
    },
    
    addRequest: function(component, event, helper) {
		component.set("v.disableButton", true);
        var newRequest = component.get("v.objGDPRRequest");
        helper.createRequest(component, newRequest);
    },
})