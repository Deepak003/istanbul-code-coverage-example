({
	doInit : function(component, event, helper) {
		helper.doInit(component,'English');	
	    var riskTypeOptionByLocale = {        
        "English" :[{'key':'Standard', 'value':'Standard'}, {'key':'Email','value':'Email'}, {'key':'en Email + C2C','value':'Email + C2C'}, {'key':'Dummy Case','value':'Dummy Case'}, {'key':'Multi Language Email','value':'Multi-Language Email'}],
        "English Supported" :[{'key':'Standard', 'value':'Standard'}, {'key':'Email','value':'Email'}, {'key':'en Email + C2C','value':'Email + C2C'}, {'key':'Dummy Case','value':'Dummy Case'}, {'key':'Multi Language Email','value':'Multi-Language Email'}],
        "All Other" :[{'key':'Standard', 'value':'Standard'}, {'key':'Email','value':'Email'}, {'key':'en Email + C2C','value':'Email + C2C'}, {'key':'Dummy Case','value':'Dummy Case'}, {'key':'Multi Language Email','value':'Multi-Language Email'}],
        "Italian" :[{'key':'Standard', 'value':'Standard'}, {'key':'Email','value':'Email'}, {'key':'en Email + C2C','value':'EN Email + C2C'},{'key':'it Email + C2C','value':'IT Email + C2C'}, {'key':'Dummy Case','value':'Dummy Case'}, {'key':'Multi Language Email','value':'Multi-Language Email'}],
        "Spanish" :[{'key':'Standard','value':'Standard'}, {'key':'Email','value':'Email'}, {'key':'es Email + C2C','value':'ES Email + C2C'},  {'key':'en Email + C2C','value':'EN Email + C2C'}, {'key':'Dummy Case','value':'Dummy Case'}, {'key':'Multi Language Email','value':'Multi-Language Email'}],
        "German" :[{'key':'Standard','value':'Standard'}, {'key':'Email','value':'Email'}, {'key':'de Email + C2C','value':'DE Email + C2C'},  {'key':'en Email + C2C','value':'EN Email + C2C'},  {'key':'Dummy Case','value':'Dummy Case'}, {'key':'Multi Language Email','value':'Multi-Language Email'}],
        "French" :[{'key':'Standard','value':'Standard'}, {'key':'Email','value':'Email'}, {'key':'fr Email + C2C','value':'FR Email + C2C'}, {'key':'en Email + C2C','value':'EN Email + C2C'},  {'key':'Dummy Case','value':'Dummy Case'}, {'key':'Multi Language Email','value':'Multi-Language Email'}]
	    };
	    var selectedLocale = component.get('v.selectedLocale');
        component.set('v.riskTypeOptionByLocale',riskTypeOptionByLocale);
	    component.set('v.routingOptionsObj',riskTypeOptionByLocale[selectedLocale]);
	},
    handleNormalMaxChange : function(component, event, helper) { 
    	helper.getHandleNormalMaxChange(component,event,helper);                
    },
    handleLRFMaxChange: function(component, event, helper) {
    	helper.getHandleLRFMaxChange(component,event,helper);        
    },
    onRiskTypeFlagLRFFlagChangeEvent: function (component,event,helper) {
            
	    var riskTypeLRFFlag = component.find('riskTypeLRF').get('v.value');

	    if(riskTypeLRFFlag == false){ 
	        var normalMax = parseInt(component.get('v.newRiskTypeOBJ.NORMAL.maxValue'));
	        var lrfMax = parseInt(component.get('v.newRiskTypeOBJ.LRF.maxValue'));
	        component.set('v.minRiskTypeValue', normalMax);
	        component.set('v.newRiskTypeOBJ.LRF.minValue', 0);
	        component.set('v.newRiskTypeOBJ.LRF.maxValue', 0); 
	        
	        var hrfMin = normalMax;
	        if(lrfMax != 100){
	        	hrfMin = hrfMin + 1;	        
	        }
	        component.set('v.newRiskTypeOBJ.HRF.minValue', hrfMin);
	        component.set('v.maxRiskTypeValue', hrfMin);
	        
    	    var riskTypeHRFFlag = component.find('riskTypeHRF').get('v.value');
	        if(riskTypeHRFFlag == false){
		        component.set('v.minRiskTypeValue', 100);
	    	    component.set('v.newRiskTypeOBJ.NORMAL.maxValue', 100);
		        component.set('v.newRiskTypeOBJ.LRF.minValue', 0);
		        component.set('v.newRiskTypeOBJ.LRF.maxValue', 0); 
		        component.set('v.newRiskTypeOBJ.HRF.minValue', 0);
		        component.set('v.maxRiskTypeValue', 100);
		    }
	        
	    }
	    
	    if(riskTypeLRFFlag == true){
	    
	        var hrfMin = component.get('v.newRiskTypeOBJ.HRF.minValue');
	        var normalMax = component.get('v.newRiskTypeOBJ.NORMAL.maxValue');
	        component.set('v.minRiskTypeValue', normalMax);
	        var lrfMin = ++normalMax;
	        component.set('v.newRiskTypeOBJ.LRF.minValue', lrfMin);
	        var lrfMax = ++lrfMin;
	        component.set('v.newRiskTypeOBJ.LRF.maxValue', lrfMax); 
	        var hrfMin = ++lrfMax; 
	        component.set('v.newRiskTypeOBJ.HRF.minValue', hrfMin);
	        component.set('v.maxRiskTypeValue', hrfMin);
        	if(normalMax == 99){
            	normalMax = --normalMax ;
	        	component.set('v.minRiskTypeValue', normalMax - 2);
        	    component.set('v.newRiskTypeOBJ.NORMAL.maxValue', normalMax - 2);
	        	
	        	component.set('v.newRiskTypeOBJ.LRF.minValue', normalMax -1);
	        	component.set('v.newRiskTypeOBJ.LRF.maxValue', normalMax);
		    	component.set('v.newRiskTypeOBJ.HRF.minValue',normalMax + 1);
	        
	        }
    	    var riskTypeHRFFlag = component.find('riskTypeHRF').get('v.value');
	        if(riskTypeHRFFlag == false){
		        component.set('v.minRiskTypeValue', 98);
        	    component.set('v.newRiskTypeOBJ.NORMAL.maxValue', 98);
		        component.set('v.newRiskTypeOBJ.LRF.maxValue', 100);
		        component.set('v.newRiskTypeOBJ.LRF.minValue', 99);
		        component.set('v.maxRiskTypeValue', 100);
		        component.set('v.newRiskTypeOBJ.HRF.maxValue', 0);
		        component.set('v.newRiskTypeOBJ.HRF.minValue', 0);		        	
	        }
	    }
	    
        var riskTypeChangeEvent = component.getEvent("riskTypeChangeEvent");
        riskTypeChangeEvent.fire();
        
        var riskCriteriaEvent = component.getEvent("riskCriteriaEvent");
        riskCriteriaEvent.fire();		    	    	
    
	    	
    },
    onRiskTypeFlagHRFFlagChangeEvent : function(component,event,helper){
	    var riskTypeHRFFlag = component.find('riskTypeHRF').get('v.value');
	    if(riskTypeHRFFlag == false){
	    	var lrfMin = component.get('v.newRiskTypeOBJ.NORMAL.maxValue');
	        component.set('v.minRiskTypeValue', lrfMin);
	        var hrfMax = component.get('v.newRiskTypeOBJ.HRF.maxValue');
	        component.set('v.newRiskTypeOBJ.LRF.maxValue', hrfMax);
	        component.set('v.newRiskTypeOBJ.HRF.minValue', 0);
	        component.set('v.newRiskTypeOBJ.HRF.maxValue', 0);         
	        component.set('v.maxRiskTypeValue', hrfMax);
	        var riskTypeLRFFlag = component.find('riskTypeLRF').get('v.value');
    	    if(riskTypeLRFFlag == false){
		        component.set('v.minRiskTypeValue', 100);
	    	    component.set('v.newRiskTypeOBJ.NORMAL.maxValue', 100);
		        component.set('v.newRiskTypeOBJ.LRF.minValue', 0);
		        component.set('v.newRiskTypeOBJ.LRF.maxValue', 0); 
		        component.set('v.newRiskTypeOBJ.HRF.minValue', 0);
		        component.set('v.maxRiskTypeValue', 100);
	        }
	    }
	    if(riskTypeHRFFlag == true){
	    	var lrfMin = component.get('v.newRiskTypeOBJ.NORMAL.maxValue');
	        component.set('v.minRiskTypeValue', lrfMin);
	        component.set('v.newRiskTypeOBJ.LRF.minValue', ++lrfMin);
	    	var lrfMax = component.get('v.newRiskTypeOBJ.LRF.maxValue');
	        component.set('v.newRiskTypeOBJ.HRF.maxValue', lrfMax);
	    	var hrfMin = --lrfMax;
	        component.set('v.newRiskTypeOBJ.HRF.minValue', hrfMin);
	        lrfMax = --hrfMin ;
	        component.set('v.newRiskTypeOBJ.LRF.maxValue', lrfMax);     
	        component.set('v.maxRiskTypeValue', lrfMax);
	        if(lrfMax == 98 && component.get('v.newRiskTypeOBJ.LRF.minValue') >= 98){
	        	component.set('v.minRiskTypeValue', lrfMin - 2);
	        	component.set('v.newRiskTypeOBJ.LRF.minValue', lrfMin - 2);
		    	component.set('v.newRiskTypeOBJ.NORMAL.maxValue',lrfMin - 3);
	        
	        }
	        var riskTypeLRFFlag = component.find('riskTypeLRF').get('v.value');    
	        if(riskTypeLRFFlag == false){
		        component.set('v.minRiskTypeValue', 98);
        	    component.set('v.newRiskTypeOBJ.NORMAL.maxValue', 98);
		        component.set('v.newRiskTypeOBJ.LRF.maxValue', 0);
		        component.set('v.newRiskTypeOBJ.LRF.minValue', 0);
		        component.set('v.maxRiskTypeValue', 100);
		        component.set('v.newRiskTypeOBJ.HRF.maxValue', 100);
		        component.set('v.newRiskTypeOBJ.HRF.minValue', 99);
	        }
	    
 	    }
        var riskTypeChangeEvent = component.getEvent("riskTypeChangeEvent");
        riskTypeChangeEvent.fire();
        
        var riskCriteriaEvent = component.getEvent("riskCriteriaEvent");
        riskCriteriaEvent.fire();		    	    	
    
	    
    
    },
    onChangeEvent: function (component,event,helper) {
        var riskCriteriaEvent = component.getEvent("riskCriteriaEvent");
        riskCriteriaEvent.fire();
    }
})