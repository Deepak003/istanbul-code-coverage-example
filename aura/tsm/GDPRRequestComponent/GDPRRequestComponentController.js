({
    doInit: function(component, event, helper) {
        var timezone = $A.get("$Locale.timezone"); //Getting user's timezone
        var userDate = new Date().toLocaleTimeString("en-US", {timeZone: timezone})
        component.set("v.refreshTime", 'Just now');
        component.set("v.sortingField", 'Creation Date');
        component.set("v.addSuccess", false);
        helper.getProfile(component);
        setTimeout(function() {
            component.set("v.refreshTime", userDate);
        }, 10000)

        var page = component.get("v.page") || 1;
        var recordToDisply = $A.get("$Label.c.GDPR_PageSize");

        component.set('v.columns', [{
                label: 'Primary ID',
                fieldName: 'PrimaryId__c',
                type: 'text',
                sortable: true
            },
            {
                label: 'Transaction Id',
                fieldName: 'Name',
                type: 'text',
                sortable: true
            },
            {
                label: 'FLAG',
                fieldName: 'RequestType__c',
                type: 'text',
                sortable: true
            },
            {
                label: 'Submitted By',
                fieldName: 'CreatedByName',
                type: 'text',
                sortable: true
            },
            {
                label: 'Status',
                fieldName: 'ConsolidatedStatus__c',
                type: 'text',
                initialWidth: 180,
                sortable: true
            },
            {
                label: 'Creation Date',
                fieldName: 'CreatedDate',
                type: 'date',
                sortable: true
            },
            {
                label: 'Due Date',
                fieldName: 'DueDate__c',
                type: 'date',
                sortable: true
            },
            {
                type: 'button',
                typeAttributes: {
                    label: 'Show Details',
                    name: 'showRecord',
                    disabled: false,
                    value: 'test'
                }
            },
        ]);
        helper.getGDPRRequests(component, page, recordToDisply);

    },
    bulkUpload: function(component, event, helper) {
        component.set("v.bulkUploadFlag", true);
    },
    viewReports: function(component, event, helper) {
        helper.getReport(component, event);
    },
	
    refresh: function(component, event, helper){
        var refreshEvent = $A.get("e.force:refreshView");
        if(refreshEvent){
            refreshEvent.fire();
        }
    }, 
    openSubscribers: function(component, event, helper) {
        window.location = "/lightning/n/GDPR_Subscribers";
    }, 
    navigate: function(component, event, helper) {
        // this function is called on clicking on the previous page button  
        var page = component.get("v.page") || 1;
        var direction = event.getSource().get("v.label");
        var recordToDisply = $A.get("$Label.c.GDPR_PageSize");
        // set the current page,(using ternary operator.)  
        page = direction === "Previous" ? (page - 1) : (page + 1);
        helper.getGDPRRequests(component, page, recordToDisply);

    },
    handleRowAction: function(component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');

        switch (action.name) {
            case 'showRecord':
                                    //alert(JSON.stringify(row));
                window.sessionStorage.setItem("requestDetail", JSON.stringify(row));
                window.location = "/lightning/n/Request_Details"
                                    

        }
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
    addNewRequest: function(component, event, helper) {
        component.set("v.newReqFlag", true);
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
    }


})