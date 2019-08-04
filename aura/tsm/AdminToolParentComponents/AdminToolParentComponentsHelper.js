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
                        component.set('v.minValue', result.Max_Value__c);
                    } 
                    if(result.RiskTypeName__c == "LRF"){
                        newRiskObject.LRF = {};
                        newRiskObject.LRF = {id:result.Id,name:result.RiskTypeName__c,active:result.Active__c,minValue:result.Min_Value__c,maxValue:result.Max_Value__c,authActive:result.Auth_Active__c,unauthActive:result.Unauth_Active__c,showCriteriaRuleInOmega:result.ShowCriteriaRuleInOmega__c,groupLanguag:result.GroupLanguage__c};
                        component.set('v.maxValue', result.Max_Value__c);
                      
                    }
                    if(result.RiskTypeName__c == "HRF"){
                        newRiskObject.HRF = {};
                        newRiskObject.HRF = {id:result.Id,name:result.RiskTypeName__c,active:result.Active__c,minValue:result.Min_Value__c,maxValue:result.Max_Value__c,authActive:result.Auth_Active__c,unauthActive:result.Unauth_Active__c,showCriteriaRuleInOmega:result.ShowCriteriaRuleInOmega__c,groupLanguag:result.GroupLanguage__c};
                      
                    }
                });
                var oldRiskObject = JSON.parse(JSON.stringify(newRiskObject));
                component.set('v.newRiskTypeOBJ',newRiskObject);
                component.set('v.oldRiskTypeOBJ',oldRiskObject);
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
	},
	saveHistoryFMICriteria : function(component, event, helper) {
        var riskCriteriaComponent=component.find("RiskCriteriaComponent").get('v.newRiskCriteriaOBJ');
        var riskTypeComponent=component.find("RiskTypesComponent").get('v.newRiskTypeOBJ');
        var saveRiskObject = {};
        saveRiskObject.fraudConfig = {};
        saveRiskObject.fraudConfig.riskCriteria = [];
        saveRiskObject.fraudConfig.riskType = [];
        for(var riskCriteriaVar in riskCriteriaComponent) {
            var riskCriteriaListObject;
            if(riskCriteriaComponent[riskCriteriaVar].customAttributeValue === undefined){
                riskCriteriaListObject = {id:riskCriteriaComponent[riskCriteriaVar].id,name:riskCriteriaComponent[riskCriteriaVar].name,weight:riskCriteriaComponent[riskCriteriaVar].weight};
            	saveRiskObject.fraudConfig.riskCriteria.push(riskCriteriaListObject);
            } else {
             	riskCriteriaListObject = {id:riskCriteriaComponent[riskCriteriaVar].id,name:riskCriteriaComponent[riskCriteriaVar].name,weight:riskCriteriaComponent[riskCriteriaVar].weight,customAttributeName:riskCriteriaComponent[riskCriteriaVar].customAttributeName,customAttributeValue:riskCriteriaComponent[riskCriteriaVar].customAttributeValue.toString()};
            	saveRiskObject.fraudConfig.riskCriteria.push(riskCriteriaListObject);
            }
            
        }
        for(var riskTypeVar in riskTypeComponent) {
            var riskTypeListObject = {id:riskTypeComponent[riskTypeVar].id,name:riskTypeComponent[riskTypeVar].name,active:riskTypeComponent[riskTypeVar].active,minValue:riskTypeComponent[riskTypeVar].minValue,maxValue:riskTypeComponent[riskTypeVar].maxValue,authActive:riskTypeComponent[riskTypeVar].authActive,unauthActive:riskTypeComponent[riskTypeVar].unauthActive,showCriteriaRuleInOmega:riskTypeComponent[riskTypeVar].showCriteriaRuleInOmega};
            saveRiskObject.fraudConfig.riskType.push(riskTypeListObject);
        }
        
        var selectedLocale = component.find("LocaleComponent").get("v.selectedOption");
        saveRiskObject.fraudConfig.changedLocale = selectedLocale;
        var selectedLocale = component.find("LocaleComponent").get("v.selectedOption");
        saveRiskObject.fraudConfig.emailid =  component.get("v.userEmail");
        console.log(JSON.stringify(saveRiskObject));
            helper.saveRisk(component,JSON.stringify(saveRiskObject));
        component.set("v.isDisabled",true);
    },
	saveRisk : function(component,fraudConfig) {
		var action = component.get("c.saveRisk");
        action.setParams({fraudConfig:fraudConfig});
        action.setCallback(this,function(response) {
        	var state = response.getState();
        	if (state === "SUCCESS") {
                var results = response.getReturnValue();
                console.log(results);
                var newRiskTypeObject = component.get('v.newRiskTypeOBJ');
                var oldRiskTypeObject = JSON.parse(JSON.stringify(newRiskTypeObject));
				component.set('v.newRiskTypeOBJ',newRiskTypeObject);
                component.set('v.oldRiskTypeOBJ',oldRiskTypeObject); 
                var oldRiskCriteriaObject = component.get('v.newRiskCriteriaOBJ');
                var newRiskCriteriaObject = JSON.parse(JSON.stringify(oldRiskCriteriaObject));
				component.set('v.newRiskCriteriaOBJ',oldRiskCriteriaObject);
                component.set('v.oldRiskCriteriaOBJ',newRiskCriteriaObject);
                component.set('v.isOpen',"false");
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
	},validateUser : function(component, event, helper) {
		var action = component.get("c.isAuthorized");
        action.setCallback(this,function(response) {
        	var state = response.getState();
        	if (state === "SUCCESS") {
                var results = response.getReturnValue();
                console.log(results);
                if(results == true) {
                    component.set('v.isValidUser', 'valid');
                } else {
                    component.set('v.isValidUser', 'notValid');
                }
                
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