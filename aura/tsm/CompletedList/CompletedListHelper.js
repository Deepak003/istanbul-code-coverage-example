({
	fetchCompletedCases: function (cmp, event) {
        var action = cmp.get("c.getCompletedCases");
        action.setCallback(this, function(response) {
            var state = response.getState();                
            if (state === "SUCCESS") {
                var caseList = response.getReturnValue();
				 //Added below code for THOR-708
                    for ( var i in caseList){
                        caseList[i].CreatedDate = $A.localizationService.formatDateTimeUTC(caseList[i].CreatedDate)+" "+ "UTC";
                    }
                caseList.sort(this.sortByField('CreatedDate'));
                cmp.set('v.data', caseList);
                cmp.set('v.queueCount', caseList.length);               
            }else{
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);        
    }
})