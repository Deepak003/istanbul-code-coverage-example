({
    //Getting all the notification message
    getNotificationMessage : function(component, event) {
        var action = component.get("c.getAllNotificationMessages");  
        action.setParams({
            strLastRetrievedDateTime : null
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();          
                this.generateAlertList(component, event, storeResponse);//Generating the alert
            }
        });
        $A.enqueueAction(action);
    },
    //Generate the list of alert
    generateAlertList : function(component, event, storeResponse){
        var count = 0;
        //Getting the unread response
        for (var eachResponse in storeResponse){
            if(!storeResponse[eachResponse].isRead){
                count =count + 1;
            }
        }
        component.set("v.notificationCount",count);
    },
    //Updating the utility bar based on the count
    updateNotificationInfo : function(component, event, isHightlighted) {
        var utilityAPI = component.find("utilitybar");
        utilityAPI.getAllUtilityInfo().then(function(response) {
            //Looping through the list of utility
            for(var eachUtility in response){
                if(response[eachUtility].utilityLabel == "Notifications"){
                    var myUtilityInfo = response[eachUtility];
                    //Hightlighting the utility
                    utilityAPI.setUtilityHighlighted({
                        utilityId : myUtilityInfo.id,
                        highlighted: isHightlighted
                    });
                }
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    },
})