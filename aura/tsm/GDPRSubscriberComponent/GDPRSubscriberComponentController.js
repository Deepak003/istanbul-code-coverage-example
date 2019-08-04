({
    init: function(component, event, helper) {
        component.set("v.refreshTime", 'Just now');
        component.set("v.sortingField", 'Name');
        component.set("v.addSuccess", false);
        component.set("v.userProfile", window.sessionStorage.getItem("userProfile"));
		var timezone = $A.get("$Locale.timezone"); //Getting user's timezone
        var userDate = new Date().toLocaleTimeString("en-US", {timeZone: timezone})
        setTimeout(function() {
            component.set("v.refreshTime", userDate);
        }, 10000)

        var page = component.get("v.page") || 1;
        // get the select option (drop-down) values.   
        var recordToDisply = $A.get("$Label.c.GDPR_PageSize");
        
        component.set('v.columns', [{
                label: 'Name',
                fieldName: 'Name',
                type: 'text',
                sortable: true
            },
            {
                label: 'Alias',
                fieldName: 'Alias__c',
                type: 'text',
                sortable: true
            },
            {
                label: 'Point of Contact(Email)',
                fieldName: 'Email__c',
                type: 'text',
                sortable: true,
                editable: true
            },
            {
                label: 'Active',
                fieldName: 'Active__c',
                type: 'boolean',
                sortable: true,
                editable: true
            },
            
        ]);

        // call the helper function   
        helper.getSubscribers(component, page, recordToDisply);

    },
    handleSaveEdition: function(component, event, helper) {
		var draftValues = event.getParam('draftValues');
        var invalidEmail = false;                            
        for (var i = 0; i < draftValues.length; i++) {
            var item = draftValues[i];
            var regex = /\S+@\S+\.\S+/;
            if (item.Email__c && !regex.test(item.Email__c)) {
            	invalidEmail = true;
        	}          
       	}
        if (!invalidEmail) {
            helper.saveEdition(component,event, draftValues);
        } else {
         	var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "type": "error",
                "message": 'Email should be in the correct format : \"subscriber@email.com\"'
            });
            toastEvent.fire();
        }
        
        
    },
	refresh: function(component, event, helper) {
        helper.reloadDataTable();
    },
    navigate: function(component, event, helper) {
        // this function is called on clicking on the previous page button  
        var page = component.get("v.page") || 1;
        var direction = event.getSource().get("v.label");
        var recordToDisply = $A.get("$Label.c.GDPR_PageSize");
        // set the current page,(using ternary operator.)  
        page = direction === "Previous" ? (page - 1) : (page + 1);
        helper.getSubscribers(component, page, recordToDisply);

    },

    // this function is automatic called by aura:doneWaiting event 
    hideSpinner: function(component, event, helper) {
        component.set("v.Spinner", false);
    },

    updateColumnSorting: function(component, event, helper) {
        var fieldName = event.getParam('fieldName');
        var fieldLabel = helper.getLabel(fieldName);
        component.set("v.sortingField", fieldLabel);
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);
    },
    addNewSubscriber: function(component, event, helper) {
        component.set("v.newSubscriberFlag", true);
    },
    showToast: function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        var type = component.get("v.type");
        var message = component.get("v.message");
        if (type == "success" || type == "error") {

            toastEvent.setParams({
                "type": type,
                "message": message
            });
            toastEvent.fire();
        }
    },


})