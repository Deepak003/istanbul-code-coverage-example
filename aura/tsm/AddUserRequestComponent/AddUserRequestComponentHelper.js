({
    getPrimaryIdTypes : function(component) {
        var action = component.get("c.getPickListValues");
        var fieldName = "PrimaryIdType__c";
        component.set("v.spinner", true);
        action.setParams({
            "objObject": component.get("v.objGDPRRequest"),
            "fld": fieldName,
            "nullRequired": false
        })
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.PrimaryId", a.getReturnValue());
                var defaultPrimary = component.get("v.PrimaryId")[0];
                component.find("primary").set("v.value", defaultPrimary);
                component.set("v.spinner", false);
            } else if (state === "ERROR") {
                var errors = a.getError();
                component.set("v.spinner", false);
            } else {
                component.set("v.spinner", false);
            }
        });
        $A.enqueueAction(action);
    },
    
    getActivityFlags: function(component) {
        var action = component.get("c.getPickListValues");
        var fieldName = "RequestType__c";
        component.set("v.spinner", true);
        action.setParams({
            "objObject": component.get("v.objGDPRRequest"),
            "fld": fieldName,
            "nullRequired": false
        })
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.RequestType", a.getReturnValue());
                var defaultFlag = component.get("v.RequestType")[0];
                component.find("requestFlag").set("v.value", defaultFlag);
                component.set("v.spinner", false);
            } else if (state === "ERROR") {
                var errors = a.getError();
                component.set("v.spinner", false);
            } else {
                component.set("v.spinner", false);
            }
        });
        $A.enqueueAction(action);
    },
    getSecondaryIdTypes: function(component) {
        var action = component.get("c.getPickListValues");
        var fieldName = "SecondaryIdType__c";
        component.set("v.spinner", true);
        action.setParams({
            "objObject": component.get("v.objGDPRRequestSecondaryId"),
            "fld": fieldName,
            "nullRequired": true
        })
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.SecondaryId", a.getReturnValue());
                var date = new Date();
                date.setDate(date.getDate() + 30);
                var dueDate = $A.localizationService.formatDate(date, "yyyy-MM-dd");
                component.find("date-01").set("v.value", dueDate);
                component.set("v.spinner", false);
            } 
            else if (state === "ERROR") {
                var errors = a.getError();
                component.set("v.spinner", false);
                
            } else {
                component.set("v.spinner", false);
            }
        });
        
        $A.enqueueAction(action);
    },
    
    createRequest: function(component, newRequest) {
        
        var validateIdAction = component.get("c.isValidPrimaryId");
        var primaryIdType = component.get("v.objGDPRRequest.PrimaryIdType__c");
        var primaryId = component.get("v.objGDPRRequest.PrimaryId__c")
        component.set("v.spinner", true);
        validateIdAction.setParams({
            "strPrimaryId": primaryId,
            "idType": primaryIdType
        });
        validateIdAction.setCallback(this, function(a) {
            let state = a.getState();
            if (state === "SUCCESS"){
                var isValid = a.getReturnValue();
                if (isValid) {
                    var typeArray = [];
        			var idArray = [];
                    var objSecId = component.get("v.objSecondaryIdList");
                    var type = component.get("v.objGDPRRequestSecondaryId.SecondaryIdType__c");
                    var id = component.get("v.objGDPRRequestSecondaryId.SecondaryId__c");
                    var indexToDelete = component.get("v.indexToDelete");
                    if (type && id) {
                        typeArray.push(type);
                        idArray.push(id);
                        for (let i=0; i< idArray.length; i++) {
                           objSecId.push({[typeArray[i]]:idArray[i]}); 
                        }
                        if (indexToDelete < objSecId.length-1) {
                            objSecId.splice(indexToDelete, 1)
                        } else if(indexToDelete == objSecId.length-1) {
                            objSecId.pop();
                        }
                    }
                    component.set("v.objSecondaryIdList", objSecId);
                    
                    var saveRequestAction = component.get("c.savePlayerRequest");
                    var secondaryIds = JSON.stringify(component.get("v.objSecondaryIdList"));
                    saveRequestAction.setParams({ 
                        "playerRequest": newRequest,
                        "secondaryIds": secondaryIds
                    });
                    saveRequestAction.setCallback(this, function(b) {
                        var title = '';
                        var type = '';
                        var message = '';
                        let state = b.getState();

                        if (state === "SUCCESS"){
                            console.log(JSON.stringify((b.getReturnValue())));
                            var result = b.getReturnValue();
                            var gdprRequestSecondaryIdList;
                            var gdprRequest;
                            if (result && result.secondaryIds && result.playerRequest) {
                                gdprRequestSecondaryIdList = result.secondaryIds;
                                gdprRequest = result.playerRequest
                            }
                                var gdprRequestSecondaryIdList = b.getReturnValue().secondaryIds;
                                var processRequestAction = component.get("c.processGDPRRequestClients");
                                processRequestAction.setParams({
                                    "gdprRequest": gdprRequest,
                                    "gdprRequestSecondaryIdList": gdprRequestSecondaryIdList
                                });
                                processRequestAction.setCallback(this, function(c) {
                                    component.set("v.spinner", true);
                                    let state = c.getState();
                                    var objResult = c.getReturnValue();
                                    if (typeof objResult !== 'object') {
                                        objResult = JSON.parse(objResult);
                                    }
                                    
                                    if (state === "SUCCESS"){
                                        if (objResult && objResult.status) {
                                            if (objResult.status === "ERROR") {
                                                type = 'error';
                                        		message = objResult.message;
                                            } else if (objResult.status === "SUCCESS") {
                                                type = 'success';
                                        		message = "New request created successfully";
                                            }
                                            
                                        } else {
                                            type = 'error';
                                        	message = 'An error occurred while processing request';
                                        }
                                        component.set("v.spinner", false);
                                        component.set("v.type", type);
                                        component.set("v.message", message);
                                        component.set("v.newReqFlag", false);
                                        component.set("v.addSuccess", true);
                                        
                                    } 
                                    else if (state === "ERROR") {
                                        var errors = c.getError();
                                        type = 'error';
                                        message = 'An error occured while processing request';
                                        component.set("v.type", type);
                                        component.set("v.message", message);
                                        component.set("v.newReqFlag", false);
                                        component.set("v.spinner", false);
                                        
                                    }
                                });
                                $A.enqueueAction(processRequestAction);
                            
                            
                        } 
                        else if (state === "ERROR") {
                            var errors = a.getError();
                            type = 'error';
                            message = 'An error occured while processing request';
                            component.set("v.type", type);
                            component.set("v.message", message);
                            component.set("v.newReqFlag", false);
                            component.set("v.spinner", false);
                            
                        }
                    });
                    $A.enqueueAction(saveRequestAction);
                    
                } else {
                    var type = 'error';
                    var message = 'The Id provided is not valid';
                    component.set("v.type", type);
                    component.set("v.message", message);
                    component.set("v.newReqFlag", false);
                    component.set("v.spinner", false);
                }
                
            } 
            else if (state === "ERROR") {
                var errors = a.getError();
                var type = 'error';
                var message = 'An error occured while processing request';
                component.set("v.type", type);
                component.set("v.message", message);
                component.set("v.newReqFlag", false);
                component.set("v.spinner", false);
            }
        });  
        $A.enqueueAction(validateIdAction);  
        
    }
})