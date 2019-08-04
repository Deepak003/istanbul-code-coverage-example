({
    addMobileID : function(component,event,helper) {
        var action = component.get("c.addMobileProduct"); 
        var gamerId = component.get("v.gamerId"); 
        var gamerIdType = component.get("v.gamerIdType"); 
        var caseId = component.get("v.caseId");
        var nucleusId = component.get("v.nucleusId"); 
        var accountId = component.get("v.accountId"); 
        var productObj = component.get("v.product");
        var email = component.get("v.email");
        var productName = component.get("v.product.Name"); 
        
        var dataMap = {};
        dataMap["gamerId"] = gamerId;
        dataMap["productId"] = productObj["Id"];
        dataMap["caseId"] = caseId;
        dataMap["customerId"] = nucleusId;
        dataMap["accountId"] = accountId;
        dataMap["gamerIdType"] = gamerIdType;
        dataMap["email"] = email;
        dataMap["productName"] = productName;
        console.log("dataMap "+dataMap);
        action.setParams({
            "mapReqParams": dataMap
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            var toastEvent = $A.get("e.force:showToast");
            if (state === "SUCCESS") {
                var storeResponse = JSON.parse(response.getReturnValue()); 
                var associatedGamerAccounts = storeResponse.response;
                 toastEvent.setParams({                   
                    "message": "The ID is linked successfully",
                    "type": "success"
                });
            }else{
                var errorMessage = response.getError();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({                   
                    mode: 'dismissible',
                    "message": errorMessage[0].message, 
                    "type": "error"
                });
            }
            //Firing the component event
            var addMobileIDEvtDetails = component.getEvent("addMobileIDEvt");
            addMobileIDEvtDetails.setParams({
                "isMobileAdded" : true,
                "isMobileAlreadyAdded" : false,
                "isMobileProductAdded" : true
            });
            addMobileIDEvtDetails.fire();
            toastEvent.fire();
            component.set("v.addmobileId", false); 
        });
        $A.enqueueAction(action);
    }
})