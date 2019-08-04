({
	init : function(component, event, helper) {
		var list = component.get("v.secondaryIdListInner");
        if (list.length > 1) {
            component.set("v.showDeleteButton", true);
        }
        
	},
    
    deleteSecondId: function(component, event, helper) {
        var secondaryIdListInner = component.get("v.secondaryIdListInner");
        var currentIndex = component.get("v.indexNo");
        component.set("v.indexToDelete", currentIndex);
        if(currentIndex > -1)
        secondaryIdListInner.splice(currentIndex, 1);
        component.set("v.secondaryIdListInner", secondaryIdListInner);
        var objSecList = component.get("v.objSecondaryIdList");
        
    },
    
    validate: function(component, event, helper) {
        var index = component.get("v.indexNo");
        var id = component.get("v.secondaryIdVar");
        var type = component.get("v.secondaryTypeVar");
        if (id.includes('<') || id.includes('>')) {
            var str = id.replace(/</gi, '');
            str = str.replace(/>/gi, '');
            component.set("v.secondaryIdVar", str);
             var toastEvent = $A.get("e.force:showToast");  
                toastEvent.setParams({  
                    "type":"Error",
                    "message": "Characters '<' and '>' are not allowed."  
                });  
        		toastEvent.fire(); 
        }
        var objSecId = component.get("v.objSecondaryIdList");
        if (type && id) {
            objSecId[index] = {[type]: id};
        }
        component.set("v.objSecondaryIdList", objSecId);
        component.set("v.objGDPRRequestSecondaryId.SecondaryIdType__c", component.get("v.secondaryTypeVar"));
        component.set("v.objGDPRRequestSecondaryId.SecondaryId__c", component.get("v.secondaryIdVar"));
    }
})