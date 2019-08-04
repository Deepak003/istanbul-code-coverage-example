({ 
    getLabel: function(field) {
        var label = '';
        switch(field) {
            case 'Name':
                label = 'Name';
                break;
            case 'Alias__c':
                label = 'Alias';
                break;
            case 'Email__c':
                label = 'Point of Contact';
                break;
            case 'Active__c':
                label = 'Active Status';
                break;
        }
        return label;
    },
    
    getSubscribers: function(component, page, recordToDisply) {
        
        // create a server side action. 
        var action = component.get("c.getSubscriberList");
        component.set('v.Spinner', true)
        // set the parameters to method
        action.setParams({
            "pageNumber": page,
            "recordToDisply": recordToDisply
        });
        // set a call back   
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === 'SUCCESS') {
                var result = a.getReturnValue();
                component.set("v.data", result.requests);
                component.set("v.page", result.page);
                component.set("v.total", result.total);
                if (result.total == 0) {
                    component.set("v.pages", 1);
                } else {
                    component.set("v.pages", Math.ceil(result.total / recordToDisply));
                }  
            } else if (state === "ERROR") {
                var errors = response.getError();
                
            }
            
            
        });
        // enqueue the action 
        $A.enqueueAction(action);
    },
    
    saveEdition: function (component,event, draftValues) {
        // create a server side action. 
        var action = component.get("c.updateGDPRSubscriber");
        component.set('v.Spinner', true)
        var length = draftValues.length;
        action.setParams({
            "subscriberList": draftValues
            
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === 'SUCCESS') {
                var result = a.getReturnValue();
                if (result === true) {
                    this.showToast({
                        "type": "success",
                        "message": length+" Subscriber record(s) updated"
                    });
                    this.reloadDataTable();
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
    
    showToast : function(params){
        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent){
            toastEvent.setParams(params);
            toastEvent.fire();
        } 
    },
    
    reloadDataTable : function(){
        var refreshEvent = $A.get("e.force:refreshView");
        if(refreshEvent){
            refreshEvent.fire();
        }
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