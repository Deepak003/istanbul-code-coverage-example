({
    //Funciton used to initlize the system messages
	init : function(component, event, helper) {
		helper.getAllSystemMessages(component, event);
        //Making the subscription to empty
        component.set('v.subscription', null);
        //Getting the system message api
        const systemMessageApi = component.find('systemMessageApi');
        const errorHandler = function (message) {
            console.error('Received error ', JSON.stringify(message));
        };
        systemMessageApi.onError($A.getCallback(errorHandler));
        //Calling the helper to subscribe to the API
        helper.subscribe(component, event, helper);
	},
    //Funciton to close the notification
    closeSystemMessage: function(component, event, helper) {
        component.set("v.isData", false);
    },
})