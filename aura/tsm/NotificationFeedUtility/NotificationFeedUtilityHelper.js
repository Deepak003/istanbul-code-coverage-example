({
    //Get the list of notifications
    getNotificationMessage : function(component, event) {
        var action = component.get("c.getAllNotificationMessages");  
        component.set("v.isLoading", true);
        //Last retrived date timne is always null
        action.setParams({
            strLastRetrievedDateTime : null
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.isLoading", false);
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();          
                component.set("v.notificationList",storeResponse);//Setting the notification list - Master copy
                component.set("v.searchArticles",storeResponse);//Setting the search article - A local copy to do search alone
            }
        });
        $A.enqueueAction(action);
    },
    /*
     * Function to get the notification body
     * Acknowledgement is done only is read is set to true
    */
    getSelectedNotification:function(component, event, index, isRead){
        var notificationList = component.get("v.searchArticles");
        var notificationPopover = component.find("notificationPopover");
        var notificationDOM = component.find("notificationDOM");
        var action = component.get("c.getNotificationMessageById"); 
        
        //Setting the message id for the particular index
        action.setParams({
            strMessageId : notificationList[index].id,
            strIsRead : isRead
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.set("v.isLoading", false);
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();     
                component.set("v.currentNotificationBody", storeResponse);//Setting the body with the response
                //Updating the read option
                if(isRead == 'true'){
                    notificationList[index].isRead = storeResponse.isRead; 
                    component.set("v.searchArticles", notificationList);
                    //Creating the application event to update the alert component
                    var applicationEvent = $A.get("e.c:AcknowledgementAlertEvent");
                    applicationEvent.setParams({ "isAcknowledged" : true });
                    applicationEvent.fire();
                }
                //Setting the current selected article
                component.set("v.currentSelectedArticle", notificationList[index]);  
                component.set("v.selectedIndex", index); //Setting the current index
                $A.util.removeClass(notificationPopover, 'slds-hide'); //Toggle the notificationPopover component
            }
        });
        $A.enqueueAction(action);
    },
    
    //Adding validation to check special characters
    isValidString: function (currentString){
        if (currentString.search(/[\[\]?*+|{}\\()@.\n\r]/) != -1) {
            return false;
        }else{
            return true;
        }
    },
    //Function used to toggle the notification index
    toggleNotificationFocus: function(component, event, index){
        var notificationItemList = component.find("notification-item");
        //Remove all the focus
        if(notificationItemList.length > 0){
            for(var eachItem in notificationItemList){
                $A.util.removeClass(notificationItemList[eachItem], 'notification-active'); 
            }
        }else{
            $A.util.removeClass(notificationItemList, 'notification-active');   
        }  
        //Adding the focus to the current selection
        if(index != null){
            $A.util.addClass(notificationItemList[index], 'notification-active');
        }  
    },
    //Closing the notification body
    closeNotification: function(component, event, helper) {
        var toggleDialog = component.find('notificationPopover');
        var isPopupCliked = this.isClickedOnPopup(event, 'notification-pannel');
        //Closing all the snap poopover except current selected  
        if(isPopupCliked){
            $A.util.addClass(toggleDialog, 'slds-hide');
        }
    },
    //Checking if the click is within the body
    isClickedOnPopup: function(event, selectorClass) {
        var currentElement = event.target;
        if(currentElement !=null){
            if(currentElement.className.search(selectorClass.toLowerCase()) >= 0 ) {
                return false;
            }
        }
        return true;
    },
    // Client-side function that invokes the subscribe method on the
    // empApi component.
    subscribe: function (component, event, helper) {
        // Get the empApi component.
        const empApi = component.find('empApi');
        // Get the channel from the attribute.
        const channel = component.get('v.channel');
        // Subscription option to get only new events.
        const replayId = -1;
        const callback = function (message) {
            helper.getNotificationMessage(component, event);
        };
        // Subscribe to the channel and save the returned subscription object.
        empApi.subscribe(channel, replayId, $A.getCallback(callback)).then($A.getCallback(function (newSubscription) {
            component.set('v.subscription', newSubscription);
        }));
    },
})