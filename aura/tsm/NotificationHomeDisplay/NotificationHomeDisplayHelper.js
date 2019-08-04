({
    //Get all notifications
    getAllNotificationMessage : function(component, event) {
        var action = component.get("c.getAllNotificationMessages");  
        action.setParams({
            strLastRetrievedDateTime : null
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();          
                this.getMandatoryNotificationMessage(component, event, storeResponse);
            }
        });
        $A.enqueueAction(action);
    },
    //Get only mandatory notifications
    getMandatoryNotificationMessage : function(component, event, notificationList) {
        var mandatoryNotificationList = [];
        for(var eachNotification in notificationList){
            if(notificationList[eachNotification].requiredReading == true && notificationList[eachNotification].isRead  == false){
                mandatoryNotificationList.push(notificationList[eachNotification]);
            }
        }
        component.set("v.mandatoryNotificationList", mandatoryNotificationList);
        if(mandatoryNotificationList.length > 0){
            component.set("v.isData", true);
            this.getCurrentNotificationBodyByIndex(component, event, 0, null);
        }
    },
    //Loop through the notification list and get the list by index
    getCurrentNotificationBodyByIndex: function(component, event, index, isRead) {
        var mandatoryNotificationList = component.get("v.mandatoryNotificationList");
        var action = component.get("c.getNotificationMessageById");  
        action.setParams({
            strMessageId : mandatoryNotificationList[index].id,
            strIsRead : isRead
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.isLoading", false);
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue(); 
                if(isRead == null){
                    component.set("v.currentNotificationBody", storeResponse);
                    component.set("v.currentSelectedNotification", mandatoryNotificationList[index]);  
                    component.set("v.selectedIndex", index);
                }else{
                    //Creating the application event
                    var applicationEvent = $A.get("e.c:AcknowledgementAlertEvent");
                    applicationEvent.setParams({ "isAcknowledged" : true });
                    applicationEvent.fire();
                }
            }
        });
        $A.enqueueAction(action);
    },
})