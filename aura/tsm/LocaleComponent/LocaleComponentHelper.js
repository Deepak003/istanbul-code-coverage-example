({
	onChangeLocaleHelper : function(component,groupLocale) {
		var action = component.get("c.Initialization");
        action.setParams({groupLocale:groupLocale});
        action.setCallback(this,function(response) {
        	var state = response.getState();
        	if (state === "SUCCESS") {
                var results = response.getReturnValue();
                console.log(results);
                var newRiskObject = {};
                results.forEach(function (result){
                    if(result.RiskTypeName__c == "NORMAL"){
                        newRiskObject.NORMAL = {};
                        newRiskObject.NORMAL = {id:result.Id,name:result.RiskTypeName__c,active:result.Active__c,minValue:result.Min_Value__c,maxValue:result.Max_Value__c,authActive:result.Auth_Active__c,unauthActive:result.Unauth_Active__c,showCriteriaRuleInOmega:result.ShowCriteriaRuleInOmega__c,groupLanguag:result.GroupLanguage__c};
                    } 
                    if(result.RiskTypeName__c == "LRF"){
                        newRiskObject.LRF = {};
                        newRiskObject.LRF = {id:result.Id,name:result.RiskTypeName__c,active:result.Active__c,minValue:result.Min_Value__c,maxValue:result.Max_Value__c,authActive:result.Auth_Active__c,unauthActive:result.Unauth_Active__c,showCriteriaRuleInOmega:result.ShowCriteriaRuleInOmega__c,groupLanguag:result.GroupLanguage__c};
                      
                    }
                    if(result.RiskTypeName__c == "HRF"){
                        newRiskObject.HRF = {};
                        newRiskObject.HRF = {id:result.Id,name:result.RiskTypeName__c,active:result.Active__c,minValue:result.Min_Value__c,maxValue:result.Max_Value__c,authActive:result.Auth_Active__c,unauthActive:result.Unauth_Active__c,showCriteriaRuleInOmega:result.ShowCriteriaRuleInOmega__c,groupLanguag:result.GroupLanguage__c};
                      
                    }
                });
                component.set(component.find("RiskTypesComponent").get('v.newRiskTypeOBJ'),newRiskObject);
                component.set(component.find("RiskTypesComponent").get('v.oldRiskTypeOBJ'),newRiskObject);
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
	}
})