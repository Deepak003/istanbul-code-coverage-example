({
	getTopCaseDetails : function(component,event,selectedValue) {
		var selectedOptionValue = selectedValue;
        var action = component.get("c.getTopCaseSettings");
        
        action.setParams({
            strCategoryType: selectedOptionValue
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            var response = response.getReturnValue();
            if(state === 'SUCCESS' && component.isValid()){
                //get contact list
                
                if(response.topCasesList.length > 0){
                    response.topCasesList.forEach(function(tc){
						tc.topcaseTxt = [tc.Product_Name__c, tc.Platform_Name__c, tc.Category_Name__c, tc.Sub_Category_Name__c].filter(Boolean).join(',')
                    })
                    component.set("v.totalCount",response.topCasesList[0].Total_Case_Count__c)
                    component.set("v.caseType",selectedOptionValue);
                }
                component.set('v.topCasesDetails', response);
            }else{
                console.log("Error");
            }
        });
        $A.enqueueAction(action);
	}
})