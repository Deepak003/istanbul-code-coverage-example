({
    doInit : function(component, event, helper) {
        var action = component.get("c.getEntitlementReasonCodes");  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var statusArr = [];
                var reasonArr = [];
                var storeResponse = JSON.parse(response.getReturnValue());
                var result = storeResponse.response;
                for(var i=0; i<result.entitlementStatus.length; i++){
                    var statusJSON = {};
                    statusJSON["label"] = result.entitlementStatus[i];
                    statusJSON["value"] = result.entitlementStatus[i];
                    statusArr.push(statusJSON);
                }
                component.set("v.entStatus", statusArr);
                for(var i=0; i<result.entitlementReasonCodesList.length; i++){
                    var reasonJSON = {};
                    reasonJSON["label"] = result.entitlementReasonCodesList[i];
                    reasonJSON["value"] = result.entitlementReasonCodesList[i];
                    reasonArr.push(reasonJSON);
                }
                component.set("v.entReason", reasonArr);
            }               
        });        
        $A.enqueueAction(action);
    },
    successModal : function(component, event, helper) {
        var dataArr = [];
        var request = {};
        
        var selVal = component.get("v.selEntitlement");
        for(var i=0; i< selVal.length; i++){
            var selValJSON = {};
            selValJSON["entitlementId"] = selVal[i].entitlementId;
            selValJSON["oldStatus"] = selVal[i].status;
            selValJSON["newStatus"] = component.get("v.selStatus");
            selValJSON["oldReasonCode"] = selVal[i].statusReasonCode;
            selValJSON["newReasonCode"] = component.get("v.selReason");
            dataArr.push(selValJSON);
        }
        request["inputEntitlements"] = dataArr;
        var reqParameters={};
        reqParameters["customerId"] = component.get("v.nucleusId");
        reqParameters["caseId"] = component.get("v.caseId");
        reqParameters["notes"] = ''; //new or old status?
        reqParameters["data"] = JSON.stringify(request);//JSON.stringify(selValJSON);
        reqParameters["accountId"] = component.get("v.accountId");
        var action = component.get("c.bulkUpdateNucleusEntitlmentsForCustomer");  
        action.setParams({
            "reqParameters": reqParameters
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse = JSON.parse(response.getReturnValue());
            if (state === "SUCCESS") {
                if(storeResponse != null && storeResponse.status === "SUCCESS"){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "message": "Entitlement updated successfully.",
                        "type": "success"
                    });
                    toastEvent.fire();
                    var appEvent = $A.get("e.c:EntitlementRefreshEvent");
                    appEvent.fire();
                    component.set('v.isOpen', false); 
                }
                else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Warning!",
                        "message": 'Some Entitlements failed to update',
                        "type": "warning"
                    });
                    toastEvent.fire();
                    var appEvent = $A.get("e.c:EntitlementRefreshEvent");
                    appEvent.fire();
                    component.set('v.isOpen', false);
                }  
            }  
            
            else if (state === "ERROR") {
                var err='Entitlement failed to update!! ';
                if(response.getReturnValue() != null && response.getReturnValue().errors != null){
                    for(var i=0; i< response.getReturnValue().errors; i++){
                        if(response.getReturnValue().errors[i].errorMessage == null)
                            continue;
                        else{
                            err=  response.getReturnValue().errors.errorMessage;
                            break;
                        }
                    }
                }
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "message": err,
                    "type": "error"
                });
                toastEvent.fire();
                var appEvent = $A.get("e.c:EntitlementRefreshEvent");
                appEvent.fire();
                component.set('v.isOpen', false);
            }         
        });        
        $A.enqueueAction(action);
    },
})