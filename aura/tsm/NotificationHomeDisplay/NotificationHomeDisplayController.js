({
    //Function ot get all the notifications
    init : function(component, event, helper) {
        helper.getAllNotificationMessage(component, event);
    },
    //Funciton ot acknowledgenotification
    acknowledgeNotification: function(component, event, helper) {
        var index = component.get("v.selectedIndex");
        var notificaitonList = component.get("v.mandatoryNotificationList");
        helper.getCurrentNotificationBodyByIndex(component, event, index, 'true');//Acknowledge the current notification
        //Traverse to next notification if any
        if(index+1 != notificaitonList.length){
           helper.getCurrentNotificationBodyByIndex(component, event, index+1, null);   
        }else{
            component.set("v.isData", false);
        }
    },
    //Close current notification
    closeNotification: function(component, event, helper) {
        var index = component.get("v.selectedIndex");
        var notificaitonList = component.get("v.mandatoryNotificationList");
        //Traverse to next notification if any
        if(index+1 != notificaitonList.length){
            helper.getCurrentNotificationBodyByIndex(component, event, index+1, null);   
        }else{
            component.set("v.isData", false);
        }
    },
    //handle escape key press
    handleEscapeKeyPress: function(component, event, helper) {
        if(event.keyCode == 27){
            var index = component.get("v.selectedIndex");
            var notificaitonList = component.get("v.mandatoryNotificationList");
            //Traverse to next notification if any
            if(index+1 != notificaitonList.length){
                helper.getCurrentNotificationBodyByIndex(component, event, index+1, null);   
            }else{
                component.set("v.isData", false);
            }
        }
    },
})