({
    doInit : function(component,event,helper,groupLocale) {
        var action = component.get("c.Initialization");
        action.setParams({groupLocale:groupLocale});
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var results = response.getReturnValue();
                var lrfActive;
                var hrfActive;
                var hrfMinValue;
                results.forEach(function (result){
                    if(result.RiskTypeName__c == "LRF"){
                        component.set('v.maxSliderValue', result.Max_Value__c);
                        lrfActive = result.Active__c;
                    }
                    if(result.RiskTypeName__c == "NORMAL"){
                        component.set('v.minSliderValue', result.Max_Value__c);
                    }   
                    if(result.RiskTypeName__c == "HRF"){
                    	hrfActive = result.Active__c;
                    	hrfMinValue = result.Min_Value__c;
                    }   

                });
                if(lrfActive == false){
                	if(hrfActive == true){
                        component.set('v.maxSliderValue', hrfMinValue);
                	}
                	else{
                		component.set('v.maxSliderValue', component.get('v.minSliderValue'));
                	}
                }
                helper.jsLoaded(component,event,helper);
                component.set('v.records', results);
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
    
    jsLoaded: function(component, event, helper) {
        var step = parseInt(component.get("v.step"), 10);
        var slider = component.find('slider').getElement();  
        setTimeout(function() {
            
            noUiSlider.create(slider, {
                start: [0,component.get('v.minSliderValue'),component.get('v.maxSliderValue'),100],
                behaviour: 'unconstrained-tap',
                connect: true,
                step: step,
                tooltips: true,
                format: wNumb({
                    decimals: 0
                }),            
                range: {
                    'min': 0,
                    'max': 100
                }
            });
            
            var origins = slider.getElementsByClassName('noUi-origin');       
            
            origins[0].setAttribute('disabled',true);
            origins[3].setAttribute('disabled',true);
            
            var connect = slider.querySelectorAll('.noUi-connect');
            var classes = ['c-1-color', 'c-2-color', 'c-3-color'];
            
            for (var i = 0; i < connect.length; i++) {
                connect[i].classList.add(classes[i]);
            }
            
        slider.noUiSlider.on('update', function (values) {
            if (parseInt(values[3],10) < 100){
                values[3] = 100;
            }
            var normalMaxValue = parseInt(values[1],10);
            var lrfMaxValue = parseInt(values[2],10);        
            if(normalMaxValue > lrfMaxValue) {
                var tmp = lrfMaxValue; 
                lrfMaxValue = normalMaxValue; 
                normalMaxValue = tmp;                
            }
            component.set('v.maxSliderValue', lrfMaxValue);
            component.set('v.minSliderValue',normalMaxValue);
        });
        
        slider.noUiSlider.on('change', $A.getCallback(function(range) {
            
            var slider = component.find('slider').getElement();
            var connect = slider.querySelectorAll('.noUi-connect');
            var classes = ['c-1-color', 'c-2-color', 'c-3-color'];
            
            for (var i = 0; i < connect.length; i++) {
                connect[i].classList.add(classes[i]);
            }
            var lrfMaxValue = component.get('v.maxSliderValue');
            var normalMaxValue = component.get('v.minSliderValue');        
            
            if(normalMaxValue > lrfMaxValue) {
                var tmp = lrfMaxValue; 
                lrfMaxValue = normalMaxValue; 
                normalMaxValue = tmp;                
            }
            component.set('v.minSliderValue', normalMaxValue);
            component.set('v.maxSliderValue', lrfMaxValue);
            var sliderChangeEvent = component.getEvent("sliderChangeEvent");
            sliderChangeEvent.setParams({
                "maxSliderValue": component.get('v.maxSliderValue'),
                "minSliderValue": component.get('v.minSliderValue')
            })            
            sliderChangeEvent.fire();
            var riskCriteriaEvent = component.getEvent("riskCriteriaEvent");
            riskCriteriaEvent.fire();           
        }));
            
        }, 250);
        
        
    }
    
})