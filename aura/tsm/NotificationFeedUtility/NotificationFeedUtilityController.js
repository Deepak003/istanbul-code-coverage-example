({
    //Init funciton ot et all the notification
    init : function(component, event, helper) {
        //Platform Event code
        component.set('v.subscription', null);
        component.set('v.notifications', []);
        // Get empApi component.
        const empApi = component.find('empApi');
        // Define an error handler function that prints the error to the console.
        const errorHandler = function (message) {
            console.error('Received error ', JSON.stringify(message));
        };
        // Register empApi error listener and pass in the error handler function.
        empApi.onError($A.getCallback(errorHandler));
        helper.subscribe(component, event, helper);
        helper.getNotificationMessage(component, event);
    },
    //On notificaion select
    selectRelatedNotification: function(component, event, helper) {
        var targetIndex = event.currentTarget.dataset.value;
        helper.getSelectedNotification(component, event, targetIndex, null); //Open notification body
        helper.toggleNotificationFocus(component, event, targetIndex);//Toggle the focus for the notification
    },    
    //Searching the notification based on name and title
    searchNotification: function(component, event, helper) {
        var timer = component.get('v.keyPressTimer');
        var searchString = component.get("v.searchString");
        var allArticles = component.get("v.notificationList");
        var searchRecords = [];
        clearTimeout(timer);
        timer = setTimeout(function() {
            if(helper.isValidString(searchString)){  
                if(searchString == ""){
                    searchRecords = allArticles;
                }else{
                    for(var eachArticle in allArticles){
                        //loading the search based on entered value  for all notification
                        if (allArticles[eachArticle].messageTitle.toLowerCase().search(searchString.toLowerCase()) >= 0) {
                            searchRecords.push(allArticles[eachArticle]);
                        }else if(allArticles[eachArticle].createdBy.toLowerCase().search(searchString.toLowerCase()) >= 0){
                            searchRecords.push(allArticles[eachArticle]);
                        }                
                    }
                }
                component.set("v.searchArticles", searchRecords);
            }
            clearTimeout(timer);
            component.set('v.keyPressTimer', 0);
        }, 5);
        component.set('v.keyPressTimer', timer);
        event.stopPropagation();
        event.preventDefault();
    },
    //Function ot close the notification
    closeNotification: function(component, event, helper) {
        $A.util.addClass(component.find("notificationPopover"), 'slds-hide');
        helper.toggleNotificationFocus(component, event, null);
    },
    //Function to acknowledge notification
    acknowledgeNotification: function(component, event, helper) {
        helper.getSelectedNotification(component, event, component.get("v.selectedIndex"), 'true');
    },
})