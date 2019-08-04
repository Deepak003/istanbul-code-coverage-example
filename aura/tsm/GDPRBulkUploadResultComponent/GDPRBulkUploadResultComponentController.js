({
	init : function(component, event, helper) {
		component.set("v.refreshTime", 'Just now');
        var timezone = $A.get("$Locale.timezone"); //Getting user's timezone
        var userDate = new Date().toLocaleTimeString("en-US", {timeZone: timezone});
        setTimeout(function(){
            component.set("v.refreshTime", userDate);
        }, 10000);
        var result = window.sessionStorage.getItem("bulkFailedRequests");
        result = JSON.parse(result);
        var rows = result.bulkRequestList;
        var successCount =0;
        var errorCount =0;
        if (rows && Array.isArray(rows) && rows.length > 0) {
            var batchId = rows[0].BatchId__c;
            component.set("v.batchId", batchId);
            component.set("v.total", rows.length);
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                if (row.NucleusId__c) {
                    row.PrimaryId = row.NucleusId__c;
                } else if (row.PersonaId__c) {
                    row.PrimaryId = row.PersonaId__c;
                } else if (row.Primary_Email__c) {
                    row.PrimaryId = row.Primary_Email__c;
                }
                if (row.Status__c != "Failed") {
                    row.Status__c = "Success";
                    successCount++;
                }else{
                    errorCount++;
                }
            }
        }
        var countRows = result.bulkStatuses;
        
        component.set("v.successCount", successCount);
        component.set("v.errorCount", errorCount);
        if (countRows && Array.isArray(countRows) && countRows.length > 0) {
            for (let i=0; i < countRows.length; i++) {
                var countRow = countRows[i];
                if (countRow.status == "Error") {
                    var failedCount = countRow.count;
                }
            }
        } else {
            helper.handleErrors();
        }
        
        if (failedCount) {
            var toastParams = {
                message: failedCount+" Request(s) failed validation and can't be added",
                type: "error"
            };
            let toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams(toastParams);
            toastEvent.fire();
        }
        
        
        component.set("v.data", rows);

        component.set('v.columns', [{
                label: 'Primary ID',
                fieldName: 'PrimaryId',
                type: 'text',
            },
            {
                label: 'Upload Status',
                fieldName: 'Status__c',
                type: 'text',
            },
            {
                label: 'Reason for Fail',
                fieldName: 'StatusReason__c',
                type: 'text',
            },
                                    
        ]);

	},
    downloadErrorRequests: function(component,event,helper){
       helper.downloadErrorRequests(component, event);
    },
    processSuccessBulkRequest: function(component,event,helper){
       helper.processSuccessBulkRequest(component, event);
    },
    hideSpinner: function(component,event,helper){
       component.set("v.spinner", false);
    }
})