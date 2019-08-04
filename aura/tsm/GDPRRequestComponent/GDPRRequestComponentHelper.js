({
    getProfile: function(component) {
        var action = component.get("c.getUserProfile");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                
                var profile = response.getReturnValue();
                component.set("v.userProfile", profile);
                window.sessionStorage.setItem("userProfile", profile);
                var isNotReadOnly;
                if (profile == 'GDPR-Read Only') {
                    isNotReadOnly = false;
                }
                else if (profile != 'GDPR-Read Only') {
                    isNotReadOnly = true;
                }
                component.set("v.isNotReadOnly", isNotReadOnly);
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                
            }

        })
         $A.enqueueAction(action);
    },
    
    getLabel: function(field) {
        var label = '';
        switch(field) {
            case 'PrimaryId__c':
                label = 'Primary Id';
                break;
            case 'Name':
                label = 'Transaction Id';
                break;
            case 'RequestType__c':
                label = 'Flag';
                break;
            case 'CreatedByName':
                label = 'Submitted By';
                break;
            case 'Status__c':
                label = 'Status';
                break;
            case 'CreatedDate':
                label = 'Creation Date';
                break;
            case 'DueDate__c':
                label = 'Due Date';
                break;
        }
        return label;
    },
    
    getGDPRRequests: function(component, page, recordToDisply) {
        
        // create a server side action. 
        var action = component.get("c.getPlayerRequests");
        component.set('v.Spinner', true)
        // set the parameters to method
        action.setParams({
            "pageNumber": page,
            "recordToDisply": recordToDisply
        });
        // set a call back   
        action.setCallback(this, function(a) {
            // store the response return value (wrapper class instance) 
            var state = a.getState();
            if (state === 'SUCCESS') {
                var result = a.getReturnValue();
                var rows = result.requests;
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if (row.CreatedBy) row.CreatedByName = row.CreatedBy.Name;
                }
                // set the component attributes value with wrapper class properties.   
                component.set("v.data", rows);
                component.set("v.page", result.page);
                component.set("v.total", result.total);
                if (result.total == 0) {
                    component.set("v.pages", 1);
                } else {
                    component.set("v.pages", Math.ceil(result.total / recordToDisply));
                }  
            } else if (state === "ERROR") {
                var errors = response.getError();
                this.handleErrors(errors);
            }
                      
            
        });
        // enqueue the action 
        $A.enqueueAction(action);
    },
    
    sortData: function (component, fieldName, sortDirection) {
        var data = component.get("v.data");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        data.sort(this.sortBy(fieldName, reverse))
        component.set("v.data", data);
    },
    sortBy: function (field, reverse, primer) {
        var key = primer ? function(x) {return primer(x[field])} : function(x) {return x[field]};
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },
    getReport: function(component, event) {
        // create a server side action. 
        var action = component.get("c.getReportURL");
        component.set('v.Spinner', true);
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === 'SUCCESS') {
                var result = a.getReturnValue();
                component.set("v.reportUrl", result);
                window.location = component.get("v.reportUrl");
            } else if (state === "ERROR") {
                var errors = response.getError();
                this.handleErrors(errors);
            }
                      
            
        });
        // enqueue the action 
        $A.enqueueAction(action);
    },
    
    handleErrors : function(errors) {
        let toastParams = {
            title: "Error",
            message: "An error occured while processing request", // Default error message
            type: "error"
        };
        if (errors && Array.isArray(errors) && errors.length > 0) {
            toastParams.message = errors[0].message;
        }
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
        
    }
})