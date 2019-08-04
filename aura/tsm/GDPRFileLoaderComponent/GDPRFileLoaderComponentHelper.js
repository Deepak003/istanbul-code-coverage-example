({
    createEventLog : function(component, event) {
        console.log(JSON.stringify(event.getParams));
        component.set("v.spinner", true);
        var action = component.get('c.insertEventLog');
        action.setParams({
            "eventLog":"Add Bulk Request"
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                var recordId = a.getReturnValue();
                component.set("v.recordId", recordId);
                component.set("v.spinner", false);
            } else if (state === "ERROR") {
                var errors = a.getError();
                component.set("v.spinner", false);
                this.handleErrors(errors);
            }
        });
        $A.enqueueAction(action);
    },
    
    saveBulkGDPRRequest: function(component, event, recordId) {
        component.set("v.spinner", true);
        var action = component.get("c.insertBulkRequests");
        action.setParams({
            "eventId": recordId,
        });
        action.setCallback(this, function(resp) {
            var state = resp.getState();
            var failedRecords = false;
            if (state === "SUCCESS") {
                var result = resp.getReturnValue();
                window.sessionStorage.setItem("bulkFailedRequests", JSON.stringify(result));
                component.set("v.bulkUploadFlag", false);
                var rows = result.bulkRequestList;
                var statusCountRows = result.bulkStatuses;
                if (rows) {
                    if (rows.length > 0) {
                        window.location = "/lightning/n/GDPR_Bulk_Upload";
                    }
                    
                    else if (rows.length == 0) {
                        var toastParams = {
                            message: "No record found", 
                            type: "warning"
                        };
                        let toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams(toastParams);
                        toastEvent.fire();
                    }
                } else {
                    if (statusCountRows) {
                        for (let i=0; i < statusCountRows.length; i++) {
                            var countRow = statusCountRows[i];
                            if (countRow.status == "Error") {
                                //var failedCount = countRow.count;
                                var reasonForFail = countRow.statusReason;
                                this.handleCustomError(reasonForFail);
                                break;
                            }
                        }
                    }
                }
                component.set("v.spinner", false);
                
            }
            else if (state === "ERROR"){
                var errors = resp.getError();

                component.set("v.spinner", false);
                this.handleErrors(errors);
                component.set("v.bulkUploadFlag", false);
                
            }
        });
        $A.enqueueAction(action);
    },
    handleCustomError : function(error) {
        let toastParams = {
            title: "Error",
            message: "An error occured while processing request", // Default error message
            type: "error"
        };
        if (error) {
            toastParams.message = error;
        }
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
        
    },
    handleErrors : function(errors) {
        var message;
        if (errors && Array.isArray(errors) && errors.length > 0) {
            //message = errors[0].message;
            if (errors[0].fieldErrors && errors[0].fieldErrors.RequestType__c &&
                Array.isArray(errors[0].fieldErrors.RequestType__c)
                && errors[0].fieldErrors.RequestType__c.length > 0) {
                message = errors[0].fieldErrors.RequestType__c[0].message;
            }
            
        }
        let toastParams = {
            title: "Error",
            message: message || "An error occured while processing request", // Default error message
            type: "error"
        };
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
        
    }
})