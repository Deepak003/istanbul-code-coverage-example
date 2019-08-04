({
    //Funciton hitting the backend to get all the system notifications
    getAllSystemMessages : function(component, event) {
        var action = component.get("c.getAllSystemNotifications");  
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();    
                if(storeResponse.length > 0){
                    component.set("v.isData", true);
                    component.set("v.systemMessage", storeResponse);
                }
            }
        });
        $A.enqueueAction(action);   
    },
    // Client-side function that invokes the subscribe method on the
    // systemMessageApi component.
    subscribe: function (component, event, helper) {
        // Get the API component.
        const systemMessageApi = component.find('systemMessageApi');
        // Get the channel from the attribute.
        const channel = component.get('v.channel');
        // Subscription option to get only new events.
        const replayId = -1;
        //Function called after publish
        const callback = function (message) {
            helper.onReceiveNotification(component, event, message);
        };
        // Subscribe to the channel and save the returned subscription object.
        systemMessageApi.subscribe(channel, replayId, $A.getCallback(callback)).then($A.getCallback(function (newSubscription) {
            component.set('v.subscription', newSubscription);
        }));
    },
    // Client-side function that displays the platform event message
    // in the console app and displays a toast if not muted.
    onReceiveNotification: function (component, event, message) {
        this.getAllSystemMessages(component, event);
    },
})