({
    getAccount : function(component, event, helper) {
        var action = component.get("c.getAccount"); 
        var nucleusId = component.get("v.nucleusId"); 
        
        component.set("v.initSpinner", true);
        action.setParams({
            strSearchValue : (component.get("v.accountSummary")).parentalEmail
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.initSpinner", false);
                
                var data = response.getReturnValue();
                if(data){
                    var radioList = [];
                    var chkList = [];
                    var parentEmail = (component.get("v.accountSummary")).parentalEmail;
                    if(JSON.parse(data).response != null){
                        var parentAccount = (JSON.parse(data).response[0]).firstName+' '+(JSON.parse(data).response[0]).lastName;
                        component.set("v.targetUserId",(JSON.parse(data).response[0]).userId);
                                                                 
                        radioList.push({
                            label: 'Transfer to parental account ('+parentEmail+')', 
                            value: parentEmail
                        });
                    }
                    
                    radioList.push({
                        label: 'Transfer to another account', 
                        value: 'searchAccount'
                    });
                    component.set("v.radioOptions", radioList);
                    
                    chkList.push({
                        label: 'Delete current account ('+parentAccount+')after transfer is complete', 
                        value: parentEmail
                    });
                    component.set("v.chkOptions", chkList);
                }
            }
            else{
                component.set("v.initSpinner", false);
                console.log("Error : No Data");
            }
        });
        $A.enqueueAction(action);
    },
    
    searchAccount : function(component, event, helper, strSearchValue) {
        var action = component.get("c.searchAccount"); 
        component.set("v.spinner", true); 
        action.setParams({
            strSearchValue : strSearchValue
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.spinner", false);
                console.log("SUCCESS : Got Data");
                var data = response.getReturnValue();
                
                var parseData = JSON.parse(response.getReturnValue());
                if(Array.isArray(parseData)){
                    for(var i=0; i<parseData.length ; i++){
                        if(parseData[i].customerId != null){
                            data = JSON.stringify(parseData[i]);
                            break;
                        }
                    }
                }
                
                if(data){
                    if(JSON.parse(data).id != undefined){
                        component.set("v.accountRecord",JSON.parse(data));
                        component.set("v.noRecords",false);
                        component.set("v.targetUserId",(JSON.parse(data)).customerId);
                        component.set("v.isSuccessDisable",false);   
                        component.set("v.showTable",true);
                    }else{
                        component.set("v.isSuccessDisable",true);
                        console.log("Error : No Data");
                        component.set("v.showTable",true);
                        component.set("v.noRecords",true);
                    }
                }
            }
            else{
                component.set("v.isSuccessDisable",true);
                component.set("v.spinner", false);
                console.log("Error : No Data");
                component.set("v.showTable",true);
                component.set("v.noRecords",true);
            }
        });
        $A.enqueueAction(action);
    }
})