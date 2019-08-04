({
    //Funciton to get all the notification
    init : function(component, event, helper) {
        helper.getNotificationMessage(component, event);
    },
    //Funciton to update the utility bar on every acknowledgement
    updateUtilityBar: function(component, event, helper) {
        var currentCount = component.get("v.notificationCount");
        var notificationText = "Notifications";
        var isHightlighted = false;
        //Setting the alert based on th eunread count
        if(currentCount > 0){
            isHightlighted = true;
        }
        //Funciton to update the backend based on the update of acknowledgement
        helper.updateNotificationInfo(component, event, isHightlighted);
    },
})