({
	init: function (component, event, helper) {
        component.set("v.refreshTime", 'Just now');
        var row = window.sessionStorage.getItem("requestDetail");
        var profile = window.sessionStorage.getItem("userProfile");
        component.set("v.userProfile", profile);
        
        var timezone = $A.get("$Locale.timezone"); //Getting user's timezone
        
        var date = new Date();
        var currentDate = $A.localizationService.formatDate(date, "yyyy-MM-dd");
        component.set("v.currentDate", currentDate);
        date.setDate(date.getDate() + 30);
        var dueDateResend = $A.localizationService.formatDate(date, "yyyy-MM-dd");
        component.set("v.dueDateResend", dueDateResend);
        
        var userDate = new Date().toLocaleTimeString("en-US", {timeZone: timezone});
        setTimeout(function() {
            component.set("v.refreshTime", userDate);
        }, 10000);
        var rowVal = JSON.parse(row);
        var id = rowVal.Id;
        var creationDate = $A.localizationService.formatDate(rowVal.CreatedDate, "MMM dd, yyyy");
        var dueDate = $A.localizationService.formatDate(rowVal.DueDate__c, "MMM dd, yyyy");
        helper.getGDPRRequest(component, event, id);
        component.set("v.primaryId", rowVal.PrimaryId__c);
        component.set("v.transactionId", rowVal.Name);
        component.set("v.activityFlag", rowVal.RequestType__c);
        component.set("v.submittedBy", rowVal.CreatedBy.Name);
        component.set("v.creationDate", creationDate);
        component.set("v.dueDate", dueDate);
        component.set('v.columns', [
            {label: 'Subscriber', fieldName: 'SubscriberName', type: 'text'},
            {label: 'Status', fieldName: 'Status__c', type: 'text'},
            {label: 'Last Updated Date', fieldName: 'LastModifiedDate', type: 'date'}
        ]);

    },

    downloadPlayerData: function(component, event, helper) {
		helper.getDownloadURL(component, event);
    },
    resendRequest: function(component, event, helper) {
        var Id = component.get("v.requestId")
		helper.resendRequest(component, event, Id);
    },
})