({
    getStatusCodes : function(component){
        component.set("v.isLoading", true);
        var action = component.get("c.getServicePresenceStatusforUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            var storeResponse = response.getReturnValue();
            console.log(response.getReturnValue());
            if (state === "SUCCESS") { 
                var result =[];
                for(let i=0; i < storeResponse.length; i++){
                    var resArr={};
                    resArr['label'] = storeResponse[i].DeveloperName;
                    var id = storeResponse[i].Id;
					id = id.slice(0, -3);
                    resArr['value'] = id;
                    result.push(resArr);
                }
                component.set("v.stateOptions", result);
            }
            component.set("v.isLoading", false);
        });
        $A.enqueueAction(action);
    }
})