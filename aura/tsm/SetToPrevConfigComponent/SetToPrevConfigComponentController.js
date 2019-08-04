({
    onClickSave: function(component, event, helper) {     
        component.set("v.isOpen", true); 
        var action = component.get("c.riskCriteriaInitialization");
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var results = response.getReturnValue();
                var indexVal = component.get("v.clickedIndex");
                var fraudDataObj = component.get("v.historyData");
                var requiredId = fraudDataObj[indexVal].id;
                var historyRules = fraudDataObj[indexVal].originalValue.riskCriteria;
                component.set("v.historyRulesName", historyRules);
                component.set("v.riskCriteriaObj", results);
                component.set("v.historyRulesLength", historyRules.length);
                component.set("v.allRulesLength", results.length);
                var allRulesArray = [];
                var historyRulesArray = [];
                for(var i = 0; i< results.length; i++){
                    var ruleName = results[i].Name;
                    if( ruleName !== 'lopsidedTradesCriteria'){ 
                        allRulesArray.push(ruleName);
                    }
                }
                for(var i = 0; i< historyRules.length; i++){
                    var ruleName = historyRules[i].Name;
                    historyRulesArray.push(ruleName);
                }
                console.log(allRulesArray);
                console.log(historyRulesArray);
                
                if(historyRulesArray.length < allRulesArray.length){
                    var newRules = [];
                    newRules = allRulesArray.filter(
                        function(e) {
                            return this.indexOf(e) < 0;
                        },
                        historyRulesArray
                    );
                    console.log(newRules);
                    component.set("v.newRulesNames", newRules);
                    var newRuleSet = new Set([]);
                    for(var i=0; i < newRules.length; i++){
                        var newRuleName = newRules[i];
                        for(let j=0; j<results.length; j++){
                            if(results[j].Name == newRuleName) {
                                newRuleSet.add(results[j].Criteria_Description__c);
                                break;
                            }
                        }
                    }
                    let newRulesArray = Array.from(newRuleSet);
                    component.set("v.newRulesSet", newRulesArray);
                    console.log(newRulesArray);
                }
            }
            else if (state === "INCOMPLETE") {}
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " +
                                        errors[0].message);
                        }
                    } else { console.log("Unknown error");}
                }
        });
        $A.enqueueAction(action);          
    },
    
    closeModel: function(component, event, helper) {
        component.set("v.isOpen", false);
    },
    
    onClickConfirm: function(component, event, helper) {
        var allRulesObj = component.get("v.riskCriteriaObj");
        var historyRulesName = component.get("v.historyRulesName");
        var newRulesNames = component.get("v.newRulesNames");
        var newObject = {};
        
        allRulesObj.forEach(function (result){
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
        for(var i = 0; i< historyRulesName.length; i++){
          var ruleName = historyRulesName[i].Name;
                if(ruleName == 'accountCreatedHours' || ruleName == 'tosDisputeRule' || ruleName == 'numberOfContacts' || ruleName == 'numberOfContactsDays' || ruleName == 'winLossAndClubDeletion' || ruleName == 'unauthenticatedLocationMultiplier' || ruleName == 'selfServiceRule' || ruleName == 'clubDeletion' || ruleName == 'multiplePersonasCriteria' || ruleName == 'multipleGrantCriteria' || ruleName == 'completeSet' ||  ruleName == 'coolDown') {
                     newObject[ruleName].weight = historyRulesName[i].Weight__c;
                  	 newObject[ruleName].customAttributeValue = historyRulesName[i].Custom_Attribute_Value__c; 
                } else {
                   	if(newObject[ruleName] != undefined) {
                  		newObject[ruleName].weight = historyRulesName[i].Weight__c;
                	} 
    			}
        }  
        for(var i=0; i< newRulesNames.length; i++){
          newObject[newRulesNames[i]].weight = 0;
          if(newRulesNames[i] == 'numberOfTOSContactsDays' || newRulesNames[i] == 'numberOfDaysFailure' || newRulesNames[i] == 'numberOfDays' || newRulesNames[i] == 'coolDown' ){
            newObject[newRulesNames[i]].weight = 30;
          }
          if(newRulesNames[i] == 'tosDisputeRule' || newRulesNames[i] == 'numberOfContactsDays' || newRulesNames[i] == 'paymentFailureRule' || newRulesNames[i] == 'numberOfContactsInWeeks'){
            newObject[newRulesNames[i]].customAttributeValue = 99;
          }
          if(newRulesNames[i] == 'completeSet'){
            newObject[newRulesNames[i]].customAttributeValue = 3;
          }
          if(newRulesNames[i] == 'multiplePersonasCriteria'){
            newObject[newRulesNames[i]].customAttributeValue = 9;
          }
          if(newRulesNames[i] == 'multipleGrantCriteria'){
            newObject[newRulesNames[i]].customAttributeValue = 20;
          }
          if(newRulesNames[i] == 'numberOfWeeks'){
            newObject[newRulesNames[i]].weight = 4;
          }
        }
        var prevHistoryDetailsEvt = $A.get("e.c:PreviousHistoryDetails");
        prevHistoryDetailsEvt.setParam("newRiskCriteriaOBJ" , newObject);
        prevHistoryDetailsEvt.fire();
        
        component.set("v.isOpen", false);
    }
})