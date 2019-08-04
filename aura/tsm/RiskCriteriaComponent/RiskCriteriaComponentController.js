({
    handleSectionToggle: function (cmp) {
        var activeSectionName = cmp.find("accordion").get('v.activeSectionName');
        cmp.set('v.activeSections', activeSectionName);
    },
    doInit : function(component) {
/*	    var contractWeight = [];
	    var weightObj = component.get("v.Weights");
	    for(i in weightObj){
	        contractWeight.push(x);
	    }
*///	    component.set("v.contractWeight",contractWeight);
		var action = component.get("c.riskCriteriaInitialization");
        action.setCallback(this,function(response) {
        	var state = response.getState();
        	if (state === "SUCCESS") {
                var results = response.getReturnValue();
                console.log(results);
				var newObject = {};
				
                results.forEach(function (result){
                 	if(result.Name == "birthdayRule"){
						newObject.birthdayRule={};
                        newObject.birthdayRule = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
                    
					if(result.Name == "multipleGrantCriteria"){
						newObject.multipleGrantCriteria={};
						newObject.multipleGrantCriteria = {weight:result.Weight__c,id:result.Id,customAttributeValue:parseInt(result.Custom_Attribute_Value__c),customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "multiplePersonasCriteria"){
						newObject.multiplePersonasCriteria={};
						newObject.multiplePersonasCriteria = {weight:result.Weight__c,id:result.Id,customAttributeValue:parseInt(result.Custom_Attribute_Value__c),customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "clubDeletion"){
						newObject.clubDeletion={};
						newObject.clubDeletion = {weight:result.Weight__c,id:result.Id,customAttributeValue:parseInt(result.Custom_Attribute_Value__c),customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "accountCreatedHours"){
						newObject.accountCreatedHours={};
						newObject.accountCreatedHours = {weight:result.Weight__c,id:result.Id,customAttributeValue:parseInt(result.Custom_Attribute_Value__c),customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "franchiseBanCriteria") {
						newObject.franchiseBanCriteria={};
						newObject.franchiseBanCriteria = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "allAccountPropertiesScored"){
						newObject.allAccountPropertiesScored={};
						newObject.allAccountPropertiesScored = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "allContactBehaviorScored"){
						newObject.allContactBehaviorScored={};
						newObject.allContactBehaviorScored = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "allFIFAScored"){
						newObject.allFIFAScored={};
						newObject.allFIFAScored = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "changeInLocation"){
						newObject.changeInLocation={};
						newObject.changeInLocation = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "completeSet"){
						newObject.completeSet={};
						newObject.completeSet = {weight:result.Weight__c,id:result.Id,customAttributeValue:parseInt(result.Custom_Attribute_Value__c),customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "coolDown"){
						newObject.coolDown={};
						newObject.coolDown = {weight:result.Weight__c,id:result.Id,customAttributeValue:parseInt(result.Custom_Attribute_Value__c),customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "numberOfMinutes"){
						newObject.numberOfMinutes={};
						newObject.numberOfMinutes = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
                    
                    if(result.Name == "tosDisputeRule"){
						newObject.tosDisputeRule={};
						newObject.tosDisputeRule = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
                    
                    if(result.Name == "numberOfTOSContactsDays"){
						newObject.numberOfTOSContactsDays={};
						newObject.numberOfTOSContactsDays = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
                    
                    if(result.Name == "paymentFailureRule"){
						newObject.paymentFailureRule={};
						newObject.paymentFailureRule = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
                    
                    if(result.Name == "numberOfDaysFailure"){
						newObject.numberOfDaysFailure={};
						newObject.numberOfDaysFailure = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
                    
                    if(result.Name == "numberOfDays"){
						newObject.numberOfDays={};
						newObject.numberOfDays = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
                    
                    if(result.Name == "numberOfContactsDays"){
						newObject.numberOfContactsDays={};
						newObject.numberOfContactsDays = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }

                    if(result.Name == "numberOfWeeks"){
                        newObject.numberOfWeeks={};
                        newObject.numberOfWeeks = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
                    
                    if(result.Name == "numberOfContactsInWeeks"){
                        newObject.numberOfContactsInWeeks={};
                        newObject.numberOfContactsInWeeks = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }

					if(result.Name == "customerFlag"){
						newObject.customerFlag={};
						newObject.customerFlag = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "customerValue"){
						newObject.customerValue={};
						newObject.customerValue = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "gibberishEmail"){
						newObject.gibberishEmail={};
						newObject.gibberishEmail = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "gibberishName"){
						newObject.gibberishName={};
						newObject.gibberishName = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "numberOfContacts"){
						newObject.numberOfContacts={};
						newObject.numberOfContacts = {weight:result.Weight__c,id:result.Id,customAttributeValue:parseInt(result.Custom_Attribute_Value__c),customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "noSessionData"){
						newObject.noSessionData={};
						newObject.noSessionData = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "fraudCaseCount"){
						newObject.fraudCaseCount={};
						newObject.fraudCaseCount = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "selfServiceRule"){
						newObject.selfServiceRule={};
						newObject.selfServiceRule = {weight:result.Weight__c,id:result.Id,customAttributeValue:parseInt(result.Custom_Attribute_Value__c),customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "autoFraudFlag"){
						newObject.autoFraudFlag={};
						newObject.autoFraudFlag = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "vogPhishing"){
						newObject.vogPhishing={};
						newObject.vogPhishing = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "winLossAndClubDeletion"){
						var booleanConvert = result.Custom_Attribute_Value__c.toLowerCase() === "true";
						newObject.winLossAndClubDeletion={};
						newObject.winLossAndClubDeletion = {weight:result.Weight__c,id:result.Id,customAttributeValue:booleanConvert,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "unauthenticatedLocationMultiplier"){
						var unAuthActive = result.Custom_Attribute_Value__c.toLowerCase() === "true";
						newObject.unauthenticatedLocationMultiplier={};
						newObject.unauthenticatedLocationMultiplier = {weight:result.Weight__c,id:result.Id,customAttributeValue:unAuthActive,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "winLossRatio"){
						newObject.winLossRatio={};
						newObject.winLossRatio = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
					
					if(result.Name == "zeroAccountValue"){
						newObject.zeroAccountValue={};
						newObject.zeroAccountValue = {weight:result.Weight__c,id:result.Id,customAttributeName:result.Custom_Attribute_Name__c,name:result.Name,customAttributeValue:result.Custom_Attribute_Value__c,category:result.RuleCategories__c};
                    }
                });
                console.log(JSON.stringify(newObject));
                var oldObject = JSON.parse(JSON.stringify(newObject));
				component.set('v.newRiskCriteriaOBJ',newObject);
                component.set('v.oldRiskCriteriaOBJ',oldObject);
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
	},onChangeEvent: function (component,event,helper) {
        var riskCriteriaEvent = component.getEvent("riskCriteriaEvent");
        riskCriteriaEvent.fire();
    },
    handlePreviousHistoryDetails : function (component,event,helper) {
        var newRiskCriteriaOBJ = event.getParam("newRiskCriteriaOBJ");
        component.set("v.newRiskCriteriaOBJ", newRiskCriteriaOBJ);
        helper.saveHistoryFMICriteria(component, event, helper);
       
    }
    
})