({
	doInit : function(component,groupLocale) {
		var action = component.get("c.Initialization");
        action.setParams({groupLocale:groupLocale});
        action.setCallback(this,function(response) {
        	var state = response.getState();
        	if (state === "SUCCESS") {
                var results = response.getReturnValue();
                console.log(results);
                var newRiskObject = {};
                var oldRiskObject = {};
                results.forEach(function (result){
                    if(result.RiskTypeName__c == "NORMAL"){
                        newRiskObject.NORMAL = {};
                        newRiskObject.NORMAL = {id:result.Id,name:result.RiskTypeName__c,active:result.Active__c,minValue:result.Min_Value__c,maxValue:result.Max_Value__c,authActive:result.Auth_Active__c,unauthActive:result.Unauth_Active__c,showCriteriaRuleInOmega:result.ShowCriteriaRuleInOmega__c,groupLanguag:result.GroupLanguage__c};
                        oldRiskObject.NORMAL = {};
                        oldRiskObject.NORMAL = {id:result.Id,name:result.RiskTypeName__c,active:result.Active__c,minValue:result.Min_Value__c,maxValue:result.Max_Value__c,authActive:result.Auth_Active__c,unauthActive:result.Unauth_Active__c,showCriteriaRuleInOmega:result.ShowCriteriaRuleInOmega__c,groupLanguag:result.GroupLanguage__c};
                    } 
                    if(result.RiskTypeName__c == "LRF"){
                        newRiskObject.LRF = {};
                        newRiskObject.LRF = {id:result.Id,name:result.RiskTypeName__c,active:result.Active__c,minValue:result.Min_Value__c,maxValue:result.Max_Value__c,authActive:result.Auth_Active__c,unauthActive:result.Unauth_Active__c,showCriteriaRuleInOmega:result.ShowCriteriaRuleInOmega__c,groupLanguag:result.GroupLanguage__c};
                        oldRiskObject.LRF = {};
                        oldRiskObject.LRF = {id:result.Id,name:result.RiskTypeName__c,active:result.Active__c,minValue:result.Min_Value__c,maxValue:result.Max_Value__c,authActive:result.Auth_Active__c,unauthActive:result.Unauth_Active__c,showCriteriaRuleInOmega:result.ShowCriteriaRuleInOmega__c,groupLanguag:result.GroupLanguage__c};
                    }
                    if(result.RiskTypeName__c == "HRF"){
                        newRiskObject.HRF = {};
                        newRiskObject.HRF = {id:result.Id,name:result.RiskTypeName__c,active:result.Active__c,minValue:result.Min_Value__c,maxValue:result.Max_Value__c,authActive:result.Auth_Active__c,unauthActive:result.Unauth_Active__c,showCriteriaRuleInOmega:result.ShowCriteriaRuleInOmega__c,groupLanguag:result.GroupLanguage__c};
                        oldRiskObject.HRF = {};
                        oldRiskObject.HRF = {id:result.Id,name:result.RiskTypeName__c,active:result.Active__c,minValue:result.Min_Value__c,maxValue:result.Max_Value__c,authActive:result.Auth_Active__c,unauthActive:result.Unauth_Active__c,showCriteriaRuleInOmega:result.ShowCriteriaRuleInOmega__c,groupLanguag:result.GroupLanguage__c};
                    }
                });
                console.log('Initial newRiskObject ' + newRiskObject);
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
	
	getHandleNormalMaxChange : function(component,event,helper){

		var normalMax = parseInt(component.get('v.newRiskTypeOBJ.NORMAL.maxValue'));
        var lrfMax = parseInt(component.get('v.newRiskTypeOBJ.LRF.maxValue'));
		var minVal;
		var maxVal;
        if(normalMax == 100){
	        component.set('v.newRiskTypeOBJ.LRF.active',false);
	        component.set('v.newRiskTypeOBJ.HRF.active',false);
	        minVal = 100;
	        maxVal = 100;
        }
        else if((component.get('v.newRiskTypeOBJ.LRF.active') == true && normalMax >= lrfMax) || (normalMax >= 96)){
	        minVal = normalMax;
	        component.set('v.newRiskTypeOBJ.LRF.active',true);
	        var lrfMin = ++normalMax;
            component.set('v.newRiskTypeOBJ.LRF.minValue', lrfMin);
            if(lrfMin == 100){
                component.set('v.newRiskTypeOBJ.LRF.maxValue', 100);
            	component.set('v.newRiskTypeOBJ.HRF.active',false);
		        maxVal = 100;
            }
            else{
            	var lrfMax = ++ lrfMin;
		        maxVal = lrfMax;
                component.set('v.newRiskTypeOBJ.LRF.maxValue', lrfMax);
                if(lrfMax == 100){
                	component.set('v.newRiskTypeOBJ.HRF.active',false);
			        maxVal = 100;
                }
                else{
        	        component.set('v.newRiskTypeOBJ.HRF.active',true);
            		var hrfMin = ++lrfMax;
	                component.set('v.newRiskTypeOBJ.HRF.minValue', hrfMin);
	                component.set('v.newRiskTypeOBJ.HRF.maxValue', 100);
                }
            }
        }
        else if(component.get('v.newRiskTypeOBJ.LRF.active') == false && component.get('v.newRiskTypeOBJ.HRF.active') == true && normalMax >= lrfMax){
	        minVal = normalMax;
    		var hrfMin = ++normalMax;
	        maxVal = hrfMin;
            component.set('v.newRiskTypeOBJ.HRF.minValue', hrfMin);
            component.set('v.newRiskTypeOBJ.HRF.maxValue', 100);

        }
        else{
        	var normalMax = parseInt(component.get('v.newRiskTypeOBJ.NORMAL.maxValue'));
            component.set('v.newRiskTypeOBJ.LRF.minValue', ++normalMax);
        	minVal = component.get('v.newRiskTypeOBJ.NORMAL.maxValue');
	        maxVal = component.get('v.newRiskTypeOBJ.LRF.maxValue');
            if(component.get('v.newRiskTypeOBJ.LRF.active') == false && component.get('v.newRiskTypeOBJ.HRF.active') == false){
                component.set('v.newRiskTypeOBJ.LRF.active',true);
                var lrfMin = normalMax;
                component.set('v.newRiskTypeOBJ.LRF.minValue', lrfMin);
                component.set('v.newRiskTypeOBJ.LRF.maxValue', 100);
                component.set('v.newRiskTypeOBJ.HRF.active',false);
                maxVal = 100;
            }
        }
        
        if(component.get('v.newRiskTypeOBJ.LRF.active') == false){
            component.set('v.newRiskTypeOBJ.LRF.minValue', 0);
            component.set('v.newRiskTypeOBJ.LRF.maxValue', 0);            
        }
        if(component.get('v.newRiskTypeOBJ.HRF.active') == false){
            component.set('v.newRiskTypeOBJ.HRF.minValue', 0);
            component.set('v.newRiskTypeOBJ.HRF.maxValue', 0);            
        }

        component.set('v.minRiskTypeValue', minVal);
        component.set('v.maxRiskTypeValue', maxVal);        
        var riskTypeChangeEvent = component.getEvent("riskTypeChangeEvent");
        riskTypeChangeEvent.fire();

        var riskCriteriaEvent = component.getEvent("riskCriteriaEvent");
        riskCriteriaEvent.fire();	
	},

	getHandleLRFMaxChange : function(component,event,helper){
	
        var lrfMax = parseInt(component.get('v.newRiskTypeOBJ.LRF.maxValue'));
		var normalMax = parseInt(component.get('v.newRiskTypeOBJ.NORMAL.maxValue'));        
        component.set('v.newRiskTypeOBJ.LRF.active',true);
        if(lrfMax == 100){
	        component.set('v.newRiskTypeOBJ.HRF.active',false);
    		var lrfMin = normalMax+1;
            component.set('v.newRiskTypeOBJ.LRF.minValue', lrfMin);
        }
        else if(lrfMax < 3){
	        component.set('v.newRiskTypeOBJ.LRF.active',false);
        	if(component.get('v.newRiskTypeOBJ.HRF.active') == true){
        		var normalMax = parseInt(component.get('v.newRiskTypeOBJ.NORMAL.maxValue'));
	            component.set('v.newRiskTypeOBJ.HRF.minValue', ++normalMax);
	        	component.set('v.newRiskTypeOBJ.HRF.maxValue', 100);        	
        	}
        	else{
	            component.set('v.newRiskTypeOBJ.NORMAL.maxValue', 100);
        	}
        }
        else if(lrfMax >= 3){
    		if(normalMax >= lrfMax){
	    		var lrfMin = lrfMax-1;
	            component.set('v.newRiskTypeOBJ.LRF.minValue', lrfMin);
	            var normalMax = lrfMin-1;
	            component.set('v.newRiskTypeOBJ.NORMAL.maxValue', normalMax);
    		}    		
    		if(parseInt(component.get('v.newRiskTypeOBJ.LRF.minValue')) == 0){
	            var normalMax = parseInt(component.get('v.newRiskTypeOBJ.NORMAL.maxValue')); 
	    		var lrfMin = normalMax+1;
	            component.set('v.newRiskTypeOBJ.LRF.minValue', lrfMin);   		
    		}
	        component.set('v.newRiskTypeOBJ.HRF.active',true);
    		var hrfMin = ++lrfMax;
            component.set('v.newRiskTypeOBJ.HRF.minValue', hrfMin);
            component.set('v.newRiskTypeOBJ.HRF.maxValue', 100);
        }
        
        if(component.get('v.newRiskTypeOBJ.LRF.active') == false){
            component.set('v.newRiskTypeOBJ.LRF.minValue', 0);
            component.set('v.newRiskTypeOBJ.LRF.maxValue', 0);            
        }
        if(component.get('v.newRiskTypeOBJ.HRF.active') == false){
            component.set('v.newRiskTypeOBJ.HRF.minValue', 0);
            component.set('v.newRiskTypeOBJ.HRF.maxValue', 0);            
        }
    	var minVal = parseInt(component.get('v.newRiskTypeOBJ.NORMAL.maxValue'));
        var maxVal = parseInt(component.get('v.newRiskTypeOBJ.LRF.maxValue'));
        if(component.get('v.newRiskTypeOBJ.LRF.active') == false && component.get('v.newRiskTypeOBJ.HRF.active') == true){
        	maxVal = parseInt(component.get('v.newRiskTypeOBJ.HRF.minValue'));
        }
        if(component.get('v.newRiskTypeOBJ.LRF.active') == false && component.get('v.newRiskTypeOBJ.HRF.active') == false){
        	maxVal = minVal;
        }        
        component.set('v.minRiskTypeValue', minVal);
        component.set('v.maxRiskTypeValue', maxVal);        
        var riskTypeChangeEvent = component.getEvent("riskTypeChangeEvent");
        riskTypeChangeEvent.fire();        
        var riskCriteriaEvent = component.getEvent("riskCriteriaEvent");
        riskCriteriaEvent.fire();				
	}
	
})