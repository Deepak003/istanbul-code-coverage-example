({
	getMergedPetitions : function(component) {		
        var mergedPetiAction = component.get("c.getPetitionRequestsByUUID"),
            petitionUuid = component.get('v.petitionUuid');
			mergedPetiAction.setParams({strPetitionUUId : petitionUuid});
			mergedPetiAction.setCallback(this, function(response) {
            var state = response.getState();   
            if (state === "SUCCESS") {  
				var data = response.getReturnValue();
                if (data) {
                    for(var i=0;i<data.length;i++){
                       /** var gmtFormat = new Date(data[i].createdOn);
                        var convertedToGMT = gmtFormat.toGMTString();**/
                        //Added below code for THOR-708 changes
                        data[i].createdOn = $A.localizationService.formatDateTimeUTC(data[i].createdOn)+" " +"UTC";
                    }
                }
				component.set("v.mergedpetList", data);                
								
            }
            else {
                console.log("Getting mergedPetiAction failed with state: " + state);
            }
        });
        $A.enqueueAction(mergedPetiAction);
	}
})