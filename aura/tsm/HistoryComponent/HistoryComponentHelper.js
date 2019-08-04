({
	next : function(component,event,sObjectList,end,start,pageSize){
    },
    checkValidation:function(component, event, helper,pageNumber){        
    	if (pageNumber <= 0) {
        	component.set("v.pageNumber", 1);
	        pageNumber = 1;
	    }
	    var totalPagesCount = parseInt(component.get('v.totalPagesCount'));
	    if(pageNumber > totalPagesCount){
	        component.set("v.pageNumber", totalPagesCount);
	        pageNumber = totalPagesCount;
	    }                
    
    },
    
    loadPageData :function(component, event, helper,pageNumber){        
		var action = component.get("c.getHistoryData");
        action.setParams({pageNumber:pageNumber});
        action.setCallback(this,function(response) {
        	var state = response.getState();
        	if (state === "SUCCESS") {
                var results = response.getReturnValue();
                var month = new Array();
                month[0] = "January";
                month[1] = "February";
                month[2] = "March";
                month[3] = "April";
                month[4] = "May";
                month[5] = "June";
                month[6] = "July";
                month[7] = "August";
                month[8] = "September";
                month[9] = "October";
                month[10] = "November";
                month[11] = "December";
				var fraudDataList = [];
                component.set('v.historyConfig', JSON.parse(results));
                var data = component.get('v.historyConfig');
                component.set('v.totalCount',data.totalCount);
                var totalPagesCount = Math.ceil(data.totalCount / 10);
                component.set('v.totalPagesCount',totalPagesCount);
                var fraudLocalesSet = new Set([]);
                var fraudDataListObj = data.fraudDataList;
				fraudDataListObj.forEach(function (result){
					var fraudData = {};
                    var dateString = result.createdDate;
					var date = new Date(dateString);
                    var yr = date.getUTCFullYear();
					var mo = month[date.getUTCMonth()];
					var day = date.getUTCDate();
                    var hours = date.getUTCHours();
					var hr = hours < 10 ? '0' + hours : hours;
                    var minutes = date.getUTCMinutes();
					var min = (minutes < 10) ? '0' + minutes : minutes;
					fraudData.emailId = result.emailId;
                    fraudData.id = result.id;
                    fraudData.originalValue = result.originalValue;
					fraudData.date = day + " " + mo + " " + yr;
                    fraudData.time = hr + ":" + min;
					fraudData.riskCriteria = [];
					fraudData.riskType = [];
                    var deltaValueObj = result.deltaValue;
					var riskCriteriaList = deltaValueObj.riskCriteria;
					riskCriteriaList.forEach(function (riskCriteriaObj){
						var riskCriteria = {};
						riskCriteria.name = riskCriteriaObj.name;
                        
						riskCriteria.customVarName = riskCriteriaObj.customVarName;
                        var customVarValueobj = riskCriteriaObj.customVarValue;
						riskCriteria.customVarValue = {};
						riskCriteria.customVarValue.oldValue = customVarValueobj.oldValue;
						riskCriteria.customVarValue.newValue = customVarValueobj.newValue;
                        if(riskCriteria.customVarValue.oldValue != riskCriteria.customVarValue.newValue) {
                            riskCriteria.isCustomVarValueChanged = true;
                        } else {
                            riskCriteria.isCustomVarValueChanged = false;
                        }
						var weightObj = riskCriteriaObj.weight;
                        riskCriteria.weight = {};
						riskCriteria.weight.oldValue = weightObj.oldValue;
						riskCriteria.weight.newValue = weightObj.newValue;
                        if(riskCriteria.name == 'numberOfMinutes') {
                                var newVal = riskCriteria.weight.newValue;
                                var oldVal = riskCriteria.weight.oldValue;
                                component.set('v.numberOfMinNewVal',newVal);
                                component.set('v.numberOfMinOldVal',oldVal);
                         }
                        if(riskCriteria.name == 'numberOfDays') {
                                var newVal = riskCriteria.weight.newValue;
                                var oldVal = riskCriteria.weight.oldValue;
                                component.set('v.numberOfDaysNewVal',newVal);
                                component.set('v.numberOfDaysOldVal',oldVal);
                         }
                        if(riskCriteria.name == 'numberOfWeeks') {
                            var newVal = riskCriteria.weight.newValue;
                            var oldVal = riskCriteria.weight.oldValue;
                            component.set('v.numberOfWeeksNewVal',newVal);
                            component.set('v.numberOfWeeksOldVal',oldVal);
                        }
                        if(riskCriteria.name == 'numberOfTOSContactsDays') {
                                var newVal = riskCriteria.weight.newValue;
                                var oldVal = riskCriteria.weight.oldValue;
                                component.set('v.numberOfTOSContactsDaysNewVal',newVal);
                                component.set('v.numberOfTOSContactsDaysOldVal',oldVal);
                         }
                        if(riskCriteria.name == 'numberOfDaysFailure') {
                                var newVal = riskCriteria.weight.newValue;
                                var oldVal = riskCriteria.weight.oldValue;
                                component.set('v.numberOfDaysFailureNewVal',newVal);
                                component.set('v.numberOfDaysFailureOldVal',oldVal);
                         }
                        if(riskCriteria.weight.oldValue != riskCriteria.weight.newValue) {
                            riskCriteria.isWeightChanged = true;
                        } else {
                            riskCriteria.isWeightChanged = false;
                        }
						fraudData.riskCriteria.push(riskCriteria);
					});
                    var changedLocale = deltaValueObj.changedLocale;
					var riskTypeList = deltaValueObj.riskType;
					riskTypeList.forEach(function (riskTypeObj){
						var riskType = {};
						riskType.name = riskTypeObj.name;
						riskType.locale = riskTypeObj.locale
                        fraudLocalesSet.add(riskType.locale);
                        var ActiveObj = riskTypeObj.active;
						riskType.active = {};
						riskType.active.oldValue = ActiveObj.oldValue;
						riskType.active.newValue = ActiveObj.newValue;
                        if(riskType.active.oldValue != riskType.active.newValue) {
                            riskType.isActiveChanged = true;
                        } else {
                            riskType.isActiveChanged = false;
                        }
                        var authActiveObj = riskTypeObj.authActive;
						riskType.authActive = {};
						riskType.authActive.oldValue = authActiveObj.oldValue;
						riskType.authActive.newValue = authActiveObj.newValue;
                        if(riskType.authActive.oldValue != riskType.authActive.newValue) {
                            riskType.isAuthActiveChanged = true;
                        } else {
                            riskType.isAuthActiveChanged = false;
                        }
						var maxValueObj = riskTypeObj.maxValue;
                        riskType.maxValue = {};
						riskType.maxValue.oldValue = maxValueObj.oldValue;
						riskType.maxValue.newValue = maxValueObj.newValue;
                        if(riskType.maxValue.oldValue != riskType.maxValue.newValue) {
                            riskType.isMaxValueChanged = true;
                        } else {
                            riskType.isMaxValueChanged = false;
                        }
                        var minValueObj = riskTypeObj.minValue;
						riskType.minValue = {};
						riskType.minValue.oldValue = minValueObj.oldValue;
						riskType.minValue.newValue = minValueObj.newValue;
                        if(riskType.minValue.oldValue != riskType.minValue.newValue) {
                            riskType.isMinValueChanged = true;
                        } else {
                            riskType.isMinValueChanged = false;
                        }
                        var unauthActiveObj = riskTypeObj.unauthActive;
						riskType.unauthActive = {};
						riskType.unauthActive.oldValue = unauthActiveObj.oldValue;
						riskType.unauthActive.newValue = unauthActiveObj.newValue;
                        if(riskType.unauthActive.oldValue != riskType.unauthActive.newValue) {
                            riskType.isUnauthActiveChanged = true;
                        } else {
                            riskType.isUnauthActiveChanged = false;
                        }
                        if(riskTypeObj.showCriteriaRuleInOmega !== 'undefined' && riskTypeObj.showCriteriaRuleInOmega != null) {
                            var showCriteriaRuleInOmegaObj = riskTypeObj.showCriteriaRuleInOmega;
                            riskType.showCriteriaRuleInOmega = {};
                            riskType.showCriteriaRuleInOmega.oldValue = showCriteriaRuleInOmegaObj.oldValue;
                            riskType.showCriteriaRuleInOmega.newValue = showCriteriaRuleInOmegaObj.newValue;
                            if(riskType.showCriteriaRuleInOmega.oldValue != riskType.showCriteriaRuleInOmega.newValue) {
                                riskType.isShowCriteriaChanged = true;
                            } else {
                                riskType.isShowCriteriaChanged = false;
                            }
                        } else {
                            riskType.showCriteriaRuleInOmega = {};
                            riskType.showCriteriaRuleInOmega.oldValue = false;
                            riskType.showCriteriaRuleInOmega.newValue = false;
                            riskType.isShowCriteriaChanged = false;
                        }
						fraudData.riskType.push(riskType);
					});
                    fraudData.changedLocale = changedLocale;
                    fraudData.OriginalChangedLocale = changedLocale;
                    fraudData.expandable = false;
					fraudDataList.push(fraudData);
				});
                var fraudLocalesList = Array.from(fraudLocalesSet);
                component.set('v.localeList',fraudLocalesList);
                console.log(fraudDataList);
                component.set('v.fraudDataList',fraudDataList);            
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
        component.set("v.isOpen", true);
    
    }
})