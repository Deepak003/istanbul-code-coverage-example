({
	saveFMICriteria : function(component, event, helper) {
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
    doInit : function(component, event, helper) {
        component.set("v.selectedLocale","English");
        helper.validateUser(component, event, helper);
    component.set("v.currentURL",window.location.href);
	var action = component.get("c.fetchUser");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
               // set current user information on userInfo attribute
                component.set("v.userEmail", storeResponse);
            }
        });
        $A.enqueueAction(action);
    } , 
    onChangeLocale: function (component, event, helper) {
        var selectedLocale = component.find("LocaleComponent").get("v.selectedOption");
        component.find("RiskTypesComponent").set('v.routingOptionsObj',component.find("RiskTypesComponent").get("v.riskTypeOptionByLocale")[selectedLocale]);
        component.find("RunTestComponent").set("v.selectedLocale",selectedLocale);
        helper.onChangeLocaleHelper(component,selectedLocale);
    },
    changeRiskTypeHandler: function (component, event, helper) {
        var minValue = component.find("RiskTypesComponent").get("v.minRiskTypeValue");
        var maxValue = component.find("RiskTypesComponent").get("v.maxRiskTypeValue");
        component.set("v.maxValue",maxValue);
        component.set("v.minValue",minValue);
    },
    changeSliderHandler: function (component, event, helper) {
        var minValue1 = event.getParam("minSliderValue");
        var maxValue1 = event.getParam("maxSliderValue");
        component.set("v.maxValue",maxValue1);
        component.set("v.minValue",minValue1);
        component.set("v.newRiskTypeOBJ.NORMAL.maxValue",parseInt(minValue1));
        component.set("v.newRiskTypeOBJ.LRF.maxValue",parseInt(maxValue1));

        component.set('v.newRiskTypeOBJ.LRF.active',true);
        component.set('v.newRiskTypeOBJ.HRF.active',true);
        if(minValue1 != 100 && minValue1 != 0){
        	minValue1 = ++minValue1;
        }
        if(maxValue1 != 100 && maxValue1 != 0){
        	maxValue1 = ++maxValue1;
        }
        component.set("v.newRiskTypeOBJ.LRF.minValue",minValue1);
        component.set("v.newRiskTypeOBJ.HRF.minValue",maxValue1);
        component.set("v.newRiskTypeOBJ.HRF.maxValue",100);
		if(event.getParam("minSliderValue") == 100 || event.getParam("minSliderValue") == event.getParam("maxSliderValue")){
            component.set("v.newRiskTypeOBJ.LRF.minValue",0);
        	component.set("v.newRiskTypeOBJ.LRF.maxValue",0);
	        component.set('v.newRiskTypeOBJ.LRF.active',false);
        }
        if(event.getParam("maxSliderValue") == 100){
            component.set("v.newRiskTypeOBJ.HRF.minValue",0);
        	component.set("v.newRiskTypeOBJ.HRF.maxValue",0);
	        component.set('v.newRiskTypeOBJ.HRF.active',false);
        }

    }, callRunTest:function (component, event, helper) {
        var riskCriteriaComponent=component.find("RiskCriteriaComponent").get('v.newRiskCriteriaOBJ');
        var riskTypeComponent=component.find("RiskTypesComponent").get('v.newRiskTypeOBJ');
        var caseNumber=component.find("RunTestComponent").get('v.caseNumber');
        var selectedLocale = component.find("LocaleComponent").get("v.selectedOption");
        var requestObj = {};
        requestObj.riskCriteria = [];
        requestObj.riskType = [];
        for(var riskCriteriaVar in riskCriteriaComponent) {
            var riskCriteriaListObject;
            if(riskCriteriaComponent[riskCriteriaVar].customAttributeValue === undefined){
                riskCriteriaListObject = {id:riskCriteriaComponent[riskCriteriaVar].id,name:riskCriteriaComponent[riskCriteriaVar].name,weight:riskCriteriaComponent[riskCriteriaVar].weight};
            } else {
             	riskCriteriaListObject = {id:riskCriteriaComponent[riskCriteriaVar].id,name:riskCriteriaComponent[riskCriteriaVar].name,weight:riskCriteriaComponent[riskCriteriaVar].weight,customAttributeName:riskCriteriaComponent[riskCriteriaVar].customAttributeName,customAttributeValue:riskCriteriaComponent[riskCriteriaVar].customAttributeValue.toString()};
            }
            requestObj.riskCriteria.push(riskCriteriaListObject);
        }
        for(var riskTypeVar in riskTypeComponent) {
            var riskTypeListObject = {id:riskTypeComponent[riskTypeVar].id,name:riskTypeComponent[riskTypeVar].name,active:riskTypeComponent[riskTypeVar].active,minValue:riskTypeComponent[riskTypeVar].minValue,maxValue:riskTypeComponent[riskTypeVar].maxValue,authActive:riskTypeComponent[riskTypeVar].authActive,unauthActive:riskTypeComponent[riskTypeVar].unauthActive,showCriteriaRuleInOmega:riskTypeComponent[riskTypeVar].showCriteriaRuleInOmega};
            requestObj.riskType.push(riskTypeListObject);
        }
        
        requestObj.locale = selectedLocale;
        requestObj.caseNumberList = caseNumber;
        var reqObject = JSON.stringify(requestObj);
        var action = component.get("c.getTestFraudConfigData");
        action.setParams({fraudConfigStr:reqObject});
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var results = response.getReturnValue();
                var storeResponse = JSON.parse(results);
                var caseInfoList = [];
                component.set("v.oldLRFCount",storeResponse.oldLRFCount);
                component.set("v.newLRFCount",storeResponse.newLRFCount);
                component.set("v.oldHRFCount",storeResponse.oldHRFCount);
                component.set("v.newHRFCount",storeResponse.newHRFCount);
                var caseInfoObjList = storeResponse.caseInfo;
                caseInfoObjList.forEach(function (caseInfo){
                    var caseInfoObj = {};
                    caseInfoObj.caseNumber = caseInfo.caseNumber;
                    caseInfoObj.oldFraudScore  = caseInfo.oldFraudScore;
                    caseInfoObj.newFraudScore = caseInfo.newFraudScore;
                    caseInfoObj.oldfraudType = " (" + caseInfo.oldfraudType +")";
                    caseInfoObj.newfraudType = " (" + caseInfo.newfraudType +")";
                    caseInfoList.push(caseInfoObj);
                });
                component.set("v.testRunObject",caseInfoList);
                component.set("v.isRendred",true);
            }
        });
        $A.enqueueAction(action);
    }, resetChanges :function (component, event, helper) {
        var newRiskTypeObject = component.get('v.oldRiskTypeOBJ');
        var oldRiskTypeObject = JSON.parse(JSON.stringify(newRiskTypeObject));
        var newestRiskTypeObject = JSON.parse(JSON.stringify(newRiskTypeObject));
        component.set('v.newRiskTypeOBJ',newestRiskTypeObject);
        component.set('v.oldRiskTypeOBJ',oldRiskTypeObject); 
        var oldRiskCriteriaObject = component.get('v.oldRiskCriteriaOBJ');
        var newRiskCriteriaObject = JSON.parse(JSON.stringify(oldRiskCriteriaObject));
        var newestRiskCriteriaObject = JSON.parse(JSON.stringify(oldRiskCriteriaObject));
        component.set('v.newRiskCriteriaOBJ',newRiskCriteriaObject);
        component.set('v.oldRiskCriteriaOBJ',newestRiskCriteriaObject);
        component.set("v.maxValue",newestRiskTypeObject.LRF.maxValue);
        component.set("v.minValue",newestRiskTypeObject.NORMAL.maxValue);
        component.set("v.isDisabled",true);
    },
    
    checkDifference :function (component, event, helper) {
       	var oldRiskCriteriaObject = component.get('v.oldRiskCriteriaOBJ');
        var oldRiskCriteriaObj = JSON.parse(JSON.stringify(oldRiskCriteriaObject));
        var newRiskCriteriaObject = component.get('v.newRiskCriteriaOBJ');
        var newRiskCriteriaObj = JSON.parse(JSON.stringify(newRiskCriteriaObject));
        component.set("v.oldRiskCriteriaDiffOBJ",oldRiskCriteriaObj);
        component.set("v.newRiskCriteriaDiffOBJ",newRiskCriteriaObj);
        var differenceRiskCriteria = new Set([]);
        for(var riskCriteriaVar in oldRiskCriteriaObj) {
        	if(oldRiskCriteriaObj[riskCriteriaVar].customAttributeValue == undefined){
                if(oldRiskCriteriaObj[riskCriteriaVar].weight != newRiskCriteriaObj[riskCriteriaVar].weight) {
                    if(oldRiskCriteriaObj[riskCriteriaVar].name === 'numberOfMinutes') {
                        differenceRiskCriteria.add('numberOfContacts');
                    } else if(oldRiskCriteriaObj[riskCriteriaVar].name === 'numberOfDays'){
                        differenceRiskCriteria.add('numberOfContactsDays');
                    } else if(oldRiskCriteriaObj[riskCriteriaVar].name === 'numberOfWeeks'){
                        differenceRiskCriteria.add('numberOfContactsInWeeks');
                    } else if(oldRiskCriteriaObj[riskCriteriaVar].name === 'numberOfTOSContactsDays'){
                        differenceRiskCriteria.add('tosDisputeRule');
                    } else if(oldRiskCriteriaObj[riskCriteriaVar].name === 'numberOfDaysFailure'){
                        differenceRiskCriteria.add('paymentFailureRule');
                    } else {
                    	differenceRiskCriteria.add(oldRiskCriteriaObj[riskCriteriaVar].name);
                    }
                    if(oldRiskCriteriaObj[riskCriteriaVar].category === 'Account Properties'){
                        component.set("v.accountType",true);
                    } else if (oldRiskCriteriaObj[riskCriteriaVar].category === 'Contact Behavior'){
                        component.set("v.contactType",true);
                    } else if (oldRiskCriteriaObj[riskCriteriaVar].category === 'FIFA Rules'){
                    	component.set("v.fifaType",true);
                    } else if (oldRiskCriteriaObj[riskCriteriaVar].category === 'Location'){
                    	component.set("v.locationType",true);
                    } else {
                        component.set("v.masterType",true);
                    }
                }
            } else {
                if((oldRiskCriteriaObj[riskCriteriaVar].weight != newRiskCriteriaObj[riskCriteriaVar].weight) || (oldRiskCriteriaObj[riskCriteriaVar].customAttributeValue != newRiskCriteriaObj[riskCriteriaVar].customAttributeValue)) {
                    if(oldRiskCriteriaObj[riskCriteriaVar].name === 'numberOfMinutes') {
                        differenceRiskCriteria.add('numberOfContacts');
                    } else if(oldRiskCriteriaObj[riskCriteriaVar].name === 'numberOfDays'){
                        differenceRiskCriteria.add('numberOfContactsDays');
                    } else if(oldRiskCriteriaObj[riskCriteriaVar].name === 'numberOfWeeks'){
                        differenceRiskCriteria.add('numberOfContactsInWeeks');
                    } else if(oldRiskCriteriaObj[riskCriteriaVar].name === 'numberOfTOSContactsDays'){
                        differenceRiskCriteria.add('tosDisputeRule');
                    } else if(oldRiskCriteriaObj[riskCriteriaVar].name === 'numberOfDaysFailure'){
                        differenceRiskCriteria.add('paymentFailureRule');
                    } else {
                    	differenceRiskCriteria.add(oldRiskCriteriaObj[riskCriteriaVar].name);
                    }
                    if(oldRiskCriteriaObj[riskCriteriaVar].category === 'Account Properties'){
                        component.set("v.accountType",true);
                    } else if (oldRiskCriteriaObj[riskCriteriaVar].category === 'Contact Behavior'){
                        component.set("v.contactType",true);
                    } else if (oldRiskCriteriaObj[riskCriteriaVar].category === 'FIFA Rules'){
                    	component.set("v.fifaType",true);
                    } else if (oldRiskCriteriaObj[riskCriteriaVar].category === 'Location'){
                    	component.set("v.locationType",true);
                    } else {
                        component.set("v.masterType",true);
                    }
                }
            }
        }
        var diffRiskCriteria = Array.from(differenceRiskCriteria);
        component.set("v.riskCriteriaDiffObj",diffRiskCriteria);
        
        var oldRiskTypeObject = component.get('v.oldRiskTypeOBJ');
        var newRiskTypeObject = component.get('v.newRiskTypeOBJ');
        var newRiskTypeObj = JSON.parse(JSON.stringify(newRiskTypeObject));
        var oldRiskTypeObj = JSON.parse(JSON.stringify(oldRiskTypeObject));
        component.set("v.oldRiskTypeDiffOBJ",oldRiskTypeObj);
        component.set("v.newRiskTypeDiffOBJ",newRiskTypeObj);
        for(var riskTypeVar in oldRiskTypeObj) {
            var diffRiskType = {};
			if((oldRiskTypeObj[riskTypeVar].active != newRiskTypeObj[riskTypeVar].active) || (oldRiskTypeObj[riskTypeVar].minValue != newRiskTypeObj[riskTypeVar].minValue) || (oldRiskTypeObj[riskTypeVar].maxValue != newRiskTypeObj[riskTypeVar].maxValue) || (oldRiskTypeObj[riskTypeVar].authActive != newRiskTypeObj[riskTypeVar].authActive) || (oldRiskTypeObj[riskTypeVar].unauthActive != newRiskTypeObj[riskTypeVar].unauthActive) || (oldRiskTypeObj[riskTypeVar].showCriteriaRuleInOmega != newRiskTypeObj[riskTypeVar].showCriteriaRuleInOmega)) {
                if(oldRiskTypeObj[riskTypeVar].name == 'NORMAL') {
                    component.set("v.normal",true);
                }
                if(oldRiskTypeObj[riskTypeVar].name == 'LRF') {
                    component.set("v.lrf",true);
                }
                if(oldRiskTypeObj[riskTypeVar].name == 'HRF') {
                    component.set("v.hrf",true);
                }
              //  component.set("v.isDisabled",true);
			}
        }
        component.set("v.isOpen",true);
        var selectedLocale = component.find("LocaleComponent").get("v.selectedOption");
        component.set("v.selectedLocale",selectedLocale);
    }, onChangeRisk :function (component, event, helper) {
       	var oldRiskCriteriaObject = component.get('v.oldRiskCriteriaOBJ');
        var oldRiskCriteriaObj = JSON.parse(JSON.stringify(oldRiskCriteriaObject));
        var newRiskCriteriaObject = component.get('v.newRiskCriteriaOBJ');
        var newRiskCriteriaObj = JSON.parse(JSON.stringify(newRiskCriteriaObject));
        var isBoolean = true;
        for(var riskCriteriaVar in oldRiskCriteriaObj) {
        	if(oldRiskCriteriaObj[riskCriteriaVar].customAttributeValue == undefined){
                if(oldRiskCriteriaObj[riskCriteriaVar].weight != newRiskCriteriaObj[riskCriteriaVar].weight) {
                    isBoolean = false;
                }
            } else {
                if((oldRiskCriteriaObj[riskCriteriaVar].weight != newRiskCriteriaObj[riskCriteriaVar].weight) || (oldRiskCriteriaObj[riskCriteriaVar].customAttributeValue != newRiskCriteriaObj[riskCriteriaVar].customAttributeValue)) {
                    isBoolean = false;
                }
            }
        }
        
        var oldRiskTypeObject = component.get('v.oldRiskTypeOBJ');
        var newRiskTypeObject = component.get('v.newRiskTypeOBJ');
        var newRiskTypeObj = JSON.parse(JSON.stringify(newRiskTypeObject));
        var oldRiskTypeObj = JSON.parse(JSON.stringify(oldRiskTypeObject));
        for(var riskTypeVar in oldRiskTypeObj) {
			if((oldRiskTypeObj[riskTypeVar].active != newRiskTypeObj[riskTypeVar].active) || (oldRiskTypeObj[riskTypeVar].minValue != newRiskTypeObj[riskTypeVar].minValue) || (oldRiskTypeObj[riskTypeVar].maxValue != newRiskTypeObj[riskTypeVar].maxValue) || (oldRiskTypeObj[riskTypeVar].authActive != newRiskTypeObj[riskTypeVar].authActive) || (oldRiskTypeObj[riskTypeVar].unauthActive != newRiskTypeObj[riskTypeVar].unauthActive) || (oldRiskTypeObj[riskTypeVar].showCriteriaRuleInOmega != newRiskTypeObj[riskTypeVar].showCriteriaRuleInOmega)) {
                isBoolean = false;
			}
        }
        component.set("v.isDisabled",isBoolean);
    },logout :function(component, event, helper) {
        var url = window.location.href;
        var urlSplitter = url.split("/c/VBRAdminTool.app");
        var logoutUrl = urlSplitter[0] + "/secur/logout.jsp"; 
        window.location.replace(logoutUrl);
    },
    handlePreviousHistoryDetails : function (component,event,helper) {
        var newRiskCriteriaOBJ = event.getParam("newRiskCriteriaOBJ");
        component.find("RiskCriteriaComponent").set("v.newRiskCriteriaOBJ", newRiskCriteriaOBJ);
        //component.set("v.newRiskCriteriaOBJ", newRiskCriteriaOBJ);
        helper.saveHistoryFMICriteria(component, event, helper);
       
    }
})